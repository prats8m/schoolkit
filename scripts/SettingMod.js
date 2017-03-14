'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:SettingCtrl
 * @description
 * # SettingCtrl
 * Controller of the minovateApp
 */
app
  .controller('DeviceSettingsCtrl', function ($scope, $mdDialog, $http, $rootScope, $cookies, arrayPushService,$location,toaster, baseURL, $timeout, $stateParams,dataService)
  {
    $scope.page = {
		title: 'Settings',
		subtitle: ''
    };
	
	$scope.device_id = $stateParams.device_id;
	$rootScope.doorList = [];
	$scope.relays = [];
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
						relay:data[i].drd_relay,
						door_id:data[i].drd_door_id,
						status:data[i].drd_status,
						strike_time:data[i].strike_time,
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
		dataService.putData({'device_id':parseInt($scope.device_id),'relays':relayArr},baseURL+'door/assign-device')
		.success(function(response){
			if(response.status == true){
				toaster.pop('success',response.msg.replace(/_/g,' '));
			}else{
				dataService.responseError(response);
			}
		});
	}
	
	$scope.accessGrantKey = function(accessGrantKey){
		dataService.postData({'device_id':parseInt($stateParams.device_id),'module':'access-grant-key','type':'gen','value':{'access-grant-key':accessGrantKey}},baseURL+'device/add-settings')
		.success(function(response){
			if(response.status == true){
				toaster.pop('success',response.msg.replace(/_/g,' '));
			}else{
				dataService.responseError(response);
			}
		});
	}

	$scope.submitData = function(module,data){
		dataService.postData({'device_id':parseInt($stateParams.device_id),'module':module,'type':'gen','value':data},baseURL+'device/add-settings')
		.success(function(response){
			if(response.status == true){
				toaster.pop('success',response.msg.replace(/_/g,' '));
			}else{
				dataService.responseError(response);
			}
		});
	}

	$scope.getSetting = function(){
		dataService.getData({'device_id':$stateParams.device_id,'type':'gen'},baseURL+'device/get-settings')
		.success(function(response){
			if(response.status == true){
				$scope.device = response.data;
			}else{
				dataService.responseError(response);
			}
		});
	}
	$scope.getSetting();
});

/*==================================================================*/
/*						DataService									*/
/*==================================================================*/

app.service('dataService',["$http","toaster","$cookies","$location",function($http,toaster,$cookies,$location) {
	delete $http.defaults.headers.common['X-Requested-With'];
	this.getData = function(param,url) {
		return $http({
			method: 'GET',
			url: url,
			params: param,
			dataType : 'JSON', 
			headers: { 'Content-Type' : 'application/json',"Authorization": $cookies.get("token")}                  
		}).error(function(){
			toaster.pop('error', 'Something went wrong.');
		});
	};
	this.postData = function(data,url) {
		return $http({
			method: "POST",
			url: url,
			data: data,
			headers: { 'Content-Type' : 'application/json',"Authorization": $cookies.get("token")}                  
		}).error(function(){
			toaster.pop('error', 'Something went wrong.');
		});
	};
	this.putData = function(data,url) {
		return $http({
			method: "PUT",
			url: url,
			data: data,
			headers: { 'Content-Type' : 'application/json',"Authorization": $cookies.get("token")}                  
		}).error(function(){
			toaster.pop('error', 'Something went wrong.');
		});
	};
	this.deleteData = function(data,url) {
		return $http({
			method: "DELETE",
			url: url,
			//data: data,
			headers: { 'Content-Type' : 'application/json',"Authorization": $cookies.get("token")}                  
		}).error(function(){
			toaster.pop('error', 'Something went wrong.');
		});
	};
	this.login = function(data,url) {
		return $http({url: url,
			method: 'POST',
			data: data,
			dataType : 'JSON',
			headers: {
				"Content-type": "application/json",
			}
		}).error(function(){
			toaster.pop('error', 'Something went wrong.');
		});
	}
	this.responseError = function(response){
		if(response.msg == 'Invalid_Token'){
			$cookies.remove("token");
			toaster.pop('error','Session Expired');
			$location.path('/core/login');return false;
		}else{
			toaster.pop('error',response.msg.replace(/_/g," "));
		}
	}

}]);