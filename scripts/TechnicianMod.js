'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:TechnicianCtrl
 * @description
 * # TechnicianCtrl
 * Controller of the minovateApp
 */
app
  .controller('TechnicianCtrl', function ($scope, $mdDialog, $http, $rootScope, $cookies, arrayPushService,toaster,baseURL,$location,errorHandler,appConstants,technicianSvc) {
     $scope.page = {
      title: appConstants.technicianUiTitle,
      subtitle: appConstants.dashboardSubTitle
    };
	$scope.status = '  ';
    $scope.showConfirm = function(ev) {
		var confirm = $mdDialog.confirm()		
		.title(appConstants.deleteuserconfirmationmessage)
		.content(appConstants.content)
		.ok(appConstants.delete)
		.cancel(appConstants.cancel)
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			$scope.status = appConstants._successfullyuserdeletedmessage;
			$scope.statusclass = appConstants.dangerstatusClass;
		}, function() {
			$scope.status = appConstants._canceluserfromdelete;
			$scope.statusclass = appConstants.successstatusClass;
		});
    };
	
	$scope.layout = appConstants.gridLayout;
	$scope.class = appConstants.gridviewClass;
	$scope.changeClass = function(){
		if ($scope.class === appConstants.gridviewClass)
		$scope.class = appConstants.listviewClass;
		$scope.layout = appConstants.listLayout;
	};
	
	$scope.changeaClass = function(){
		if ($scope.class === appConstants.listviewClass)
		$scope.class = appConstants.gridviewClass;
		$scope.layout = appConstants.gridLayout;
	};
	
	$scope.getTechnicians = function(){
        technicianSvc.getTechnicians(appConstants.technicianlist,appConstants.getMethod,{},{},function (succResponse) {
            if(succResponse.status){
                $scope.technicianList = succResponse.data;
            }
        });
	};
	$scope.getTechnicians();
	
	$scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    };
	
	$scope.imagePath = baseURL+appConstants.imagePath;
	
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
      title: appConstants.technicianProfileUiTitle,
      subtitle: appConstants.dashboardSubTitle
    };
	
	$scope.imagePath = baseURL+appConstants.imagePath;
	
});