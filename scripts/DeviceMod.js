'use strict';
/**

 * @ngdoc function
 * @name minovateApp.controller:DeviceCtrl
 * @description
 * # DeviceCtrl
 * Controller of the minovateApp
 */
app
  .controller('DeviceCtrl', function ($scope, $mdDialog, $http, $rootScope,$cookies) {
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
		device.technician_id = parseInt(device.technician_id);
		device.facility_id = parseInt(device.facility_id);
		device.serial_no = parseInt(device.serial_no);
		device.facility_id = 2;
		device.registration_code = 2;
		
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
				console.log(response);
			}else{
				if(response.msg == 'Validation_Error'){
					response;
				}
			}
		})
		.error(function(){

		});
	}
	
	$scope.deviceInit = function(){
		//$http.get('http://35.160.142.158:8080/device/list-master-device?limit=30&pageNo=1&facilityId=3',{header:{"token": $cookies.get("token")}})
		$http({method: 'GET', url: 'http://35.160.142.158:8080/device/list-master-device?limit=30&pageNo=1&facilityId=3',dataType : 'JSON', headers: {
				"Content-type": "application/json",
				'header': $cookies.get("token")}
			})
		.success(function(response){
			if(response.status == true){
				$scope.data = response.data.data;
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
	
	$scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }
	
	$scope.imagePath = 'http://localhost:8080/elika/images/';
	
});