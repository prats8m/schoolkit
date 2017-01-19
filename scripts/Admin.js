'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:DoorCtrl
 * @description
 * # DoorCtrl
 * Controller of the minovateApp
 */
app
  .controller('AdminCtrl', function ($scope, $mdDialog, $http, $rootScope, baseURL, $cookies, toaster, arrayPushService) {
     $scope.page = {
      title: 'Doors',
      subtitle: 'So much more to see at a glance.'
    };
	$rootScope.addDoors = {};
	
	$scope.dashboardInit = function(){
		$http({
			url: baseURL + 'user/dashboard',
			method: 'GET',
			dataType : 'JSON',
			headers: {
				"Authorization": $cookies.get("token"),
				"Content-type": "application/json"
			}
		})
		.success(function(response) {
			if(response.status == true){
				$rootScope.dashboardData = response.data[0];
				// console.log($rootScope.dashboardData);
			}
		})
		.error(function (data, status, headers, config) {
			
		});
	}
	if(!$rootScope.hasOwnProperty('dashboardData')){
		$scope.dashboardInit();
	}

	$rootScope.createAdmin = function(admin, create_admin){
		if(!create_admin.validate()){
			return false;
		}
		$http({
			url: baseURL + 'admin/add',
			method: 'POST',
			dataType : 'JSON',
			data: admin,
			headers: {
				"Authorization": $cookies.get("token"),
				"Content-type": "application/json"
			}
		})
		.success(function(response) {
			if(response.status == true){
				$rootScope.dashboardData = response.data[0];
				// console.log($rootScope.dashboardData);
			}
			else{
				var n = [];
				var arr = response.error;
				if(arr != null){
				$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
				$rootScope.admin_error = n.join(", ");
				}
				else{
					$rootScope.admin_error = response.msg.replace(/_/g,' ');
				}
			}
		})
		.error(function (data, status, headers, config) {
			
		});
	}
});
