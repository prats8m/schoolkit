'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:FirmwareManagementCtrl
 * @description
 * # FirmwareManagementCtrl
 * Controller of the minovateApp
 */
app
  .controller('FirmwareManagementCtrl', function ($scope,toaster,$timeout, $state, $mdDialog, $http, $rootScope, dataService) {
    $scope.page = {
		title: 'Firmware Management',
    };
	
	$scope.result = '';
    $scope.showConfirm = function(ev,id) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete firmware?')
		.content('')
		.ok('Yes')
		.cancel('No')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			//$state.go('app.firmware.firmware-management');
			$scope.deleteFirmware(id);
		}, function() {
			$scope.result = 'You decided to keep firmware.';
			$scope.statusclass = 'alert alert-success alert-dismissable';
		});
    };

    $scope.deleteFirmware = function(id){
		dataService.deleteData(null,baseUrl+'firmware/delete?firmware_id='+id)
		.success(function(response){
			if(response.status){
				toaster.pop('success','Firmware has been deleted successfully.');
				//$state.go('app.firmware.firmware-management');
				$scope.firmwareInit();
			}else{
				dataService.responseError(response);
			}
		});
	}
	
	$scope.firmwareInit = function(e){
		if(e)
		if(e.keyCode!=13){return false;}
		if(!$scope.searchText){
			$scope.searchText = '';
		}
		//$http.get('http://localhost:8080/elika-warehouse/json/firmware.json')
		dataService.getData({limit:1000,pageNo:1,search_val:$scope.searchText},baseUrl + 'firmware/list')
		.success(function(response){
			if(response.status){
				$scope.firmwares = response.data.data;
				$scope.totalDisplayed = 8;
				
				if($scope.firmwares.length > $scope.totalDisplayed) {
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
					if($scope.totalDisplayed > $scope.firmwares.length) {				
						$scope.lmbtn = {
							"display" : "none"
						};	
					}			
				};
			}else{
				$scope.firmwares = [];
			}		
		});
	}
	$scope.firmwareInit();
	
	$scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }
	

	// add firmware submit

	$rootScope.submitAddFirmware = function(addFirmware,file){
		var fd = new FormData();
		//addFirmware.
			fd.append('file',file);
			$.each(addFirmware,function(index,value) {
				fd.append(index,value);
			});
		
		dataService.postDataWithFile(fd, baseUrl + 'firmware/add')
		.success(function(response){
			if(response.status){
				toaster.pop('success',response.msg.replace(/_/g,' '));
				$timeout(function(){$("#close").click();});
				$scope.firmwareInit();
			}else{
				dataService.responseError(response);
			}
		});
	}

	$scope.deviceModelInit = function(){
		dataService.getData(null,baseUrl + 'device/models-list')
		.success(function(response) {
			if(response.status == true){
				$rootScope.deviceModel = response.data;
			}
		});
		
	}
	$scope.deviceModelInit();

	$scope.deviceHardwareInit = function(){
		dataService.getData(null,baseUrl + 'firmware/list-harware-version')
		.success(function(response) {
		 	if(response.status == true){
		 		$scope.modelVersions = response.data;
		 	}
		});
	}
	$scope.deviceHardwareInit();
	$rootScope.deviceHardware = function(model){
		var versions = $scope.modelVersions[model]
		$rootScope.hardwareVersions = versions.split(',');
	}
	//$scope.deviceModelInit();
});


'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:ViewFirmwareCtrl
 * @description
 * # ViewFirmwareCtrl
 * Controller of the minovateApp
 */
app
  .controller('ViewFirmwareCtrl', function ($scope, $rootScope, $timeout, $mdDialog, $state, $stateParams, dataService, toaster) {
    $scope.page = {
		title: 'Firmware Details',
    };
	
    $scope.result = '';
    $scope.showConfirm = function(ev,id) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete firmware?')
		.content('')
		.ok('Yes')
		.cancel('No')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			//$state.go('app.firmware.firmware-management');
			$scope.deleteFirmware(id);
		}, function() {
			$scope.result = 'You decided to keep firmware.';
			$scope.statusclass = 'alert alert-success alert-dismissable';
		});
    };

    $scope.deleteFirmware = function(id){
		dataService.deleteData(null,baseUrl+'firmware/delete?firmware_id='+id)
		.success(function(response){
			if(response.status){
				toaster.pop('success','Firmware has been deleted successfully.');
				$state.go('app.firmware.firmware-management');
			}else{
				dataService.responseError(response);
			}
		});
	}

    dataService.getData({firmware_id:$stateParams.firmware_id},baseUrl+'firmware/view')
	.success(function(response){
		if(response.status){
			$scope.firmwareData = response.data;
			// $rootScope.deviceHardware($scope.device.device_model);
		}else{
			dataService.responseError(response);
		}
	});
});
