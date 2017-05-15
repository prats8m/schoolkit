'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:DeviceCtrl
 * @description
 * # DeviceCtrl
 * Controller of the minovateApp
 */
app
  .controller('DeviceCtrl', function ($scope, $mdDialog, $http,$rootScope,dataService,toaster,$timeout,$cookies,$location) {
    $scope.page = {
		title: 'Devices',
    };


	$scope.result = '';
	$scope.devices = [];
    $scope.showConfirm = function(ev,id) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete device?')
		.content('')
		.ok('Yes')
		.cancel('No')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			$scope.deleteDevice(id);
		}, function() {
			toaster.pop('info','You decided to keep device.');
		});
    };

	$scope.deleteDevice = function(id){
		dataService.deleteData(null,baseUrl+'warehouse-device/delete?device_id='+id)
		.success(function(response){
			if(response.status){
				toaster.pop('success','Device has been deleted successfully.');
			}else{
				dataService.responseError(response);
			}
			$timeout(function(){$scope.deviceInit()});
		});
	}
	
	$scope.deviceInit = function(e){
		if(e)
		if(e.keyCode!=13){return false;}
		if(!$scope.searchText){
			$scope.searchText = '';
		}
		dataService.getData({limit:1000,pageNo:1,searchVal:$scope.searchText},
			baseUrl+'warehouse-device/list')
		.success(function(response){
			if(response.status){
				$scope.devices = response.data.data;
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
			}else{
				dataService.responseError(response);
				$scope.devices = [];
				if($scope.devices.length == 0){
					$scope.lmbtn = {"display":"none"};	
				}
			}
		});
	}
	$scope.deviceInit();
	
	$scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }
	$rootScope.errorMessage = '';
	$rootScope.submitAddDevice = function(device,add_device){
		$rootScope.errorMessage = '';
		device.account_no = parseInt(device.account_no);
		device.device_cell = (! device.device_cell) ? 0 : device.device_cell;
		device.device_voip = (! device.device_voip) ? 0 : device.device_voip;
		device.device_camera = (! device.device_camera) ? 0 : device.device_camera;
		device.device_wiegand = (! device.device_wiegand) ? 0 : device.device_wiegand;
		
		dataService.postData(device,baseUrl+'device/add-device-warehouse')
		.success(function(response){
			if(response.status == true){
				toaster.pop('success','Device successfully added.');
				$timeout(function(){$("#close").click();});
				$scope.deviceInit();
			}else{
				
				var n = [];
				var arr = response.error;
				if(Array.isArray(arr) && arr != null){
				$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1) ; $.each(value.messages, function(ind, value){ n[index] += " "+value })});
				$rootScope.errorMessage = n.join(", ");
				}
				if(response.msg == 'Invalid_Token'){
					$timeout(function(){$("#close").click();});
				}
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
});

'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:ViewDeviceCtrl
 * @description
 * # ViewDeviceCtrl
 * Controller of the minovateApp
 */
app
  .controller('ViewDeviceCtrl', function ($scope,$rootScope,$timeout, $mdDialog, $state,$stateParams,dataService,toaster) {
    $scope.page = {
		title: 'Device Details',
    };
	
	$scope.result = '';
    $scope.showConfirm = function(ev,id) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete device?')
		.content('')
		.ok('Yes')
		.cancel('No')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			$scope.deleteDevice(id);
		}, function() {
			toaster.pop('info','You decided to keep device.');
		});
    };
	
	$scope.deleteDevice = function(id){
		dataService.deleteData(null,baseUrl+'warehouse-device/delete?device_id='+id)
		.success(function(response){
			if(response.status){
				toaster.pop('success','Device has been deleted successfully.');
				$state.go('app.inventory.devices');
			}else{
				dataService.responseError(response);
			}
		});
	}
	
	dataService.getData({device_id:$stateParams.device_id},baseUrl+'warehouse-device/view')
	.success(function(response){
		if(response.status){
			$scope.device = response.data[0];
			$rootScope.deviceHardware($scope.device.device_model);
		}else{
			dataService.responseError(response);
		}
	});

	$rootScope.submitUpgradeFirmware = function(upgradeFirmware){
		upgradeFirmware.device_id = $stateParams.device_id;
		dataService.postData(upgradeFirmware,baseUrl+'firmware/upgrade')
		.success(function(response){
			if(response.status){
				toaster.pop('success',response.msg.replace(/_/g,' '));
				$timeout(function(){$("#close").click();});
			}else{
				dataService.responseError(response);
			}
		});
	}

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
	
});

