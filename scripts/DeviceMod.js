'use strict';
/**

 * @ngdoc function
 * @name minovateApp.controller:DeviceCtrl
 * @description
 * # DeviceCtrl
 * Controller of the minovateApp
 */
app
  .controller('DeviceCtrl', function ($scope, $mdDialog, $http, $rootScope, $cookies, arrayPushService) {
    $scope.page = {
		title: 'Devices',
		subtitle: 'So much more to see at a glance.'
    };
	
	$scope.result = '';
    $scope.showConfirm = function(ev) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete Doors?')
		.content('The standard chunk of Lorem Ipsum used.')
		.ok('Delete')
		.cancel('Cancel')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			$scope.result = 'Your Doors has been deleted successfully.';
			$scope.statusclass = 'alert alert-danger alert-dismissable';
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
		device.facility_id = parseInt(device.facility_id);
		device.serial_no = parseInt(device.serial_no);
		device.facility_id = 3;
		//device.registration_code = '1223';
		
		$http({
			url: 'http://35.160.142.158:8080/device/add',
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
				
			}else{
				if(response.msg == 'Validation_Error'){
					var error = response;
					console.log(error);
				}
			}
		})
		.error(function(){

		});
	}
	
	$scope.data = [];
	$scope.pageNo = 1;
	$scope.deviceInit = function(){
		//$http.get('http://35.160.142.158:8080/device/list-master-device?limit=30&pageNo=1&facilityId=3',{header:{"Authorization": $cookies.get("token")}})
		$http(
		{
			method: 'GET', 
			url: 'http://35.160.142.158:8080/device/list-master-device?limit=8&pageNo='+$scope.pageNo+'&facilityId=3',
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
				
			}
		}).error(function(){

		});	
	}	
	$scope.deviceInit();
		
	$http.get('http://localhost:8080/elika/json/admin/devices.json').success(function(response){
	
		$scope.devices = response;
		$scope.totalDisplayed = 8;
		
		if($scope.devices.length > $scope.totalDisplayed) {
			$scope.lmbtn = {
				"display" : "block"
			};			
		} else {
			$scope.lmbtn = {
				"display" : "none"
			};
		}
		
		$scope.loadMore = function () {
			$scope.totalDisplayed += 8;
			if($scope.totalDisplayed > $scope.devices.length) {				
				$scope.lmbtn = {
					"display" : "none"
				};	
			}			
		};
	});	

	$scope.deleteDevice = function(id){
		$http(
		{
			method: 'POST', 
			url: 'http://35.160.142.158:8080/device/delete',
			data: {device_id:id , facility_id:3},
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				
			}else{
				
			}
		}).error(function(){

		});	
	}

	
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
  .controller('DeviceDetailsCtrl', function ($scope, $mdDialog, $http,$stateParams,$cookies) {
     $scope.page = {
      title: 'Device Details',
      subtitle: 'So much more to see at a glance.'
    };
    var device_id = $stateParams.device_id;
    	
	$scope.result = '';
    $scope.showConfirm = function(ev) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete device?')
		.content('The standard chunk of Lorem Ipsum used.')
		.ok('Delete')
		.cancel('Cancel')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			$scope.result = 'Your device has been deleted successfully.';
			$scope.statusclass = 'alert alert-danger alert-dismissable';
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
	
	$http.get('http://localhost:8080/elika/json/admin/devices/dependent-devices.json').success(function(response){
		$scope.devices = response;
		$scope.totalDisplayed = 6;
		
		if($scope.devices.length > $scope.totalDisplayed) {
			$scope.lmbtn = {
				"display" : "block"
			};			
		} else {
			$scope.lmbtn = {
				"display" : "none"
			};
		}
		
		$scope.loadMore = function () {
			$scope.totalDisplayed += 6;
			if($scope.totalDisplayed > $scope.devices.length) {				
				$scope.lmbtn = {
					"display" : "none"
				};	
			}			
		};		
	});



	$scope.dependentDeviceInit = function(){
		$http(
		{
			method: 'GET', 
			url: 'http://35.160.142.158:8080/device/view?device_id='+device_id,
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
				console.log($scope.editDevice);
			}else{
				
			}
		}).error(function(){

		});	
	}
	$scope.dependentDeviceInit();

	$scope.dependentDevices = function(){
		$http(
		{
			method: 'GET', 
			url: 'http://35.160.142.158:8080/device/list-slave-device?limits=8&pageNo=1&facilityId=3',
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
				
			}
		}).error(function(){

		});	
	}
	$scope.dependentDevices();

	$scope.deviceUsers = function(){
		$http(
		{
			method: 'GET', 
			url: 'http://35.160.142.158:8080/device/user-details-by-device/1',
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
				
			}
		}).error(function(){

		});	
	}
	$scope.deviceUsers();

	
	$http.get('http://localhost:8080/elika/json/admin/devices/users.json').success(function(response){
		$scope.users = response;
		$scope.totalDisplayed1 = 6;
		
		if($scope.users.length > $scope.totalDisplayed1) {
			$scope.lmbtn1 = {
				"display" : "block"
			};			
		} else {
			$scope.lmbtn1 = {
				"display" : "none"
			};
		}
		
		$scope.loadMore1 = function () {
			$scope.totalDisplayed1 += 6;
			if($scope.totalDisplayed1 > $scope.users.length) {				
				$scope.lmbtn1 = {
					"display" : "none"
				};	
			}			
		};		
	});
	
	$scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }
	
	$scope.imagePath = 'http://localhost:8080/elika/images/';
	
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

