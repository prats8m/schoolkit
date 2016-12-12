'use strict';
/**

 * @ngdoc function
 * @name minovateApp.controller:DeviceCtrl
 * @description
 * # DeviceCtrl
 * Controller of the minovateApp
 */
app
  .controller('DeviceCtrl', function ($scope, $mdDialog, $http, $rootScope, $cookies, arrayPushService,toaster,baseURL,$location,errorHandler) {
    $scope.page = {
		title: 'Devices',
		subtitle: 'So much more to see at a glance.'
    };
	
	$scope.result = '';
	$rootScope.facilityId = $cookies.get("facilityId");
    $scope.showConfirm = function(id,ev) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete Doors?')
		.content('The standard chunk of Lorem Ipsum used.')
		.ok('Delete')
		.cancel('Cancel')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			
			$http(
			{
				method: 'POST', 
				url: baseURL+'device/delete',
				data: {device_id:id , facility_id:parseInt($rootScope.facilityId)},
				dataType : 'JSON', 
				headers: {
					"Content-type": "application/json",
					"Authorization": $cookies.get("token")
				}
			})
			.success(function(response){
				if(response.status == true){
					$scope.result = 'Your Doors has been deleted successfully.';
					$scope.statusclass = 'alert alert-danger alert-dismissable';
				}else{
					$scope.result = response.msg.replace(/_/g,' ');
					$scope.statusclass = 'alert alert-danger alert-dismissable';
					
				}
			}).error(function(){

			});
			
			
		}, function() {
			$scope.result = 'You decided to keep Doors.';
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
	
	$rootScope.formSubmit = function(device){
		//alert(device);
		device.technician_id = parseInt(device.technician_id);
		//device.facility_id = parseInt(device.facility_id);
		device.serial_no = parseInt(device.serial_no);
		device.facility_id = parseInt($rootScope.facilityId);
		//device.registration_code = '1223';
		
		$http({
			url: baseURL+'device/add',
			method: 'POST',
			data: device,
			dataType : 'JSON',
			headers: {
				"Content-type": "application/json",
				'Authorization': $cookies.get("token")
			}
		})
		.success(function(response) {
			if(response.status == true){
				toaster.pop('success',response.msg.replace(/_/g,' '));
			}else{
				toaster.pop('error',response.msg.replace(/_/g,' '));
				if(response.msg == 'Validation_Error'){
					if(response.error != ""){
						var n = [];
						$rootScope.masters = [];
						$.each(arr, function(index, value){ n[index] = value.property ; $.each(value.messages, function(ind, value){ n[index] += " "+value })});
						$rootScope.masters = n;
					}
					else{
						$rootScope.masters[0] = response.msg.replace(/_/g, " ");
					}
				}
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}
			}
		})
		.error(function(){

		});
	}
	
	$scope.data = [];
	$scope.pageNo = 1;
	$scope.deviceInit = function(){
		if(!$scope.searchText){
			$scope.searchText = '';
		}
		
		$http(
		{
			method: 'GET', 
			url: baseURL+'device/list-master-device?limit=8&pageNo='+$scope.pageNo+'&searchVal='+$scope.searchText+'&facilityId=3',
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$scope.data =  arrayPushService.arrayPush(response.data.data, $scope.data);
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
	$scope.deviceInit();
		
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
			url: baseURL+'device/list-master-device?limit=8&pageNo='+$scope.pageNo+'&searchVal='+$scope.searchText+'&facilityId=3',
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$scope.data =  response.data.data;
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
	
	$scope.getTechnicianList = function(device){
		
		$http(
		{
			method: 'GET', 
			url: baseURL+'technician/list',
			dataType : 'JSON', 
			data: device,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$rootScope.technicianList = response.data;
			}else{
				
			}
		}).error(function(){

		});
	}
	$scope.getTechnicianList();
	
	$scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }
	
	$scope.imagePath = 'http://localhost:8080/elika/images/';
	
});


'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:DeviceDetailsCtrl
 * @description
 * # DeviceDetailsCtrl
 * Controller of the minovateApp
 */
