'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:DoorCtrl
 * @description
 * # DoorCtrl
 * Controller of the minovateApp
 */
app
  .controller('DoorCtrl', function ($scope, $mdDialog, $http, $rootScope, baseURL, $cookies, toaster) {
     $scope.page = {
      title: 'Doors',
      subtitle: 'So much more to see at a glance.'
    };
	$rootScope.addDoors = {};
	
	$scope.result = '';
    $scope.showConfirm = function(ev) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete Door?')
		.content('The standard chunk of Lorem Ipsum used.')
		.ok('Delete')
		.cancel('Cancel')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			$scope.result = 'Your Door has been deleted successfully.';
			$scope.statusclass = 'alert alert-danger alert-dismissable';
		}, function() {
			$scope.result = 'You decided to keep Door.';
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
	
	$scope.doorsInit = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL+'user/list?limit=8&pageNo='+$scope.pageNo+'&searchVal='+$scope.searchText+'&facilityId=3',
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
	
	$scope.facilityInit = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL+'facility/list',
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$rootScope.facilityList = response.data.data;
				$rootScope.addDoors.facility_id = parseInt($cookies.get('facilityId'));	
			}else{
				
			}
		}).error(function(){

		});
	}
	$scope.facilityInit();
	
	$rootScope.submitAddDoor = function(submitData){
		$http(
		{
			method: 'POST', 
			url: baseURL+'door/add',
			dataType : 'JSON', 
			data : submitData, 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				toaster.pop('success',response.msg.replace(/_/g,' '));
			}else{
				toaster.pop('error',response.msg.replace(/_/g,' '));
			}
		}).error(function(){

		});
	}
	
	$scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }
	
	$scope.imagePath = 'http://localhost:8080/elika/images';
	
});

'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:ViewDoorCtrl
 * @description
 * # ViewDoorCtrl
 * Controller of the minovateApp
 */
app
  .controller('ViewDoorCtrl', function ($scope, $http) {
     $scope.page = {
      title: 'Doors Details',
      subtitle: 'So much more to see at a glance.'
    };
	
	$scope.imagePath = 'http://localhost:8080/elika/images';	
	
});

'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:DoorGroupsCtrl
 * @description
 * # DoorGroupsCtrl
 * Controller of the minovateApp
 */
app
  .controller('DoorGroupsCtrl', function ($scope, $mdDialog, DTOptionsBuilder, DTColumnDefBuilder) {
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
	
});