'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:AddRolesCtrl
 * @description
 * # AddRolesCtrl
 * Controller of the minovateApp
 */
app
  .controller('AddRolesCtrl', function ($scope, $mdDialog, $rootScope, toaster, $timeout, $location, baseURL, $uibModal, appConstants, administratorSvc, dashboardSvc) {
     $scope.page = {
      title: 'Add Roles',
    };

    $scope.roleAdd = {};
    //var moduleRole = {"add" : 0 , "view" : 0 , "delete" : 0, "edit" : 0};
	   $scope.roleAdd.facility = {"add" : 0 , "view" : 0 , "delete" : 0, "edit" : 0};
     $scope.roleAdd.device = {"add" : 0 , "view" : 0 , "delete" : 0, "edit" : 0};
     $scope.roleAdd.user = {"add" : 0 , "view" : 0 , "delete" : 0, "edit" : 0};
     $scope.roleAdd.usergroup = {"add" : 0 , "view" : 0 , "delete" : 0, "edit" : 0};
     $scope.roleAdd.technician = {"add" : 0 , "view" : 0 , "delete" : 0, "edit" : 0};
     $scope.roleAdd.door = {"add" : 0 , "view" : 0 , "delete" : 0, "edit" : 0};
     $scope.roleAdd.doorgroup = {"add" : 0 , "view" : 0 , "delete" : 0, "edit" : 0};
     $scope.roleAdd.schedule = {"add" : 0 , "view" : 0 , "delete" : 0, "edit" : 0};
     $scope.roleAdd.holiday_schedule = {"add" : 0 , "view" : 0 , "delete" : 0, "edit" : 0};
     $scope.roleAdd.role = {"add" : 0 , "view" : 0 , "delete" : 0, "edit" : 0};
     $scope.roleAdd.live_feed = {"add" : 0 , "view" : 0 , "delete" : 0, "edit" : 0};
     $scope.roleAdd.activity = {"add" : 0 , "view" : 0 , "delete" : 0, "edit" : 0};
     $scope.roleAdd.reports = {"add" : 0 , "view" : 0 , "delete" : 0, "edit" : 0};
	 
    $scope.submitData = function(roleAdd){
    	administratorSvc.submitData(appConstants.roleadd, appConstants.postMethod, {}, roleAdd, function(succResponse){
    		if(succResponse.status){
                toaster.pop(appConstants.success,appConstants._successrolesadded);
                $location.path('/app/admin/administrator/roles');
          
    		} else{
                $scope.result = succResponse.msg;
                $scope.statusclass = appConstants.dangerstatusClass;
			}
    	});
    }

    /* $scope.dashboardInit = function(){
        administratorSvc.dashboardInit(appConstants.userDashboard,appConstants.getMethod,{},{},function (succResponse) {
            if(succResponse.status){
                $rootScope.dashboardData = succResponse.data;
            }
        });
    };
    $scope.dashboardInit();*/

	$scope.imagePath = 'http://localhost/elika/images';	
	
});


'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:RoleCtrl
 * @description
 * # RoleCtrl
 * Controller of the minovateApp
 */
app
  .controller('RoleCtrl', function ($scope, $mdDialog, $rootScope, toaster, $timeout, $location, baseURL, $uibModal, appConstants, administratorSvc, dashboardSvc) {
     $scope.page = {
      title: 'Roles',
      subtitle: 'So much more to see at a glance.'
    };  
    
    $scope.result = '';
    $scope.showConfirm = function(ev) {
        var confirm = $mdDialog.confirm()       
        .title('Would you like to delete admin?')
        .content('The standard chunk of Lorem Ipsum used.')
        .ok('Delete')
        .cancel('Cancel')
        .targetEvent(ev);
        $mdDialog.show(confirm).then(function() {
            $scope.result = 'Your admin has been deleted successfully.';
            $scope.statusclass = 'alert alert-danger alert-dismissable';
        }, function() {
            $scope.result = 'You decided to keep admin.';
            $scope.statusclass = 'alert alert-success alert-dismissable';
        });
    };
    
    $scope.layout = 'grid';
    $scope.class = 'gridview';
    $scope.changeClass = function(){
        if ($scope.class === 'gridview')
        $scope.class = 'listview';
        $scope.layout = 'list';
    };
    
    $scope.changeaClass = function(){
        if ($scope.class === 'listview')
        $scope.class = 'gridview';
        $scope.layout = 'grid';
    };
    $scope.rolesInit = function(){
      administratorSvc.rolesInit(appConstants.rolelist, appConstants.getMethod, {}, {}, function(succResponse){
          if(succResponse.status){
                    $scope.aroles = [];
                    angular.forEach(succResponse.data.data, function (role, index) {
                        $scope.aroles.push(role);
                    });
             $scope.totalDisplayed = 8;
           
             if($scope.aroles.length > $scope.totalDisplayed) {
                 $scope.lmbtn = {
                     "display" : "block"
                 };          
             } else {
                 $scope.lmbtn = {
                     "display" : "none"
                 };
             }
          
             $scope.loadMore = function () {             
                 $scope.totalDisplayed += 8;
                 if($scope.totalDisplayed >= $scope.aroles.length) {
                     $scope.lmbtn = {
                         "display" : "none"
                     };              
                 }
             };
        
          } 
      });
    }
    $scope.rolesInit();
    
    $scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }

    /* $scope.dashboardInit = function(){
        administratorSvc.dashboardInit(appConstants.userDashboard,appConstants.getMethod,{},{},function (succResponse) {
            if(succResponse.status){
                $rootScope.dashboardData = succResponse.data;
            }
        });
    };
    $scope.dashboardInit();*/
    
    $scope.imagePath = 'http://localhost:8080/elika/images';    
    
});


