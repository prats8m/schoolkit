'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:AddRolesCtrl
 * @description
 * # AddRolesCtrl
 * Controller of the minovateApp
 */
app
  .controller('AddRolesCtrl', function ($scope, $mdDialog, $http, $rootScope, dataService, toaster, $timeout) {
     $scope.page = {
      title: 'Add Roles',
    };

    $scope.role = {};
    $scope.role.status=1
    $scope.role.inventory = {};
    $scope.role.inventory.add = 0;
    $scope.role.inventory.edit = 0;
    $scope.role.inventory.delete = 0;
    $scope.role.firmware = {};
    $scope.role.firmware.view = 0;
    $scope.role.firmware.delete = 0;
    $scope.role.diagnostic = {};
    $scope.role.diagnostic.view = 0;
    $scope.role.diagnostic.edit = 0	;

    $scope.addrole = function(role){
    	dataService.postData(role,baseUrl+'warehouse/add-role')
    	.success(function(response){
    		if(response.status){
    			if(response.msg = 'Success'){
    				toaster.pop('success','Roles has been saved successfully.');
    				$location.path('app/administrator/roles');
    			}
    		}else{
    			var n = [];
    			var arr = response.error;
				if(Array.isArray(arr) && arr != null){
				$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1) ; $.each(value.messages, function(ind, value){ n[index] += " "+value })});
				$rootScope.errorMessage = n.join(", ");
				}
    			dataService.responseError(response);
    		}
    	});
    }
	
	$scope.imagePath = 'http://localhost:8080/elika-warehouse/images';	
	
});