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

	$scope.cameraInit = function(start, limit){ 
		
		$http({
			url: baseURL + 'camera/list?start='+start+'&limit='+limit+'&facility_id=',   
			method: 'GET',   
			dataType : 'JSON',   
			headers: {    
									"Authorization": $cookies.get("token"),    
									"Content-type": "application/json"   
								}  
			})  
		.success(function(response) {   
			if(response.status == true){  
			switch (limit) {
				  case 1:
							$scope.changedClass();				      
				      break;
				  case 2:
				      $scope.changecClass();
				      break;
				  case 4:
				      $scope.changebClass();
				      break;
				  case 6:
				      $scope.changeaClass();
				      break;
				  default:

				}
				
			 $scope.cameras = response.data;
			 $scope.ids = [];
			 angular.forEach(response.data, function(value, key){
      		$scope.ids[key] = value.camera_id;
   			}); 
			 $scope.camera_id = $scope.ids.join(",");
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

	$scope.addCameraGroup = function(cam_group){ 
			
		$http({
			url: baseURL + 'cameragroup/add',   
			method: 'POST',   
			dataType : 'JSON',
			data : {group_name: 'abc', camera_id: $scope.camera_id.split(",")},   
			headers: {    
									"Authorization": $cookies.get("token"),    
									"Content-type": "application/json"   
								}  
			})  
		.success(function(response) {   
			if(response.status == true){   
			 toaster.pop('success','Camera Group Created');   
			}  
			if(response.msg == 'Invalid_Token'){
				toaster.pop('error','Session Expired');
				$cookies.remove("token");
				$location.path('/core/login');return false;
			} 
		})  
		.error(function (data, status, headers, config) {     }); 
	} 
	
	$scope.imagePath = 'http://localhost/elika/images';
}); 
  
  

/*-----------------------------------------------------------------
			End code for controller
-----------------------------------------------------------------*/

