
'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the minovateApp
 */
app
  .controller('UserCtrl', function ($scope, $mdDialog, $http, $rootScope, $cookies, arrayPushService,$location,toaster, baseURL, $timeout, fileUpload) {

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
	
	$scope.doorList = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL+'user/list-door-credential/'+parseInt($cookies.get("user_id")),
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			$scope.door_lists = response.data;
		})
	}
	$scope.doorList();
	$scope.submitUserData = function(userData, user_form){
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
		userData.zip_code = parseInt(userData.zip_code);
		userData.user_type = 'admin';
		userData.facility_id = parseInt($cookies.get("facilityId"));;
		if(userData.password != userData.cpassword){
			alert("Password and Confirm password not matched");
			return false;
		}
		// var fileData = {};
		// fileData.file = userData.photo;
		// userData.photo = userData.photo.name;
		delete userData.photo;
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
			// fileData.user_id = response.data.user_id;
			// var formData = fileData.file;
			// console.log(fileData.file);
 		// 	$http(
			// {
			// 	method: 'POST', 
			// 	url: baseURL+'user/pic-upload',
			// 	dataType : 'JSON', 
			// 	data: {"user_id": response.data.user_id, "file":formData},
			// 	headers: {
			// 		"Content-type": "application/json",
			// 		"Authorization": $cookies.get("token")
			// 	}
			// });
			$scope.user_error = "";
			$scope.accesscode = {};
			var x = Math.floor(Math.random()*9999999999) + 10000;
			$scope.accesscode.access_code = parseInt((""+x).substring(8, length));
			$scope.accesscode.access_code_status = 'Active';
			if(response.status == true){
				$cookies.put("user_id", response.data.user_id);
				$("md-tab-item[aria-controls^=tab-content]:contains('User Groups')").css("pointer-events", "visible").css("opacity", "1");	
				$("md-tab-item[aria-controls^=tab-content]:contains('Credentials')").css("pointer-events", "visible").css("opacity", "1");
				$("md-tab-item[aria-controls^=tab-content]:contains('Account')").css("pointer-events", "none").css("opacity", "0.7");
				$timeout(function() {
				$(".ng-scope:contains(User Groups)").trigger( "click" );
				// $(".ng-scope:contains(Credentials)").trigger( "click" );
				});
				$timeout(function() {
					$scope.assignedGroup();
				});
				$timeout(function() {
					$scope.unassignedGroup();
				});
				$timeout(function() {
					$scope.getRfidList();
				});
				$timeout(function() {
					$scope.getPhoneList();
				});
				$timeout(function() {
					$scope.getBleList();
				});
				$timeout(function() {
					$scope.getNfcCodeList();
				})
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
				$scope.user_error = n.join(", ");
				}
				else{
					$scope.user_error = response.msg.replace(/_/g,' ');
				}
				
			}
		}).error(function(){
		});
	}
	$scope.rfid = {};
	$scope.rfid.status = 1;

	$scope.getRfidList = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL + 'credential/list?user_id='+parseInt($cookies.get("user_id"))+'&type=rfid_code',
			dataType : 'JSON',
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
			
		}).success(function(response){
			$scope.rfid_code_list = response.data;
		})
	}
	
	$scope.saveRFID = function(rfid, rfid_form){
		if(!rfid_form.validate()){
			return false;
		}
		if(rfid == undefined){
			$rootScope.rfid_error = "Please fill form.";
			return false;
		}
		rfid.user_id = parseInt($cookies.get("user_id"));
		rfid.details = {};
		rfid.details.rfid_facility_id = JSON.stringify(parseInt(rfid.rfid_facility_code));
		rfid.details.rfid_card_no = JSON.stringify(parseInt(rfid.rfid_card_no));
		rfid.credential_type = "rfid_code";
		delete rfid.rfid_card_no;
		delete rfid.rfid_facility_code;
		$http(
		{
			method: 'POST', 
			url: baseURL+'user/add-credential',
			dataType : 'JSON', 
			data:rfid,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			$scope.rfid_error = "";
			if(response.status == true){
				$timeout(function() {
					$(".accordion-toggle")[3].click();
				});
				$timeout(function() {
					$scope.getRfidList();
				})
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
				$scope.rfid_error = n.join(", ");
				}
				else{
					$scope.rfid_error = response.msg.replace(/_/g,' ');
				}
			}
		}).error(function(){

		});
	}

	$scope.phoneCode = {};
	var x = Math.floor(Math.random()*9999999999) + 10000;
	$scope.phoneCode.phone_code = (""+x).substring(8, length);
	$scope.phoneCode.status = 1;


	$scope.getPhoneList = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL + 'credential/list?user_id='+parseInt($cookies.get("user_id"))+'&type=phone_code',
			dataType : 'JSON',
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
			
		}).success(function(response){
			$scope.phone_code_list = response.data;
		})
	}
	

	$scope.submitPhoneCode = function(phoneCode, phone_form){
		if(!phone_form.validate()){
			return false;
		}
		phoneCode.user_id = parseInt($cookies.get("user_id"));
		phoneCode.details = {};
		phoneCode.details.phone_code = phoneCode.phone_code;
		phoneCode.details.phone_numbers = [];
		phoneCode.details.phone_numbers[0] = phoneCode.phone_numbers;
		phoneCode.credential_type = "phone_code";
		delete phoneCode.phone_code;
		delete phoneCode.phone_numbers;
		$http(
		{
			method: 'POST', 
			url: baseURL+'user/add-credential',
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
				$timeout(function(){
					$scope.getPhoneList();
				})
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

	$scope.getBleList = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL + 'credential/list?user_id='+parseInt($cookies.get("user_id"))+'&type=ble_code',
			dataType : 'JSON',
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
			
		}).success(function(response){
			$scope.ble_code_list = response.data;
		})
	}
	

	$scope.ble_code = {};
	$scope.ble_code.status = 1;
	$scope.saveBLEcode = function(ble_code, ble_form){
		if(!ble_form.validate()){
			return false;
		}
		if(ble_code == undefined){
			$scope.blecode_error = "Please fill form.";
			return false;
		}
		ble_code.details = {};
		ble_code.details.ble_username = ble_code.ble_name;
		ble_code.details.ble_password = ble_code.ble_pass;
		ble_code.user_id = parseInt($cookies.get("user_id"));
		ble_code.credential_type = "ble_code";
		$http(
		{
			method: 'POST', 
			url: baseURL+'user/add-credential',
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
				$timeout(function(){
					$scope.getBleList();
				})
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

	$scope.generateAddAccessCode = function(){ 
		$scope.accesscode = {};
		var x = Math.floor(Math.random()*9999999999) + 10000;
		$scope.accesscode.access_code = parseInt((""+x).substring(8, length));
	}

	$rootScope.generateAddPhoneCode = function(){
		$scope.phoneCode = {};
		var x = Math.floor(Math.random()*9999999999) + 10000;
		$scope.phoneCode.phone_code = (""+x).substring(8, length);
	}

	$scope.generateNFCCode = function(){
		$scope.savenfc = {};
		var x = Math.floor(Math.random()*9999999999) + 10000;
		$scope.savenfc.nfc_code = (""+x).substring(8, length);
	}

	//NFC code edit
	$scope.getNfcCodeList = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL + 'credential/list?user_id='+parseInt($cookies.get("user_id"))+'&type=nfc_code',
			dataType : 'JSON',
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
			
		}).success(function(response){
			$scope.nfc_code_list = response.data;
		})
	}


	$scope.savenfc = {};
	$scope.savenfc.status = 1;
	$scope.saveNFCcode = function(savenfc, nfc_form){
		if(!nfc_form.validate()){
			return false;
		}
		savenfc.user_id = parseInt($cookies.get("user_id"));
		savenfc.details = {};
		savenfc.details.nfc_code = JSON.stringify(savenfc.nfc_code);
		savenfc.details.nfc_facility_id = JSON.stringify(parseInt($cookies.get("facilityId")));
		savenfc.credential_type = "nfc_code";
		delete savenfc.nfc_code;
		$http(
		{
			method: 'POST', 
			url: baseURL + 'user/add-credential',
			dataType : 'JSON',
			data:savenfc,
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
				$timeout(function() {
					$scope.getNfcCodeList();
				})
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

	$scope.getAccessCodeList = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL + 'credential/list?user_id='+parseInt($cookies.get("user_id"))+'&type=access_code',
			dataType : 'JSON',
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
			
		}).success(function(response){
			$scope.access_code_list = response.data;
		})
	}
	//$scope.getAccessCodeList();

	$scope.accesscode = {};
	$scope.accesscode.status = 1;
	$scope.saveAccessCode = function(accesscode, access_code){
		if(!access_code.validate()){
			return false;
		}
		accesscode.user_id = parseInt($cookies.get("user_id"));
		accesscode.credential_type = "access_code";
		accesscode.details = {};
		accesscode.details.access_code = JSON.stringify(accesscode.access_code);
		delete accesscode.access_code;
		$http(
		{
			method: 'POST', 
			url: baseURL+'user/add-credential',
			dataType : 'JSON', 
			data: accesscode,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			$scope.getAccessCodeList();
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
				$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
				$rootScope.accesscode_error = n.join(", ");
				if (n.length == 0)
				$scope.accesscode_error = response.msg.replace(/_/g,' ');
				
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
				$timeout(function() {
					$scope.doorList();
				});
				$timeout(function() {
					$scope.getAccessCodeList();
				});
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
				user_group.usergrouparr = [];
			}, 1000);
			$timeout(function() {
				$scope.unassignedGroup();
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
			$timeout(function() {
				$scope.unassignedGroup();
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
      title: 'Edit User',
      subtitle: ''
    };
	$scope.editUser = {};
	$("#mask02").datepicker();

	$scope.dashboardInit = function(){ 
	 $http({url: baseURL + 'user/dashboard',   method: 'GET',   dataType : 'JSON',   headers: {    "Authorization": $cookies.get("token"),    "Content-type": "application/json"   }  })  
	 	.success(function(response) {   if(response.status == true){    $rootScope.dashboardData = response.data[0];     console.log($rootScope.dashboardData);   }  })  
	 	.error(function (data, status, headers, config) {     }); } 

	if(!$rootScope.hasOwnProperty('dashboardData')){  $scope.dashboardInit(); }
	
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
				$scope.editAccess = {};
				$scope.editAccess.status = 1;
				$scope.phoneedit = {};
				$scope.phoneedit.status = 1;
				$scope.editRfid = {};
				$scope.editRfid.status  = 1;
				$scope.editNfc = {};
				$scope.editNfc.status  = 1;
				$scope.editBle = {};
				$scope.editBle.status  = 1;
				$scope.userData = response.data;
				$scope.editUser.user_id = $stateParams.user_id;
				$scope.editUser.user_zipcode = angular.copy($scope.userData.user_zipcode);
				$scope.editUser.user_zipcode = angular.copy($scope.userData.user_zipcode);
				$scope.editUser.first_name = angular.copy($scope.userData.user_first_name);
				$scope.editUser.last_name = angular.copy($scope.userData.user_last_name);
				$scope.editUser.address = angular.copy($scope.userData.user_address);
				$scope.editUser.email = angular.copy($scope.userData.user_email);
				$scope.editUser.expiration_date = angular.copy($scope.userData.user_expiration_date);
				$scope.editUser.status = angular.copy($scope.userData.user_status);
				$scope.editUser.user_name_on_lcd = angular.copy($scope.userData.user_name_on_lcd);
				// $scope.editAccess.access_code = angular.copy($scope.userData.access_code);
				$scope.editUser.access_code_status = angular.copy($scope.userData.access_status);
				// $scope.editUser.phone_code = angular.copy($scope.userData.phone_code);
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
					$scope.editAccess.access_code_status = 1;
				}
				else{
					$scope.editAccess.access_code_status = angular.copy($scope.userData.access_status);
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
				$scope.editassignedGroup();
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

	$scope.removeCredential = function(id, type){
		$http(
		{
			method: 'DELETE', 
			url: baseURL+'user/delete-credential?credential_id='+id+'&type='+type,			
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			$scope.getAccessCodeList();
			// $scope.door_lists = response.data;
		})
	}

	$scope.editdoorList = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL+'user/list-door-credential/'+parseInt($stateParams.user_id),			
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			$scope.door_lists = response.data;
		})
	}
	$scope.editdoorList();
	
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

	$scope.editassignedGroup = function(){
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
			$scope.nogroup = false;
			if(response.status == true){
				if(response.data == null){
					$scope.nogroup = "No UserGroup Assigned";
					$scope.userGroup = "";
				}
				else{
					$scope.userGroup = response.data;
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
	
	$scope.editassignedGroup();
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

	$scope.formatDate = function(date) {
	var d = new Date(date),
	    month = '' + (d.getMonth() + 1),
	    day = '' + d.getDate(),
	    year = d.getFullYear();

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	return [day, month, year].join('/');
	}
	
	var n = [];
	$scope.submitEditUser = function(submitData, user_edit){
		if(!user_edit.validate()){
			return false;
		}
		submitData.status = submitData.user_status
		submitData.user_id = parseInt($stateParams.user_id);
		submitData.user_phone_no = parseInt(submitData.user_phone_no);
		submitData.name_on_lcd = submitData.user_name_on_lcd;
		submitData.zipcode = parseInt(submitData.zipcode);
		submitData.facility_id = parseInt($cookies.get("facilityId"));
		submitData.expiration_date = submitData.expiration_date;
		$rootScope.masters = [];
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
				$scope.profileInit
				toaster.pop('success','Submitted Successfully');
				$scope.editUserMessage = "";
			}else{
				// toaster.pop('error',response.msg);
				var arr = response.error;
				if(response.error != ""){
					$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
					$scope.editUserMessage = n.join(", ");
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
		// $scope.editUser.access_code = Date.now();
		// $scope.accesscode = {};
		var x = Math.floor(Math.random()*9999999999) + 10000;
		$scope.editAccess.access_code = parseInt((""+x).substring(8, length));
	}

	$scope.generatePhoneCode = function(){
		var x = Math.floor(Math.random()*9999999999) + 10000;
		$scope.phoneedit.phone_code = (""+x).substring(8, length);
	}
	
	$scope.submitEditAccessCode = function(submitData, access_edit_form){
		if(!access_edit_form.validate()){
			return false;
		}
		submitData.user_id = parseInt($stateParams.user_id);
		submitData.credential_type = "access_code";
		submitData.details = {};
		submitData.details.access_code = JSON.stringify(parseInt(submitData.access_code));
		delete submitData.access_code;
		$http(
		{
			method: 'POST', 
			url: baseURL + 'user/add-credential',
			dataType : 'JSON',
			data:submitData,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
			
		}).success(function(response){
			if(response.status == true){
				toaster.pop('success','Submitted Successfully');
				$scope.getAccessCodeList();
			}
			else{
				var arr = response.error;
				if(response.error != "" && response.error != null){
					$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
					$scope.AccessCodeMessage = n.join(", ");
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
	
	$scope.getAccessCodeList = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL + 'credential/list?user_id='+parseInt($stateParams.user_id)+'&type=access_code',
			dataType : 'JSON',
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
			
		}).success(function(response){
			$scope.access_code_list = response.data;
		})
	}
	$scope.getAccessCodeList();
	//NFC code edit
	$scope.submitEditNfcCode = function(submitData, nfc_edit_form){
		if(!nfc_edit_form.validate()){
			return false;
		}
		// submitData.user_id = parseInt($stateParams.user_id);
		// submitData.nfc_code = parseInt(submitData.nfc_code);
		// submitData.nfc_facility_code = parseInt($cookies.get("facilityId"));
		submitData.user_id = parseInt($stateParams.user_id);
		submitData.details = {};
		submitData.details.nfc_code = submitData.nfc_code;
		submitData.details.nfc_facility_id = JSON.stringify(parseInt($cookies.get("facilityId")));
		submitData.credential_type = "nfc_code";
		delete submitData.nfc_code;
		$http(
		{
			method: 'POST', 
			url: baseURL + 'user/add-credential',
			dataType : 'JSON',
			data:submitData,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
			
		}).success(function(response){
			if(response.status == true){
				$scope.getNfcCodeList();
				toaster.pop('success','Submitted Successfully');
				$scope.NfcCodeMessage = "";
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

	$scope.getNfcCodeList = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL + 'credential/list?user_id='+parseInt($stateParams.user_id)+'&type=nfc_code',
			dataType : 'JSON',
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
			
		}).success(function(response){
			$scope.nfc_code_list = response.data;
		})
	}
	$scope.getNfcCodeList();

	//End Of NFC Code Edit
	$scope.getPhoneList = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL + 'credential/list?user_id='+parseInt($stateParams.user_id)+'&type=phone_code',
			dataType : 'JSON',
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
			
		}).success(function(response){
			$scope.phone_code_list = response.data;
		})
	}
	$scope.getPhoneList();

	$scope.submitEditPhoneCode = function(submitData, phone_edit_form){
		// submitData.user_id = parseInt($stateParams.user_id);
		// submitData.phone_code = ""+submitData.phone_code;
		// submitData.phone_numbers = [];
		// submitData.phone_numbers[0] = $("#todo").val();
		// $.each($(".todo-list .ng-binding"), function(index, value){ 
		// 	submitData.phone_numbers[index+1] = $(this).text();
		// })
		submitData.user_id = parseInt($stateParams.user_id);
		submitData.details = {};
		submitData.details.phone_code = submitData.phone_code;
		submitData.details.phone_numbers = [];
		submitData.details.phone_numbers[0] = submitData.phone_numbers;
		submitData.credential_type = "phone_code";
		delete submitData.phone_code;
		delete submitData.phone_numbers;
		$http(
		{
			method: 'POST', 
			url: baseURL + 'user/add-credential',
			dataType : 'JSON',
			data:submitData,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
			
		}).success(function(response){
			
			if(response.status == true){
				toaster.pop('success','Submitted Successfully');
				$scope.getPhoneList();
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
	

	$scope.getRfidList = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL + 'credential/list?user_id='+parseInt($stateParams.user_id)+'&type=rfid_code',
			dataType : 'JSON',
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
			
		}).success(function(response){
			$scope.rfid_code_list = response.data;
		})
	}
	$scope.getRfidList();
	$scope.submitEditRFIDCode = function(submitData, rfid_form){
		if(!rfid_form.validate()){
			return false;
		}
		// submitData.user_id = parseInt($stateParams.user_id);
		// submitData.rfid_card_no = parseInt(submitData.rfid_card_no);
		// submitData.rfid_facility_code = parseInt(submitData.rfid_facility_code);
		submitData.user_id = parseInt($stateParams.user_id);
		submitData.details = {};
		submitData.details.rfid_facility_id = JSON.stringify(parseInt(submitData.rfid_facility_code));
		submitData.details.rfid_card_no = JSON.stringify(parseInt(submitData.rfid_card_no));
		submitData.credential_type = "rfid_code";
		delete submitData.rfid_card_no;
		delete submitData.rfid_facility_code;
		$http(
		{
			method: 'POST', 
			url: baseURL + 'user/add-credential',
			dataType : 'JSON',
			data:submitData,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
			
		}).success(function(response){
			if(response.status == true){
				$scope.getRfidList();
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

	$scope.getBleList = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL + 'credential/list?user_id='+parseInt($stateParams.user_id)+'&type=ble_code',
			dataType : 'JSON',
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
			
		}).success(function(response){
			$scope.ble_code_list = response.data;
		})
	}
	$scope.getBleList();
	
	$scope.submitEditBLECode = function(submitData, ble_edit_form){
		if(!ble_edit_form.validate()){
			return false;
		}
		// $scope.submitd = {};
		// $scope.submitd.user_id = parseInt($stateParams.user_id);
		// $scope.submitd.ble_name = submitData.ble_name;
		// $scope.submitd.ble_status = submitData.ble_status;
		// $scope.submitd.ble_pass = submitData.ble_pass;
		submitData.details = {};
		submitData.details.ble_username = submitData.ble_name;
		submitData.details.ble_password = submitData.ble_pass;
		submitData.user_id = parseInt($stateParams.user_id);
		submitData.credential_type = "ble_code";
		$http(
		{
			method: 'POST', 
			url: baseURL + 'user/add-credential',
			dataType : 'JSON',
			data: submitData,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
			
		}).success(function(response){
			var arr = response.error;
			$scope.getBleList();
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
  .controller('UserGroupsCtrl', function ($scope, $mdDialog, $http, baseURL, $rootScope, $cookies, toaster, arrayPushService) {  	
     $scope.page = {
      title: 'User Groups',
      subtitle: '',
      member: 'User Groups Members'
    };

    $scope.dashboardInit = function(){ 
	 $http({url: baseURL + 'user/dashboard',   method: 'GET',   dataType : 'JSON',   headers: {    "Authorization": $cookies.get("token"),    "Content-type": "application/json"   }  })  
	 	.success(function(response) {   if(response.status == true){    $rootScope.dashboardData = response.data[0];     console.log($rootScope.dashboardData);   }  })  
	 	.error(function (data, status, headers, config) {     }); } 

	 	if(!$rootScope.hasOwnProperty('dashboardData')){  $scope.dashboardInit(); }
	
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
    $scope.showConfirm = function(ev,id) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete User Group?')
		.content('The standard chunk of Lorem Ipsum used.')
		.ok('Delete')
		.cancel('Cancel')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			$scope.userGroupDelete(id);
			
		}, function() {
			$scope.result = 'You decided to keep User Group.';
			$scope.statusclass = 'alert alert-success alert-dismissable';
		});
    };

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

   $scope.searchFunction = function(e){
		if(e)
		if(e.keyCode!=13){return false;}
		if(!$scope.searchText){
			$scope.searchText = '';
		}
		}
		$scope.pageNo = 1;
		$scope.usergroups =[];
		$scope.searchText = "";
	
	$scope.getUserGroupList = function(e){console.log(e);
		if(e)
		if(e.keyCode!=13){return false;}
		if(!$scope.searchValue){
			$scope.searchValue = '';
		}
    	$http({
			method: 'GET', 
			url: baseURL + 'usergroup/list?limit=8&pageNo='+$scope.pageNo+'&searchVal='+$scope.searchText,
			dataType : 'JSON',
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$scope.usergroups = arrayPushService.arrayPush(response.data.data, $scope.usergroups);
				$scope.pageNo = $scope.pageNo + 1 ;
			}else{
				if(response.data == null){
					$(".f-wm:contains(Load more)").text("No more data available").css( "opacity" , 0.7);
				}
				
			}
		}).error(function(){

		});
    }
	$scope.getUserGroupList();
	
	$scope.userGroupDelete = function(id){
    	$http({
			method: 'GET', 
			url: baseURL + 'usergroup/delete?usergroup_id='+id,
			dataType : 'JSON',
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$scope.result = 'Your User Group has been deleted successfully.';
				$scope.statusclass = 'alert alert-danger alert-dismissable';
				var ug = $scope.usergroups;
				var temp = [];
				for(var i=0; i < ug.length; i++){
					if(ug[i].usergroup_id != id)
						temp.push(ug[i]);
				}
				$scope.usergroups = temp;
			}else{
				
			}
		}).error(function(){

		});
    }
	
	$rootScope.updateUserGroup = function(data){
		data.facility_id = parseInt(data.facility_id);
    	$http({
			method: 'PUT', 
			url: baseURL + 'usergroup/edit',
			dataType : 'JSON',
			data:data,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				toaster.pop('success',response.msg.replace(/_/g,' '));
			}else{
				
			}
		}).error(function(){

		});
    }
	
	$scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }
	
	$scope.imagePath = 'http://localhost:8080/elika/images';	
	
});