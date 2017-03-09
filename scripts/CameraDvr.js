'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:CameraDVRCtrl
 * @description
 * # CameraDVRCtrl
 * Controller of the minovateApp
 */
app
  .controller('CameraDVRCtrl', function ($scope, $mdDialog, $http, baseURL, $cookies, $rootScope) {
     $scope.page = {
      title: 'Camera DVR',
    };
		$scope.camgroup = {
		name: 'Add Camera group'
		};



  $scope.dashboardInit = function(){ 
	$http({
		url: baseURL + 'user/dashboard',   
		method: 'GET',   
		dataType : 'JSON',   
		headers: {    "Authorization": $cookies.get("token"),    
									"Content-type": "application/json"   
								}  
		})  
	.success(function(response) {   
		if(response.status == true){   
		 $rootScope.dashboardData = response.data;     
		 console.log($rootScope.dashboardData);   }  
		if(response.msg == 'Invalid_Token'){
		toaster.pop('error','Session Expired');
		$cookies.remove("token");
		$location.path('/core/login');return false;
		} 
	})  
	.error(function (data, status, headers, config) {     }); 
	} 
	$scope.dashboardInit();

	$scope.showcamadd = function(){
		$("#camform").css("display", "inline-block");
		
	}

	$scope.hidecamadd = function(){
		$("#camform").css("display", "none");
		
	}


	$scope.result = '';
    $scope.showConfirm = function(ev) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete camera group?')
		.content('')
		.ok('Yes')
		.cancel('Cancel')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			$scope.result = 'Camera group has been deleted successfully.';
			$scope.statusclass = 'alert alert-danger alert-dismissable';
		}, function() {
			$scope.result = 'You decided to keep camera group.';
			$scope.statusclass = 'alert alert-success alert-dismissable';
		});
    };
	
	$scope.layout = 'onecam';
	$scope.class = 'onegrid';
	$scope.changeaClass = function(){
		if ($scope.class === 'fourgrid' || $scope.class === 'twogrid' || $scope.class === 'onegrid')
		$scope.class = 'sixgrid';
		$scope.layout = 'sixcam';
	};
	
	$scope.changebClass = function(){
		if ($scope.class === 'twogrid' || $scope.class === 'onegrid' || $scope.class === 'sixgrid')
		$scope.class = 'fourgrid';
		$scope.layout = 'fourcam';
	};
	
	$scope.changecClass = function(){
		if ($scope.class === 'onegrid' || $scope.class === 'sixgrid' || $scope.class === 'fourgrid')
		$scope.class = 'twogrid';
		$scope.layout = 'twocam';
	};
	
	$scope.changedClass = function(){
		if ($scope.class === 'sixgrid' || $scope.class === 'fourgrid' || $scope.class === 'twogrid')
		$scope.class = 'onegrid';
		$scope.layout = 'onecam';
	};

	$scope.cameraInit = function(){ 
		$http({
			url: baseURL + 'camera/list?limits=8&pageNo=1&facility_id=All',   
			method: 'GET',   
			dataType : 'JSON',   
			headers: {    
									"Authorization": $cookies.get("token"),    
									"Content-type": "application/json"   
								}  
			})  
		.success(function(response) {   
			if(response.status == true){   
			 $scope.cameras = response.data;     
			 console.log($scope.cameras);   
			}  
			if(response.msg == 'Invalid_Token'){
				toaster.pop('error','Session Expired');
				$cookies.remove("token");
				$location.path('/core/login');return false;
			} 
		})  
		.error(function (data, status, headers, config) {     }); 
	} 

	$scope.cameraInit();
	
	$scope.imagePath = 'http://localhost/elika/images';
}); 
  
  

/*-----------------------------------------------------------------
			End code for controller
-----------------------------------------------------------------*/