'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the minovateApp
 */
app
  .controller('AdminCtrl', function ($scope, $http, $mdDialog, $rootScope, toaster, $timeout, $location, baseURL, $uibModal, appConstants, administratorSvc, dashboardSvc) {
     $scope.page = {
      title: 'Admin',
    };

    $rootScope.adminTypes = appConstants.adminTypes;
  
    $scope.status = '  ';
    $scope.showConfirm = function(ev) {
    var confirm = $mdDialog.confirm()   
    .title(appConstants._messagedeleteadmin)
    .content('')
    .ok('Yes')
    .cancel('Cancel')
    .targetEvent(ev);
    $mdDialog.show(confirm).then(function() {
      $scope.status = 'Your admin has been deleted successfully.';
      $scope.statusclass = 'alert alert-danger alert-dismissable';
    }, function() {
      $scope.status = 'You decided to keep admin.';
      $scope.statusclass = 'alert alert-success alert-dismissable';
    });
    };
  
  $scope.layout = 'grid';
  $scope.class = 'gridview';
  $scope.changeClass = function(){
    if ($scope.class === 'gridview')
    $scope.class = 'listview';
    $scope.layout = 'list';
  };
  
  $scope.changeaClass = function(){
    if ($scope.class === 'listview')
    $scope.class = 'gridview';
    $scope.layout = 'grid';
  };

  
  
  $scope.adminInit = function(){
    administratorSvc.adminInit(appConstants.adminlist, appConstants.getMethod, {}, {}, function(succResponse){
        if(succResponse.status){
          // toaster.pop(appConstants.success,appConstants._successadminadded);
        } else {
          // $scope.result = succResponse.msg;
          // $scope.statusclass = appConstants.dangerstatusClass;
        }
    });
  }
  $scope.adminInit();

  $rootScope.submitAddAdmin = function(addAdmin,form){
    if( ! form.validate()){
      return false;
    }
    administratorSvc.submitAddAdmin(appConstants.adminadd, appConstants.postMethod, {}, addAdmin, function(succResponse){
        if(succResponse.status){
          toaster.pop(appConstants.success,appConstants._successadminadded);
        } else {
          //$scope.result = succResponse.msg;
          //$scope.statusclass = appConstants.dangerstatusClass;
          toaster.pop(appConstants.error, succResponse.msg);
        }
    });
  }

  $scope.rolesInit = function(){
      administratorSvc.rolesInit(appConstants.rolelist, appConstants.getMethod, {}, {}, function(succResponse){
          if(succResponse.status){
             $rootScope.userRoles = succResponse.data.data;
          } 
      });
    }
    $scope.rolesInit();
  
  $scope.orderByMe = function(x) {
       $scope.myOrderBy = x;
  }

  /* $scope.dashboardInit = function(){
      administratorSvc.dashboardInit(appConstants.userDashboard,appConstants.getMethod,{},{},function (succResponse) {
          if(succResponse.status){
              $rootScope.dashboardData = succResponse.data;
          }
      });
  };
  $scope.dashboardInit();*/
  
  $scope.imagePath = 'http://elikastaging.ml/images'; 
  
});
