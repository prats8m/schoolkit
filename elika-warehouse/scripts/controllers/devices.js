'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:DeviceCtrl
 * @description
 * # DeviceCtrl
 * Controller of the minovateApp
 */
app
  .controller('DeviceCtrl', function ($scope, $mdDialog, $http,$rootScope,dataService,toaster,$timeout) {
    $scope.page = {
		title: 'Devices',
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
			}else{
				toaster.pop('error',response.msg.replace(/_/g,' '));
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
		device.phone_no = parseInt(device.phone_no);
		device.device_cell = (! device.device_cell)? 0 : device.device_cell;
		device.device_voip = (! device.device_voip)? 0 : device.device_voip;
		device.device_camera = (! device.device_camera)? 0 : device.device_camera;
		device.device_wiegand = (! device.device_wiegand)? 0 : device.device_wiegand;
		
		dataService.postData(device,baseUrl+'device/add-device-warehouse')
		.success(function(response){
			if(response.status == true){
				toaster.pop('success','Device successfully added.');
				$timeout(function(){$("#close").click();});
			}else{
				
				var n = [];
				var arr = response.error;
				if(arr != null){
				$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1) ; $.each(value.messages, function(ind, value){ n[index] += " "+value })});
				$rootScope.errorMessage = n.join(", ");
				}
				
				toaster.pop('error',response.msg.replace(/_/g,' '));
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
  .controller('ViewDeviceCtrl', function ($scope, $mdDialog, $state,$stateParams,dataService,toaster) {
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
				toaster.pop('error',response.msg.replace(/_/g," "));
			}
		});
	}
	
	dataService.getData({device_id:$stateParams.device_id},baseUrl+'warehouse-device/view')
	.success(function(response){
		if(response.status){
			$scope.device = response.data;
		}else{
			toaster.pop('error',response.msg);
		}
	});
	
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
				toaster.pop('error',response.msg.replace(/_/g," "));
			}
		});
	}
	
	dataService.getData({device_id:$stateParams.device_id},baseUrl+'warehouse-device/view')
	.success(function(response){
		if(response.status){
			$scope.device = response.data;
		}else{
			toaster.pop('error',response.msg);
		}
	});
	
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
		device.phone_no = parseInt(device.device_phone_no);
		device.serial_no = device.device_serial_no;
		device.reg_code = device.device_registration_code;
		device.mac_address = device.device_mac_address;
		device.device_cell = (! device.device_cell)? 0 : device.device_cell;
		device.device_voip = (! device.device_voip)? 0 : device.device_voip;
		device.device_camera = (! device.device_camera)? 0 : device.device_camera;
		device.device_wiegand = (! device.device_wiegand)? 0 : device.device_wiegand;
		//  console.log(JSON.stringify(device));
		dataService.putData(device,baseUrl + 'device/edit-device-warehouse')
		.success(function(response) {
			if(response.status == true){
				toaster.pop('success','Device successfully updated.');
			}else{
				var n = [];
				var arr = response.error;
				if(arr != null){
				$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1) ; $.each(value.messages, function(ind, value){ n[index] += " "+value })});
				$rootScope.errorMessage = n.join(", ");
				}
				
				toaster.pop('error',response.msg.replace(/_/g,' '));
			}
		});
	}
	
});


app
  .filter('warehouseClientName', function() {
    return function(x) {
        if(x == 'null'){return "Un-Registered";}else{ return x ;}
	}
   });