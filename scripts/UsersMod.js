
'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the minovateApp
 */
app
  .controller('UserCtrl', function ($scope, $mdDialog, $http, $rootScope, $cookies, arrayPushService,$location,toaster, baseURL, $timeout) {

     $scope.page = {
      title: 'Users',
      subtitle: ''
    };
	$rootScope.facilityId = $cookies.get("facilityId");

    if($cookies.get("user_id") == undefined)
    {
    	$("md-tab-item[aria-controls^=tab-content]:contains('Credentials')").css("pointer-events", "none").css("opacity", "0.5");	
    	$("md-tab-item[aria-controls^=tab-content]:contains('User Groups')").css("pointer-events", "none").css("opacity", "0.5");
    }

	$scope.result = '';
    $scope.showConfirm = function(ev,id) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete User?')
		.content('')
		.ok('Delete')
		.cancel('Cancel')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			
			
			$http(
			{
				method: 'DELETE', 
				url: baseURL + 'user/delete?user_id='+id,
				dataType : 'JSON', 
				headers: {
					"Content-type": "application/json",
					"Authorization": $cookies.get("token")
				}
			})
			.success(function(response){
				if(response.status == true){
					$scope.result = 'Your User has been deleted successfully.';
					$scope.statusclass = 'alert alert-danger alert-dismissable';
					toaster.pop('success',$scope.result);
					var users = $scope.users;
					var tempUser = [];
					for(var i=0;i<users.length;i++){
						if(id != users[i].user_id){
							tempUser.push(users[i]);
						}
					}
					$scope.users = tempUser;
				}else{
					if(response.msg == 'Invalid_Token'){
						toaster.pop('error','Session Expired');
						$cookies.remove("token");
						$location.path('/core/login');
					}
					toaster.pop('error',response.msg.replace(/_/g,' '));
				}
			}).error(function(){

			});
			
			
		}, function() {
			$scope.result = 'You decided to keep User.';
			$scope.statusclass = 'alert alert-success alert-dismissable';
		});
    };
	
	$scope.layout = 'grid';
	$scope.class = 'gridview';
	$scope.changeClass = function(){
		if ($scope.class === 'gridview')
		$scope.class = 'listview';
		$scope.layout = 'list';
	};
	
	$scope.changeaClass = function(){
		if ($scope.class === 'listview')
		$scope.class = 'gridview';
		$scope.layout = 'grid';
	};
	
	
	$scope.pageNo = 1;
	$scope.searchText = '';
	$scope.users = [];
	$scope.usersInit = function(){
		
		$http(
		{
			method: 'GET', 
			url: baseURL + 'user/list?limit=8&pageNo='+$scope.pageNo+'&searchVal='+$scope.searchText+'&facilityId='+$rootScope.facilityId,
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$scope.users =  arrayPushService.arrayPush(response.data.data, $scope.users);
				$scope.pageNo = $scope.pageNo + 1 ;
			}else{
				if(response.data == null){
					$(".f-wm:contains(Load more)").text("No more data available").css( "opacity" , 0.7);
				}
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}
			}
		}).error(function(){

		});
	}
	$scope.usersInit();
	
	$scope.searchFunction = function(e){
		if(e)
		if(e.keyCode!=13){return false;}
		if(!$scope.searchText){
			$scope.searchText = '';
		}
		$scope.pageNo = 1;
		$scope.users =[];
		
		$http(
		{
			method: 'GET', 
			url: baseURL + 'user/list?limit=8&pageNo='+$scope.pageNo+'&searchVal='+$scope.searchText+'&facilityId='+$rootScope.facilityId,
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$scope.users =  response.data.data;
				$scope.pageNo = $scope.pageNo + 1 ;
			}else{
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}
			}
		}).error(function(){

		});	
	}
	
	$scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }
	
	$scope.imagePath = 'http://localhost:8080/elika/images';
	
	$rootScope.submitUserData = function(userData, user_form){
		if(!user_form.validate({
			rules: {
        user_phone_no: {
            rangelength: [10,12]
        }
		}
    })){
			return false;
		}
		if(userData == undefined){
			$rootScope.user_error = "Please fill form.";
			return false;
		}
		userData.user_phone_no = parseInt(userData.user_phone_no);
		userData.user_type = 'admin';
		userData.facility_id = 3;
		if(userData.password != userData.cpassword){
			alert("Password and Confirm password not matched");
			return false;
		}
		$http(
		{
			method: 'POST', 
			url: baseURL+'user/add',
			dataType : 'JSON', 
			data:userData,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			$rootScope.user_error = "";
			$rootScope.accesscode = {};
			var x = Math.floor(Math.random()*9999999999) + 10000;
			$rootScope.accesscode.access_code = parseInt((""+x).substring(8, length));
			$rootScope.accesscode.access_code_status = 'Active';
			if(response.status == true){
				$cookies.put("user_id", response.data.user_id);
				$("md-tab-item[aria-controls^=tab-content]:contains('Credentials')").css("pointer-events", "visible").css("opacity", "1");	
				$("md-tab-item[aria-controls^=tab-content]:contains('User Groups')").css("pointer-events", "visible").css("opacity", "1");
				$("md-tab-item[aria-controls^=tab-content]:contains('Account')").css("pointer-events", "none").css("opacity", "0.7");
				$timeout(function() {
				$(".ng-scope:contains(Credentials)").trigger( "click" );
				});
				$timeout(function() {
					$scope.assignedGroup();
				});
				$timeout(function() {
					$scope.unassignedGroup();
				});
			}else{

				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}
				
				var n = [];
				var arr = response.error;
				if(arr != null){
				$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1) ; $.each(value.messages, function(ind, value){ n[index] += " "+value })});
				$rootScope.user_error = n.join(", ");
				}
				else{
					$rootScope.user_error = response.msg.replace(/_/g,' ');
				}
				
			}
		}).error(function(){
		});
	}

	$rootScope.saveRFID = function(rfid, rfid_form){
		if(!rfid_form.validate()){
			return false;
		}
		if(rfid == undefined){
			$rootScope.rfid_error = "Please fill form.";
			return false;
		}
		rfid.user_id = parseInt($cookies.get("user_id"));
		rfid.rfid_facility_code = parseInt(rfid.rfid_facility_code);
		rfid.rfid_card_no = parseInt(rfid.rfid_card_no);
		// rfid.rfid_status = (rfid.rfid_status == "Active" ? 1 : 0)
		$http(
		{
			method: 'PUT', 
			url: baseURL+'user/edit-rfid-code/',
			dataType : 'JSON', 
			data:rfid,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			$rootScope.rfid_error = "";
			// $rootScope.rfid = {};
			// $rootScope.rfid.rfid_status = (rfid.rfid_status == 1 ? "Active" : "Inactive")
			if(response.status == true){
				$timeout(function() {
					$(".accordion-toggle")[3].click();
				});
				toaster.pop('success','RFID Added Successfully');
			}else{
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}
				
				var n = [];
				var arr = response.error;
				if(arr != null){
				$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' '); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
				$rootScope.rfid_error = n.join(", ");
				}
				else{
					$rootScope.rfid_error = response.msg.replace(/_/g,' ');
				}
			}
		}).error(function(){

		});
	}

	$rootScope.phoneCode = {};
	var x = Math.floor(Math.random()*9999999999) + 10000;
	$rootScope.phoneCode.phone_code = (""+x).substring(8, length);

	$rootScope.submitPhoneCode = function(phoneCode){
		// http://[base_url]/user/assign-phone-code
		phoneCode.user_id = parseInt($cookies.get("user_id"));
		phoneCode.phone_code = "" + phoneCode.phone_code;
		phoneCode.phone_numbers = [];
		phoneCode.phone_numbers[0] = $("#todo").val();
		$.each($(".todo-list .ng-binding"), function(index, value){ 
			phoneCode.phone_numbers[index+1] = $(this).text();
		});

		$http(
		{
			method: 'PUT', 
			url: baseURL+'user/edit-phone-code',
			dataType : 'JSON', 
			data: phoneCode,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$timeout(function() {
					$(".accordion-toggle")[2].click();
				});
				toaster.pop('success','Phone Code Added Successfully');
			}else{
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}
				
				var n = [];
				var arr = response.error;
				if(arr != null){
				$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' '); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
				$rootScope.phone_error = n.join(", ");
				}
				else{
					$rootScope.phone_error = response.msg.replace(/_/g,' ');
				}	
			}
		}).error(function(){

		});
	}

	$rootScope.saveBLEcode = function(ble_code, ble_form){
		if(!ble_form.validate()){
			return false;
		}
		if(ble_code == undefined){
			$rootScope.blecode_error = "Please fill form.";
			return false;
		}
		if(ble_code.ble_pass != ble_code.cnf_ble_pass){
			$rootScope.blecode_error = "Password must match to confirm password.";
			return false;
		}
		// ble_code.ble_status = ("Active" ? 1 : 0)
		ble_code.user_id = parseInt($cookies.get("user_id"));
		$http(
		{
			method: 'PUT', 
			url: baseURL+'user/edit-ble-code',
			dataType : 'JSON', 
			data: ble_code,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$timeout(function() {
				$(".ng-scope:contains(User Groups)").trigger( "click" );
				});
				toaster.pop('success','BLE Code Added Successfully');
				
			}else{
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}

				var n = [];
				var arr = response.error;
				if(arr != null){
				$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' '); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
				$rootScope.blecode_error = n.join(", ");
				}
				else{
					$rootScope.blecode_error = response.msg.replace(/_/g,' ');
				}
			}
		}).error(function(){

		});
	}

	$rootScope.generateAddAccessCode = function(){ 
		$rootScope.accesscode = {};
		var x = Math.floor(Math.random()*9999999999) + 10000;
		$rootScope.accesscode.access_code = parseInt((""+x).substring(8, length));
	}

	$rootScope.generateAddPhoneCode = function(){
		$rootScope.phoneCode = {};
		var x = Math.floor(Math.random()*9999999999) + 10000;
		$rootScope.phoneCode.phone_code = (""+x).substring(8, length);
	}

	$rootScope.generateNFCCode = function(){
		$rootScope.savenfc = {};
		var x = Math.floor(Math.random()*9999999999) + 10000;
		$rootScope.savenfc.nfc_code = (""+x).substring(8, length);
	}

	//NFC code edit
	$rootScope.saveNFCcode = function(submitData, nfc_form){
		if(!nfc_form.validate()){
			return false;
		}
		var x = Math.floor(Math.random()*9999999999) + 10000;
		submitData.nfc_code = parseInt((""+x).substring(8, length));
		submitData.nfc_facility_code = parseInt($cookies.get("facilityId"));
		submitData.user_id = parseInt($cookies.get("user_id"));
		$http(
		{
			method: 'PUT', 
			url: baseURL + 'user/edit-nfc-code',
			dataType : 'JSON',
			data:submitData,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
			
		}).success(function(response){
			if(response.status == true){
				toaster.pop('success','Submitted Successfully');
				$timeout(function() {
					$(".accordion-toggle")[4].click();
				});
			}
			else{
				var arr = response.error;
				if(response.error != "" && response.error != null){
					var n = [];
					$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
					$rootScope.NFCCodeMessage = n.join(", ");
				}
				else{
					if(response.msg == 'Invalid_Token'){
						toaster.pop('error','Session Expired');
						$cookies.remove("token");
						$location.path('/core/login');
					}
					
					//$rootScope.masters[0] = response.msg.replace(/_/g, " ");
				}
			}
			
			
			//$scope.submitEditPhoneCode(submitData);
		}).error(function(){

		});
	}

	//End Of NFC Code Edit

	$rootScope.saveAccessCode = function(accesscode){
		$rootScope.accesscode.access_code_status = ($rootScope.accesscode.access_code_status == "Active" ? 1 : 0)
		$rootScope.accesscode.user_id = parseInt($cookies.get("user_id"));
		$http(
		{
			method: 'PUT', 
			url: baseURL+'user/edit-access-code',
			dataType : 'JSON', 
			data: accesscode,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			$rootScope.accesscode.access_code_status = ($rootScope.accesscode.access_code_status == 1 ? "Active" : "Inactive")
			if(response.status == true){
				$timeout(function() {
				$(".accordion-toggle")[1].click();
				});
				toaster.pop('success','Access Code Added Successfully');
				
			}else{
				
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}

				var n = [];
				var arr = response.error;
				$.each(arr, function(index, value){ n[index] = value.property ; $.each(value.messages, function(ind, value){ n[index] += " "+value })});
				$rootScope.accesscode_error = n.join(", ");
				if (n.length == 0)
				$rootScope.accesscode_error = response.msg.replace(/_/g,' ');
				
			}
		}).error(function(){

		});
	}
	$rootScope.usergroup = {};
	$rootScope.usergroup.usergrouparr = [];

	$rootScope.assignUserGroup = function(user_group){
		var arr  = [];
		$.each(user_group.usergrouparr, function(index, value){ 
			if(value == true){
				arr.push(index);
			}
		 })
		$http(
		{
			method: 'POST', 
			url: baseURL+'user/assign-usergroup',
			dataType : 'JSON', 
			data: { "user_id": parseInt($cookies.get("user_id")), "user_group_id": arr },
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$rootScope.usergroupmsg = response.msg;
			}else{	
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}
				$rootScope.usergroupmsg = response.msg;

			}
			$timeout(function() {
				$scope.assignedGroup();
			}, 1000);
		}).error(function(){

		});

	}


	$rootScope.unassignUserToUsergroup = function(user_group_id){
		$http(
		{
			method: 'POST', 
			url: baseURL+'user/remove-usergroup',
			dataType : 'JSON', 
			data: { "user_id": parseInt($cookies.get("user_id")), "user_group_id": user_group_id },
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$scope.unassignedUserGroup = "User group removed.";
			}else{	
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}
			}
			$timeout(function() {
				$scope.assignedGroup();
			}, 1000);
		}).error(function(){

		});
	}

	$scope.assignedGroup = function(){
		$http(
		{
			method: 'POST', 
			url: baseURL+'user/usergroup-assigned-to-user',
			dataType : 'JSON', 
			data: { "user_id": parseInt($cookies.get("user_id")) },
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$rootScope.assingned_usergroups = response.data;
			}else{	
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}
			}
		}).error(function(){

		});
	}

	$scope.unassignedGroup = function(){
		$http(
		{
			method: 'POST', 
			url: baseURL+'user/usergroup-not-assigned-to-user',
			dataType : 'JSON', 
			data: { "user_id": parseInt($cookies.get("user_id")) },
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$rootScope.usergroups = response.data;
			}else{	
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}
			}
		}).error(function(){

		});
	}

	$scope.dashboardInit = function(){ 
	 $http({url: baseURL + 'user/dashboard',   method: 'GET',   dataType : 'JSON',   headers: {    "Authorization": $cookies.get("token"),    "Content-type": "application/json"   }  })  
	 	.success(function(response) {   if(response.status == true){    $rootScope.dashboardData = response.data[0];     console.log($rootScope.dashboardData);   }  })  
	 	.error(function (data, status, headers, config) {     }); } 

	if(!$rootScope.hasOwnProperty('dashboardData')){  $scope.dashboardInit(); }
	
});

