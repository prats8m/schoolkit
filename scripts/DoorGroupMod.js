'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:DoorGroupsCtrl
 * @description
 * # DoorGroupsCtrl
 * Controller of the minovateApp
 */
app
  .controller('DoorGroupsCtrl', function ($scope, $mdDialog, DTOptionsBuilder, DTColumnDefBuilder, $http, $rootScope, $cookies, arrayPushService,toaster,baseURL,$location,errorHandler) {
     $scope.page = {
      title: 'Door Groups',
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
	
	$scope.doorgroups = [{
      title: 'Pool Gate',
	  noofdoors: 20
    },{
      title: 'Entry Gate',
	  noofdoors: 8
    },{
      title: 'Exit Gate',
	  noofdoors: 8
    }];

    $scope.dtOptions = DTOptionsBuilder.newOptions().withBootstrap();
    $scope.dtColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0),
      DTColumnDefBuilder.newColumnDef(1),
      DTColumnDefBuilder.newColumnDef(2).notSortable()
    ];
	
	
	
	$rootScope.submitCreateDoorGroup = function(doorGroup){
		
		$http(
		{
			method: 'POST', 
			url: baseURL+'doorgroup/add',
			data:{ name:doorGroup.name, door_id:doorGroup.doors, status:1, "facility_id":parseInt($cookies.get('facilityId'))},
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				toaster.pop('success',response.msg.replace(/_/g , " "));
			}else{
				toaster.pop('error',response.msg.replace(/_/g , " "));
				if(response.msg == 'Invalid_Token'){
					$cookies.remove("token");
					$location.path('/core/login');return false;
				}
			}
		}).error(function(){

		});
	}
	
	$scope.getDoorsList = function(){
		$http({
			url: baseURL+'doorgroup/list',
			method: 'GET',
			dataType : 'JSON',
			headers: {
				"Content-type": "application/json",
				'Authorization': $cookies.get("token")
			}
		})
		.success(function(response) {
			if(response.status == true){
				$rootScope.doorGroupList = response.data;
			}else{
				
			}
		})
		.error(function(){

		});
	}
	$scope.getDoorsList();
	
	
});