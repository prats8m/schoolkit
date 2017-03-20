'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:SettingCtrl
 * @description
 * # SettingCtrl
 * Controller of the minovateApp
 */


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