'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:UserProfileCtrl
 * @description
 * # UserProfileCtrl
 * Controller of the minovateApp
 */
app
  .controller('UserProfileCtrl', function ($scope,$http,$cookies, $stateParams, baseURL, $rootScope,$location,toaster,$timeout, $mdDialog) {
     $scope.page = {
      title: 'Arnold',
      subtitle: 'So much more to see at a glance.'
    };
	$scope.editUser = {};
	$("#mask02").datepicker();
	
	$scope.profileInit = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL + 'user/view-user-details?user_id='+$stateParams.user_id,
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$scope.userData = response.data;
				$scope.editUser.user_id = $stateParams.user_id;
				$scope.editUser.first_name = angular.copy($scope.userData.user_first_name);
				$scope.editUser.last_name = angular.copy($scope.userData.user_last_name);
				$scope.editUser.address = angular.copy($scope.userData.user_address);
				$scope.editUser.email = angular.copy($scope.userData.user_email);
				$scope.editUser.expiration_date = angular.copy($scope.userData.user_expiration_date);
				$scope.editUser.status = angular.copy($scope.userData.user_status);
				
				$scope.editUser.access_code = angular.copy($scope.userData.access_code);
				$scope.editUser.access_code_status = angular.copy($scope.userData.access_status);
				$scope.editUser.phone_code = angular.copy($scope.userData.phone_code);
				$scope.editUser.phone_code_status = angular.copy($scope.userData.phone_status);
				$scope.editUser.nfc_code = angular.copy($scope.userData.nfc_code);
				$scope.editUser.rfid_card_no = angular.copy($scope.userData.rfid_card_number);
				

				$rootScope.todos = [];
				var todos = $rootScope.todos;
				
	      $rootScope.todos.push({
	        text: $scope.userData.phone_number_1,
	        completed: false
	      });


				$scope.editUser.phone_numbers = angular.copy($scope.userData.phone_number_1);
				$scope.editUser.rfid_facility_code = angular.copy($scope.userData.rfid_facility_code);
				$scope.editUser.rfid_status = angular.copy($scope.userData.rfid_sttaus);
				$scope.editUser.ble_name = angular.copy($scope.userData.ble_name);
				$scope.editUser.ble_status = angular.copy($scope.userData.ble_status);
				$scope.editUser.ble_pass = angular.copy($scope.userData.ble_pass);
				$scope.editUser.description = angular.copy($scope.userData.user_description);
				$scope.editUser.user_phone_no = angular.copy($scope.userData.user_phone_no);
				$scope.editUser.user_status = angular.copy($scope.userData.user_status);
				if($scope.userData.access_status == undefined)
				{
					$scope.editUser.access_code_status = 1;
				}
				else{
					$scope.editUser.access_code_status = angular.copy($scope.userData.access_status);
				}
				if($scope.userData.rfid_status == undefined)
				{
					$scope.editUser.rfid_status = 1;
				}
				else{
					$scope.editUser.rfid_status = angular.copy($scope.userData.rfid_status);
				}
				if($scope.userData.ble_status == undefined)
				{
					$scope.editUser.ble_status = 1;
				}
				else{
					$scope.editUser.ble_status = angular.copy($scope.userData.ble_status);
				}
				if($scope.userData.nfc_code_status == undefined)
				{
					$scope.editUser.nfc_code_status = 1;
				}
				else{
					$scope.editUser.nfc_code_status = angular.copy($scope.userData.nfc_code_status);
				}

				$scope.userData.user_status = ($scope.userData.user_status == 1 ? "Active" : ($scope.userData.user_status == 0 ? "Inactive" : "NA"));
				$scope.userData.ble_status = ($scope.userData.ble_status == 1 ? "Active" : ($scope.userData.ble_status == 0 ? "Inactive" : "NA"));
				$scope.userData.rfid_sttaus = ($scope.userData.rfid_sttaus == 1 ? "Active" : ($scope.userData.rfid_sttaus == 0 ? "Inactive" : "NA"));
				$scope.userData.phone_status = ($scope.userData.phone_status == 1 ? "Active" : ($scope.userData.phone_status == 0 ? "Inactive" : "NA"));
				$scope.userData.access_status = ($scope.userData.access_code_status == 1 ? "Active" : ($scope.userData.access_code_status == 0 ? "Inactive" : "NA"));
				$scope.userData.nfc_code_status = ($scope.userData.nfc_code_status == 1 ? "Active" : ($scope.userData.nfc_code_status == 0 ? "Inactive" : "NA"));
			}else{
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}
			}
		}).error(function(){

		});
	}
	$scope.profileInit();
	
	$rootScope.usergroup = {};
	$rootScope.usergroup.usergrouparr = [];

	$rootScope.assignEditUserGroup = function(user_group){
		var arr  = [];
		$.each(user_group.usergrouparr, function(index, value){ 
			if(value == true){
				arr.push(index);
			}
		 })
		$http(
		{
			method: 'POST', 
			url: baseURL+'user/assign-usergroup',
			dataType : 'JSON', 
			data: { "user_id": parseInt($stateParams.user_id), "user_group_id": arr },
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$rootScope.usergroupmsg = response.msg;
				$rootScope.userNotAssignedGroup();
				toaster.pop('success',response.msg.replace(/_/g," "));
			}else{	
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}
				$rootScope.usergroupmsg = response.msg;
				// $rootScope.cancel();
				toaster.pop('error',response.msg.replace(/_/g," "));
			}
			$timeout(function() {
				$scope.assignedGroup();
				user_group.usergrouparr = [];
			});
			$timeout(function(){$(".group-close").click(); });

		}).error(function(){

		});

	}

	$scope.assignedGroup = function(){
		$http(
		{
			method: 'POST', 
			url: baseURL+'user/usergroup-assigned-to-user',
			dataType : 'JSON', 
			data: { "user_id": parseInt($stateParams.user_id) },
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			$rootScope.nogroup = false;
			if(response.status == true){
				if(response.data == null){
					$rootScope.nogroup = "No UserGroup Assigned";
					$rootScope.userGroup = "";
				}
				else{
					$rootScope.userGroup = response.data;
				}
			}else{	
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}
			}
		}).error(function(){

		});
	}
	
	$scope.assignedGroup();
	$rootScope.userNotAssignedGroup = function(){$http(
		{
			method: 'POST', 
			url: baseURL+'user/usergroup-not-assigned-to-user',
			dataType : 'JSON', 
			data: { "user_id": parseInt($stateParams.user_id) },
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$rootScope.usergroups = response.data;
			}else{	
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}
			}
		}).error(function(){

		});
		}
	$rootScope.userNotAssignedGroup();
	//$rootScope.assignUserGroup();
	
	$scope.deleteGroup = function(id){
		if(!confirm("Are you sure you want to Delete This User Group.")){return false;}
		$http(
		{
			method: 'GET', 
			url: baseURL + 'usergroup/delete?usergroup_id='+id,
			dataType : 'JSON', 
			//data:{'user_id':parseInt($stateParams.user_id)},
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
			
		}).success(function(response){
			if(response.status == true){
				//$scope.userGroup = response.data;
			}else{
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}
			}
		}).error(function(){

		});
	}
	
	var n = [];
	$scope.submitEditUser = function(submitData, user_edit){
		if(!user_edit.validate()){
			return false;
		}
		submitData.status = submitData.user_status
		submitData.user_id = parseInt($stateParams.user_id);
		submitData.user_phone_no = parseInt(submitData.user_phone_no);
		submitData.user_type = 'admin';
		submitData.facility_id = 3;
		$rootScope.masters = []
		$http(
		{
			method: 'PUT', 
			url: baseURL + 'user/edit',
			dataType : 'JSON',
			data:submitData,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		}).success(function(response){
			
			if(response.status == true){
				toaster.pop('success','Submitted Successfully');
				$scope.editUserMessage = "";
			}else{
				// toaster.pop('error',response.msg);
				var arr = response.error;
				if(response.error != ""){
					$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
					$scope.editUserMessage = n;
				}
				else{
					if(response.msg == 'Invalid_Token'){
						toaster.pop('error','Session Expired');
						$cookies.remove("token");
						$location.path('/core/login');
					}
					
					$rootScope.masters[0] = response.msg.replace(/_/g, " ");
					
				}
			}
			//$scope.submitEditAccessCode(submitData);
		}).error(function(){
			toaster.pop('success','Something went wrong!');
		});
	}

	$scope.generateAccessCode = function(){ 
			$scope.editUser.access_code = Date.now();
	}

	$scope.generatePhoneCode = function(){
		var x = Math.floor(Math.random()*9999999999) + 10000;
		$scope.editUser.phone_code = (""+x).substring(8, length);
	}
	
	$scope.submitEditAccessCode = function(submitData, access_edit_form){
		if(!access_edit_form.validate()){
			return false;
		}
		submitData.user_id = parseInt($stateParams.user_id);
		submitData.access_code = parseInt(submitData.access_code);
		$http(
		{
			method: 'PUT', 
			url: baseURL + 'user/edit-access-code',
			dataType : 'JSON',
			data:submitData,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
			
		}).success(function(response){
			if(response.status == true){
				toaster.pop('success','Submitted Successfully');
			}
			else{
				var arr = response.error;
				if(response.error != "" && response.error != null){
					$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
					$rootScope.AccessCodeMessage = n.join(", ");
				}
				else{
					if(response.msg == 'Invalid_Token'){
						toaster.pop('error','Session Expired');
						$cookies.remove("token");
						$location.path('/core/login');
					}
					
					//$rootScope.masters[0] = response.msg.replace(/_/g, " ");
				}
			}
			
			
			//$scope.submitEditPhoneCode(submitData);
		}).error(function(){

		});
	}
	
	//NFC code edit
	$scope.submitEditNfcCode = function(submitData, nfc_edit_form){
		if(!nfc_edit_form.validate()){
			return false;
		}
		submitData.user_id = parseInt($stateParams.user_id);
		submitData.nfc_code = parseInt(submitData.nfc_code);
		submitData.nfc_facility_code = parseInt($cookies.get("facilityId"));
		$http(
		{
			method: 'PUT', 
			url: baseURL + 'user/edit-nfc-code',
			dataType : 'JSON',
			data:submitData,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
			
		}).success(function(response){
			if(response.status == true){
				toaster.pop('success','Submitted Successfully');
				$rootScope.NfcCodeMessage = "";
			}
			else{
				var arr = response.error;
				if(response.error != "" && response.error != null){
					$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
					$rootScope.NfcCodeMessage = n.join(", ");
				}
				else{
					if(response.msg == 'Invalid_Token'){
						toaster.pop('error','Session Expired');
						$cookies.remove("token");
						$location.path('/core/login');
					}
					
					//$rootScope.masters[0] = response.msg.replace(/_/g, " ");
				}
			}
			
			
			//$scope.submitEditPhoneCode(submitData);
		}).error(function(){

		});
	}

	//End Of NFC Code Edit


	$scope.submitEditPhoneCode = function(submitData){
		submitData.user_id = parseInt($stateParams.user_id);
		submitData.phone_code = ""+submitData.phone_code;
		submitData.phone_numbers = [];
		submitData.phone_numbers[0] = $("#todo").val();
		$.each($(".todo-list .ng-binding"), function(index, value){ 
			submitData.phone_numbers[index+1] = $(this).text();
		})
		$http(
		{
			method: 'PUT', 
			url: baseURL + 'user/edit-phone-code',
			dataType : 'JSON',
			data:submitData,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
			
		}).success(function(response){
			
			if(response.status == true){
				toaster.pop('success','Submitted Successfully');
			}
			else{
				var arr = response.error;
				if(response.error != "" && response.error != null){
					toaster.pop('error',response.msg);
					$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
					$scope.PhoneCodeMessage = n.join(", ");
				}
				else{
					if(response.msg == 'Invalid_Token'){
						toaster.pop('error','Session Expired');
						$cookies.remove("token");
						$location.path('/core/login');
					}
					
					//$rootScope.masters[0] = response.msg.replace(/_/g, " ");
				}	
			}
			
			//$scope.submitEditRFIDCode(submitData);
		}).error(function(){

		});
	}
	
	$scope.submitEditRFIDCode = function(submitData, rfid_form){
		if(!rfid_form.validate()){
			return false;
		}
		submitData.user_id = parseInt($stateParams.user_id);
		submitData.rfid_card_no = parseInt(submitData.rfid_card_no);
		submitData.rfid_facility_code = parseInt(submitData.rfid_facility_code);
		$http(
		{
			method: 'PUT', 
			url: baseURL + 'user/edit-rfid-code',
			dataType : 'JSON',
			data:submitData,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
			
		}).success(function(response){
			if(response.status == true){
				toaster.pop('success',"Submitted Successfully");
			}
			else{
				var arr = response.error;
				var n = [];
				if(response.error != "" && response.error != null){
					//toaster.pop('error',response.msg);
					$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
					$scope.EditRFIDCodeMsg = n.join(", ");
				}
				else{
					if(response.msg == 'Invalid_Token'){
						toaster.pop('error','Session Expired');
						$cookies.remove("token");
						$location.path('/core/login');
					}
					
					//$rootScope.masters[0] = response.msg.replace(/_/g, " ");
				}
				
			}
			
			//$scope.submitEditBLECode(submitData);
		}).error(function(){

		});
	}
	
	$scope.submitEditBLECode = function(submitData, ble_edit_form){
		if(!ble_edit_form.validate()){
			return false;
		}
		$scope.submitd = {};
		$scope.submitd.user_id = parseInt($stateParams.user_id);
		$scope.submitd.ble_name = submitData.ble_name;
		$scope.submitd.ble_status = submitData.ble_status;
		$scope.submitd.ble_pass = submitData.ble_pass;
		$http(
		{
			method: 'PUT', 
			url: baseURL + 'user/edit-ble-code',
			dataType : 'JSON',
			data: $scope.submitd,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
			
		}).success(function(response){
			var arr = response.error;
			if(response.error != ""){
				$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
				$scope.bleerror = n.join(", ");
			}
			else{
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}
				
				$rootScope.masters[0] = response.msg.replace(/_/g, " ");
			}
		}).error(function(){

		});
	}


	$scope.unassignUserGroupEdit = function(user_group_id){
		$http(
		{
			method: 'POST', 
			url: baseURL+'user/remove-usergroup',
			dataType : 'JSON', 
			data: { "user_id": parseInt($stateParams.user_id), "user_group_id": user_group_id },
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				toaster.pop('success','User group removed.');
			}else{	
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}
			}
			$timeout(function() {
				$scope.assignedGroup();
			});
			$timeout(function(){$rootScope.userNotAssignedGroup();})
		}).error(function(){

		});
	}

	//Delete user on detail page
	$scope.deleteUser = function(ev,id) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete User?')
		.content('')
		.ok('Delete')
		.cancel('Cancel')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			
			
			$http(
			{
				method: 'DELETE', 
				url: baseURL + 'user/delete?user_id='+id,
				dataType : 'JSON', 
				headers: {
					"Content-type": "application/json",
					"Authorization": $cookies.get("token")
				}
			})
			.success(function(response){
				if(response.status == true){
					$location.path('/app/admin/user/users');
				}else{
					if(response.msg == 'Invalid_Token'){
						toaster.pop('error','Session Expired');
						$cookies.remove("token");
						$location.path('/core/login');
					}
					toaster.pop('error',response.msg.replace(/_/g,' '));
				}
			}).error(function(){

			});
			
			
		}, function() {
			$scope.result = 'You decided to keep User.';
			$scope.statusclass = 'alert alert-success alert-dismissable';
		});
    };
	//Delete user on detail page
	
	$scope.onlyNumber = function(e){
		console.log(e);
		if(e.keyCode>=48 && e.keyCode<=57){
			//return true;
		}else{
			e.preventDefault();
		}
	}
	
	$("#mask02").datepicker();

	if($stateParams.type == "edit"){
		$timeout(function() {
			$("a:contains('Edit Account')").click();
		 });
		}
});

