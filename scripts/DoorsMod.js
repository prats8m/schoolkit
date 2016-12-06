'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:DoorCtrl
 * @description
 * # DoorCtrl
 * Controller of the minovateApp
 */
app
  .controller('DoorCtrl', function ($scope, $mdDialog, $http) {
     $scope.page = {
      title: 'Doors',
      subtitle: 'So much more to see at a glance.'
    };
	
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
			url: 'http://35.160.142.158:8080/user/list?limit=8&pageNo='+$scope.pageNo+'&searchVal='+$scope.searchText+'&facilityId=3',
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