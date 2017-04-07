'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:DoorCtrl
 * @description
 * # DoorCtrl
 * Controller of the minovateApp
 */
app
  .controller('AdminCtrl', function ($scope, $mdDialog, $http, $rootScope, baseURL, $cookies, toaster, arrayPushService,appConstants,adminSvc) {
     $scope.page = {
      title: appConstants.admintitle,
      subtitle: appConstants.dashboardSubTitle
    };
	$rootScope.addDoors = {};
	$scope.dashboardInit = function(){
        adminSvc.dashboardInit(appConstants.userDashboard,appConstants.getMethod,{},{},function (succResponse) {
            if(succResponse.status){
                $rootScope.dashboardData = succResponse.data;
            }
        });
	};

	if(!$rootScope.hasOwnProperty('dashboardData')){
		$scope.dashboardInit();
	}
	$rootScope.createAdmin = function(admin, create_admin){
		if(!create_admin.validate()){
			return false;
		}
        adminSvc.createAdmin(appConstants.adminadd,appConstants.postMethod,{},admin,function (succResponse) {
            if(succResponse.status){
                $rootScope.dashboardData = succResponse.data;
            }
            else {
                $rootScope.admin_error=succResponse.msg;
			}
        });
	}
});