'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:UserGroupsCtrl
 * @description
 * # UserGroupsCtrl
 * Controller of the minovateApp
 */
app
  .controller('UserGroupsCtrl', function ($scope, $mdDialog, $http, baseURL, $rootScope, $cookies, toaster) {  	
     $scope.page = {
      title: 'User Groups',
      subtitle: 'So much more to see at a glance.'
    };
	
	$scope.layout = 'grid';
	$scope.class = 'gridview';
	$scope.changeClass = function(){
		if ($scope.class === 'gridview')
		$scope.class = 'listview';
		$scope.layout = 'list';
	};
	
	$scope.changeaClass = function(){
		if ($scope.class === 'listview')
		$scope.class = 'gridview';
		$scope.layout = 'grid';
	};
	
	$scope.result = '';
    $scope.showConfirm = function(ev) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete User Group?')
		.content('The standard chunk of Lorem Ipsum used.')
		.ok('Delete')
		.cancel('Cancel')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			$scope.result = 'Your User Group has been deleted successfully.';
			$scope.statusclass = 'alert alert-danger alert-dismissable';
		}, function() {
			$scope.result = 'You decided to keep User Group.';
			$scope.statusclass = 'alert alert-success alert-dismissable';
		});
    };
	
	$scope.usergroups = [{
      title: 'Office Hours',
	  imagename:'officehrs',
	  facility: 'USA Corporate Services',
	  noofusers: '72',
    },{
      title: '24X7 Hours',
	  imagename:'24x7',
	  facility: 'Belfor Service Plus',
	  noofusers: '58',
    },{
      title: 'Housekeeping Hours',
	  imagename:'housekeeping',
	  facility: 'Mitsui & Company Inc',
	  noofusers: '15',
    }];		

    $rootScope.saveUserGroup = function(usergroup, group_form){
    	if(!group_form.validate()){
			return false;
		}
		usergroup.facility_id = parseInt($cookies.get("facilityId"));
		$http({
			method: 'POST', 
			url: baseURL + 'usergroup/add',
			dataType : 'JSON',
			data:usergroup,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}

		})
		.success(function(response){
			if(response.status == true){
				toaster.pop('success','User Group Added Successfully');
			}else{
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}
				
				var n = [];
				var arr = response.error;
				if(arr != null){
				$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' '); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
				$rootScope.user_group_error = n.join(", ");
				}
				else{
					$rootScope.user_group_error = response.msg.replace(/_/g,' ');
				}	
			}
		}).error(function(){

		});
    }
	
	$scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }
	
	$scope.imagePath = 'http://localhost:8080/elika/images';	
	
});