app
  .controller('DeviceDetailsCtrl', function ($scope, $mdDialog, $http,$stateParams,$cookies,toaster,$rootScope,baseURL,errorHandler) {
     $scope.page = {
      title: 'Device Details',
      subtitle: 'So much more to see at a glance.'
    };
    var device_id = $stateParams.device_id;
	//$scope.technicianList = technicianList;
	
	$rootScope.submitDependentDevice = function(device){
		console.log(device);
		device.technician_id = parseInt(device.technician_id);
		device.serial_no = parseInt(device.serial_no);
		device.facility_id = parseInt($rootScope.facilityId);
		$http(
		{
			method: 'POST', 
			url: baseURL+'device/add',
			dataType : 'JSON', 
			data: device,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				toaster.pop('success','Submit Successfully');
			}else{
				if(response.msg == 'Invalid_Token'){
						toaster.pop('error','Session Expired');
						$cookies.remove("token");
						$location.path('/core/login');
					}else{toaster.pop('error',response.msg.replace(/_/g,' '));}
			}
		}).error(function(){

		});	
	}
    	
	$scope.result = '';
    $scope.showConfirm = function(ev) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete device?')
		.content('The standard chunk of Lorem Ipsum used.')
		.ok('Delete')
		.cancel('Cancel')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			
			$http(
			{
				method: 'POST', 
				url: baseURL+'device/delete',
				data: {device_id:parseInt($stateParams.device_id) , facility_id:parseInt($rootScope.facilityId)},
				dataType : 'JSON', 
				headers: {
					"Content-type": "application/json",
					"Authorization": $cookies.get("token")
				}
			})
			.success(function(response){
				if(response.status == true){
					$scope.result = 'Your device has been deleted successfully.';
					$scope.statusclass = 'alert alert-danger alert-dismissable';
				}else{
					$scope.result = response.msg.replace(/_/g,' ');
					$scope.statusclass = 'alert alert-danger alert-dismissable';
				}
			}).error(function(){

			});
			
			
		}, function() {
			$scope.result = 'You decided to keep device.';
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


	$scope.dependentDeviceInit = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL+'device/view?device_id='+device_id,
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$scope.details = response.data;
				$scope.editDevice = response.data;
				$scope.editDevice.device_technician_id = $scope.editDevice.device_technician_id.toString();
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
	$scope.dependentDeviceInit();

	$scope.pageNo = 1;
	$scope.dependentDevices = function(){
		if(!$scope.searchText){$scope.searchText = '';}
		$http(
		{
			method: 'GET', 
			url: baseURL+'device/list-slave-device?limit=8&pageNo='+$scope.pageNo+'&searchVal='+$scope.searchText+'&facilityId=3',
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$scope.dependent_devices = response.data.data;
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
	$scope.dependentDevices();

	$scope.deviceUsers = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL+'device/user-details-by-device/1',
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				//$scope.dependent_devices = response.data.data;
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
	$scope.deviceUsers();

	
	$scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }
	
	$scope.imagePath = 'http://localhost:8080/elika/images/';
	
	$scope.editFormSubmit = function(device){
		device.registration_code = device.device_registration_code;
		device.technician_id = device.device_technician_id;
		device.serial_no = parseInt(device.device_serial_no);
		device.facility_id = parseInt($rootScope.facilityId);
		
		$http(
		{
			method: 'PUT', 
			url: baseURL+'device/edit',
			dataType : 'JSON', 
			data: device,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				toaster.pop('success','Submitted Successfully!');
			}else{
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}else{toaster.pop('success',response.msg.replace(/_/g, " "));}
			}
		}).error(function(){

		});
	}
	
	$scope.getTechnicianList = function(device){
		
		$http(
		{
			method: 'GET', 
			url: baseURL+'technician/list',
			dataType : 'JSON', 
			data: device,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$scope.technicianList = response.data;
			}else{
				
			}
		}).error(function(){

		});
	}
	$scope.getTechnicianList();
	
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
			url: baseURL+'device/list-slave-device?limit=8&pageNo='+$scope.pageNo+'&searchVal='+$scope.searchText+'&facilityId='+$rootScope.facilityId,
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$scope.data =  response.data.data;
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
	
	
	
});

app.filter('deviceFeatureFilter', function() {

  return function(input) {

    if(input == 1){
    	return "online";
    }else{
    	return "offline";
    }

  }

});

