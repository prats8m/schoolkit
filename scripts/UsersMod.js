
'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the minovateApp
 */
app
  .controller('UserCtrl', function ($scope, $mdDialog, $http, $rootScope, $cookies, arrayPushService, toaster, baseURL) {
     $scope.page = {
      title: 'Users',
      subtitle: 'So much more to see at a glance.'
    };

	$scope.result = '';
    $scope.showConfirm = function(ev) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete User?')
		.content('The standard chunk of Lorem Ipsum used.')
		.ok('Delete')
		.cancel('Cancel')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			$scope.result = 'Your User has been deleted successfully.';
			$scope.statusclass = 'alert alert-danger alert-dismissable';
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
			url: 'http://35.160.142.158:8080/user/list?limit=8&pageNo='+$scope.pageNo+'&searchVal='+$scope.searchText+'&facilityId=3',
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
		
		$http(
		{
			method: 'GET', 
			url: 'http://35.160.142.158:8080/user/list?limit=8&pageNo='+$scope.pageNo+'&searchVal='+$scope.searchText+'&facilityId=3',
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
				
			}
		}).error(function(){

		});	
	}
	
	$scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }
	
	$scope.imagePath = 'http://localhost:8080/elika/images';

	$rootScope.accessCode = Date.now();
	
	$rootScope.submitUserData = function(userData){
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
			$rootScope.accessCode = Date.now();
			$cookies.put("token", response.data.user_id)
			if(response.status == true){
				
			}else{
				
			}
		}).error(function(){

		});
	}

	$rootScope.saveRFID = function(rfid){
		rfid.user_id = 1;
		rfid.rfid_facility_code = parseInt(rfid.rfid_facility_code);
		rfid.rfid_card_no = parseInt(rfid.rfid_card_no);
		rfid.rfid_status = (rfid.rfid_status == "Active" ? 1 : 0)
		$http(
		{
			method: 'POST', 
			url: baseURL+'user/assign-rfid-code/',
			dataType : 'JSON', 
			data:rfid,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			$rootScope.rfid_error = "";
			if(response.status == true){
				toaster.pop('success','RFID Added Successfully');
			}else{
				var n = [];
				var arr = response.error;
				$.each(arr, function(index, value){ n[index] = value.property ; $.each(value.messages, function(ind, value){ n[index] += " "+value })});
				$rootScope.rfid_error = n.join(", ");
				if (n.length == 0)
				$rootScope.rfid_error = response.msg.replace(/_/g,' ');
			}
		}).error(function(){

		});
	}
	
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
  .controller('UserProfileCtrl', function ($scope,$http,$cookies, $stateParams) {
     $scope.page = {
      title: 'Arnold',
      subtitle: 'So much more to see at a glance.'
    };
	$scope.profileInit = function(){
		$http(
		{
			method: 'GET', 
			url: 'http://35.160.142.158:8080/user/view-user-details?user_id='+$stateParams.user_id,
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$scope.userData = response.data;
			}else{
				
			}
		}).error(function(){

		});
	}
	$scope.profileInit();
	
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
  .controller('UserGroupsCtrl', function ($scope, $mdDialog, $http) {
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
	
	$scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }
	
	$scope.imagePath = 'http://localhost:8080/elika/images';	
	
});