'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:EditDeviceCtrl
 * @description
 * # EditDeviceCtrl
 * Controller of the minovateApp
 */
app
  .controller('EditDeviceCtrl', function ($scope, $mdDialog, $state,$stateParams,dataService,toaster,$rootScope) {
    $scope.page = {
		title: 'Edit Device',
    };
	
	$scope.result = '';
    $scope.showConfirm = function(ev,id) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete device?')
		.content('')
		.ok('Yes')
		.cancel('No')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			$scope.deleteDevice(id);
		}, function() {
			toaster.pop('info','You decided to keep device.');
		});
    };
	
	$scope.deleteDevice = function(id){
		dataService.deleteData(null,baseUrl+'warehouse-device/delete?device_id='+id)
		.success(function(response){
			if(response.status){
				toaster.pop('success','Device has been deleted successfully.');
				$state.go('app.inventory.devices');
			}else{
				dataService.responseError(response);
			}
		});
	}
	
	$scope.dataInit = function(){
		dataService.getData({device_id:$stateParams.device_id},baseUrl+'warehouse-device/view')
		.success(function(response){
			if(response.status){
				$scope.device = response.data[0];
			}else{
				dataService.responseError(response);
			}
		});
	}
	$scope.dataInit();
	
	$scope.deviceModelInit = function(){
		dataService.getData(null,baseUrl + 'device/models-list')
		.success(function(response) {
			if(response.status == true){
				$scope.deviceModel = response.data;
			}
		});
		
	}
	$scope.deviceModelInit();
	
	$scope.submitEditDevice = function(device){
		$rootScope.errorMessage = '';
		device.account_no = parseInt(device.device_account_no);
		device.phone_no = device.device_phone_no;
		device.serial_no = device.device_serial_no;
		device.reg_code = device.device_registration_code;
		device.mac_address = device.device_mac_address;
		device.device_cell = (! device.device_cell)? 0 : device.device_cell;
		device.device_voip = (! device.device_voip)? 0 : device.device_voip;
		device.device_camera = (! device.device_camera)? 0 : device.device_camera;
		device.device_wiegand = (! device.device_wiegand)? 0 : device.device_wiegand;
		dataService.putData(device,baseUrl + 'device/edit-device-warehouse')
		.success(function(response) {
			if(response.status == true){
				toaster.pop('success','Device successfully updated.');
				//$scope.dataInit();
			}else{

				var n = [];
				var arr = response.error;
				if(Array.isArray(fruits) && arr != null){
				$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1) ; $.each(value.messages, function(ind, value){ n[index] += " "+value })});
				$rootScope.errorMessage = n.join(", ");
				}
				dataService.responseError(response);
			}
		});
	}
	
});


app
  .filter('warehouseClientName', function() {
    return function(x) {
        if(x == 'null'||x == null){return "Un-Registered";}else{ return x.facility_name ;}
	}
});
  app
  .filter('warehouseClientNameInList', function() {
    return function(x) {
        if(x == 'null'||x == null){return "Un-Registered";}else{ return x ;}
	}
});
app
  .filter('warehouseDeviceFeatures', function() {
    return function(x) {
        if(x == 0){return "N/A";}else{ return "Yes";}
	}
});