'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:DependentDevicesDetailsCtrl
 * @description
 * # DependentDevicesDetailsCtrl
 * Controller of the minovateApp
 */
app
  .controller('DependentDevicesDetailsCtrl', function($scope, $mdDialog, $http, $stateParams, $cookies, toaster,errorHandler){
    $scope.page = {
      title: 'Dependent Device',
      subtitle: 'So much more to see at a glance.'
    };
	
	$scope.result = '';
    $scope.showConfirm = function(id,ev) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete user?')
		.content('The standard chunk of Lorem Ipsum used.')
		.ok('Delete')
		.cancel('Cancel')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			
			$scope.result = 'Your user has been deleted successfully.';
			$scope.statusclass = 'alert alert-danger alert-dismissable';
		}, function() {
			$scope.result = 'You decided to keep user.';
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
	
	$scope.users = [{
		serialno:'1',
		name:'Arnold',
		group:'Office Hours',
		phone:'+1 212 1467 8920',
		imagename:'2'
    }];
	
	$scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }
	
	$scope.imagePath = 'http://localhost:8080/elika/images';
	
	var device_id = $stateParams.device_id;
	$scope.dependentDeviceInit = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL+'device/view?device_id='+device_id,
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$scope.details = response.data;
				$scope.editDevice = response.data;
				$scope.editDevice.device_technician_id = $scope.editDevice.device_technician_id.toString();
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
	$scope.dependentDeviceInit();
	
	$scope.editFormSubmit = function(device){
		device.registration_code = device.device_registration_code;
		device.technician_id = device.device_technician_id;
		device.serial_no = parseInt(device.device_serial_no);
		device.facility_id = device.device_facility_id;
		
		$http(
		{
			method: 'PUT', 
			url: baseURL+'device/edit',
			dataType : 'JSON', 
			data: device,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				toaster.pop('success','Submitted Successfully!');
			}else{
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}else{toaster.pop('success',response.msg.replace(/_/g, " "));}
			}
		}).error(function(){

		});
	}
	
	$scope.getTechnicianList = function(device){
		
		$http(
		{
			method: 'GET', 
			url: baseURL+'technician/list',
			dataType : 'JSON', 
			data: device,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$scope.technicianList = response.data;
			}else{
				
			}
		}).error(function(){

		});
	}
	$scope.getTechnicianList();
});

'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:DependentDeviceCtrl
 * @description
 * # DependentDeviceCtrl
 * Controller of the minovateApp
 */
app
  .controller('DependentDeviceCtrl', function ($scope, $mdDialog, $http, $stateParams, $cookies, toaster,errorHandler) {
    $scope.page = {
		title: 'Dependent Devices',
		subtitle: 'So much more to see at a glance.'
    };
	
	$scope.result = '';
    $scope.showConfirm = function(id,ev) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete dependent device?')
		.content('The standard chunk of Lorem Ipsum used.')
		.ok('Delete')
		.cancel('Cancel')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			
			$http(
			{
				method: 'POST', 
				url: baseURL+'device/delete',
				data: {device_id:parseInt(id) , facility_id:parseInt($rootScope.facilityId)},
				dataType : 'JSON', 
				headers: {
					"Content-type": "application/json",
					"Authorization": $cookies.get("token")
				}
			})
			.success(function(response){
				if(response.status == true){
					$scope.result = 'Your dependent device has been deleted successfully.';
					$scope.statusclass = 'alert alert-danger alert-dismissable';
				}else{
					$scope.result = response.msg.replace(/_/g,' ');
					$scope.statusclass = 'alert alert-danger alert-dismissable';
				}
			}).error(function(){

			});
			
			
		}, function() {
			$scope.result = 'You decided to keep dependent device.';
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

	
	$scope.getDependentDevice = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL+'device/list-slave-of-master-device?device_master_id=1',
			dataType : 'JSON', 
			// data: device,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$scope.dependentDevice = response.data;
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
	$scope.getDependentDevice();
	
	$scope.orderByMe = function(x) {
		alert(x);
        $scope.myOrderBy = x;
    }
	
	$scope.imagePath = 'http://elikastaging.tk/images/';
	
});

