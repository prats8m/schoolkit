'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:SettingCtrl
 * @description
 * # SettingCtrl
 * Controller of the minovateApp
 */
app
  .controller('SettingCtrl', function ($scope, $mdDialog, $http, $rootScope, $cookies, arrayPushService,$location,toaster, baseURL, $timeout) {
    $scope.page = {
		title: 'Settings',
		subtitle: 'Place subtitle here...'
    };
	
	
	$rootScope.doorList = [];
	$scope.getDoorsList = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL+'door/list',
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$rootScope.doorList = response.data.data;
				//console.log($scope.doorList);
			}else{
				
			}
		}).error(function(){

		});
	}
	$scope.getDoorsList();
	
	$scope.submitRelayDoor = function(relay){
		var relayArr = $.map(relay, function(value, index) {
			return [value];
		});
		$http(
		{
			method: 'PUT', 
			url: baseURL+'door/assign-device',
			dataType : 'JSON', 
			data: {'device_id':1,'relays':relayArr},
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				
			}else{
				
			}
		}).error(function(){

		});
	}
});