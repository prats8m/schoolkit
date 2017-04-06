'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:ForgotPasswordCtrl
 * @description
 * # ForgotPasswordCtrl
 * Controller of the minovateApp
 */
app
  .controller('ForgotPasswordCtrl', function ($scope,$state, $mdDialog, $http, $rootScope, $cookies, arrayPushService,toaster,baseURL,$location,errorHandler,$timeout, DTOptionsBuilder, DTColumnDefBuilder,dataService) {
    $scope.login = function() {
		$state.go('core.otp');
    };

    $scope.submitForgetPassword = function(requestData){
    	dataService.postData(requestData,baseURL + 'user/forget-password')
    	.success(function(response){
    		if(response.status){
    			toaster.pop('success', response.msg.replace(/_/g," "));
    			$cookies.put('forgetpasswordemail',requestData.email);
    			$scope.login();
    		}else{
    			dataService.responseError(response);
    		}
    	});
    }
});

'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:OTPCtrl
 * @description
 * # OTPCtrl
 * Controller of the minovateApp
 */
app
  .controller('OTPCtrl', function ($scope, $state, $mdDialog, $http, $rootScope, $cookies, arrayPushService,toaster,baseURL,$location,errorHandler,$timeout, DTOptionsBuilder, DTColumnDefBuilder,dataService) {
    $scope.login = function() {
		$state.go('core.create-new-password');
    };

    $scope.submitOTP = function(requestData){
    	requestData.email = $cookies.get('forgetpasswordemail');
    	requestData.otp = parseInt(requestData.otp);
    	dataService.postData(requestData,baseURL + 'user/check-otp')
    	.success(function(response){
    		if(response.status){
    			toaster.pop('success', response.msg.replace(/_/g," "));
    			$scope.login();
    		}else{
    			dataService.responseError(response);
    		}
    	});
    }
});


'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:CreatePasswordCtrl
 * @description
 * # CreatePasswordCtrl
 * Controller of the minovateApp
 */
app
  .controller('CreatePasswordCtrl', function ($scope, $state, $mdDialog, $http, $rootScope, $cookies, arrayPushService,toaster,baseURL,$location,errorHandler,$timeout, DTOptionsBuilder, DTColumnDefBuilder,dataService) {
    $scope.login = function() {
		$state.go('core.login');
    };

    $scope.submitNewPassword = function(requestData){
    	requestData.email = $cookies.get('forgetpasswordemail');
    	dataService.postData(requestData,baseURL + 'user/reset-password')
    	.success(function(response){
    		if(response.status){
    			toaster.pop('success', response.msg.replace(/_/g," "));
    			$scope.login();
    		}else{
    			dataService.responseError(response);
    		}
    	});
    }
});