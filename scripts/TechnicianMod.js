'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:TechnicianCtrl
 * @description
 * # TechnicianCtrl
 * Controller of the minovateApp
 */
app
  .controller('TechnicianCtrl', function ($scope, $mdDialog, $http, $rootScope, $cookies, arrayPushService,toaster,baseURL,$location,errorHandler) {
     $scope.page = {
      title: 'Technician',
      subtitle: 'So much more to see at a glance.'
    };	
	
	$scope.status = '  ';
    $scope.showConfirm = function(ev) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete your user?')
		.content('The standard chunk of Lorem Ipsum used.')
		.ok('Delete')
		.cancel('Cancel')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			$scope.status = 'Your user has been deleted successfully.';
			$scope.statusclass = 'alert alert-danger alert-dismissable';
		}, function() {
			$scope.status = 'You decided to keep your users.';
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

	
	$scope.getTechnicians = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL+'technician/list',
			dataType : 'JSON', 
			//data: device,
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
	$scope.getTechnicians();
	
	$scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }
	
	$scope.imagePath = 'http://localhost:8080/elika/images';
	
});

'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:TechnicianProfileCtrl
 * @description
 * # TechnicianProfileCtrl
 * Controller of the minovateApp
 */
app
  .controller('TechnicianProfileCtrl', function ($scope, $http) {
     $scope.page = {
      title: 'Technician',
      subtitle: 'So much more to see at a glance.'
    };
	
	$scope.imagePath = 'http://localhost:8080/elika/images';	
	
});