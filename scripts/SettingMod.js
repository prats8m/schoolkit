'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:SettingCtrl
 * @description
 * # SettingCtrl
 * Controller of the minovateApp
 */
app
  .controller('SettingCtrl', function ($scope, $mdDialog, $http, $rootScope, $cookies, arrayPushService,$location,toaster, baseURL, $timeout, $stateParams)
  {
    $scope.page = {
		title: 'Settings',
		subtitle: 'Place subtitle here...'
    };
	
	$scope.device_id = $stateParams.device_id;
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
				/* $scope.relays = [
					{relay:'Relay 1',door_id:5,status:'Active'},
					{relay:'Relay 2',door_id:2,status:'Active'},
					{relay:'Relay 3',door_id:3,status:'Active'},
					{relay:'Relay 4',door_id:4,status:'Active'}
					
				]; */
			}else{
				
			}
		}).error(function(){

		});
	}
	$scope.getDoorsList();
	
	$scope.getRelaySetup = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL+'device/get-device-relay?device_id=' + $scope.device_id,
			dataType : 'JSON', 
			// data: {'device_id':1,'relays':relayArr},
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				var data = response.data;
				var relayData = [];
				var tmp;
				for(var i=0;i < data.length;i++){
					tmp = {
						id:data[i].drd_id,
						device_id:data[i].drd_device_id,
						relay:data[i].drd_relay,
						door_id:data[i].drd_door_id,
						status:data[i].drd_status,
					};
					relayData.push(tmp);
				}					
				$scope.relays = relayData;
			}else{
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');return false;
				}else{
							
					
					toaster.pop('error',response.msg.replace(/_/g,' '));
				}
			}
		}).error(function(){

		});
	}
	$scope.getRelaySetup();
	
	$scope.submitRelayDoor = function(relay){
		var relayArr = $.map(relay, function(value, index) {
			return [value];
		});
		$http(
		{
			method: 'PUT', 
			url: baseURL+'door/assign-device',
			dataType : 'JSON', 
			data: {'device_id':parseInt($scope.device_id),'relays':relayArr},
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				toaster.pop('success',response.msg.replace(/_/g,' '));
			}else{
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');return false;
				}else{
					toaster.pop('error',response.msg.replace(/_/g,' '));
				}
			}
		}).error(function(){

		});
	}
});