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
  .controller('RoleCtrl', function ($scope, $http, $mdDialog) {
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
    
    $http.get('http://localhost:8080/newElika/elika_webapp2_dev_ui/newElika/json/admin/roles.json')
    .success(function(response){
        $scope.roles = response;
        $scope.totalDisplayed = 8;
        
        if($scope.roles.length > $scope.totalDisplayed) {
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
            if($scope.totalDisplayed >= $scope.roles.length) {
                $scope.lmbtn = {
                    "display" : "none"
                };              
            }
        };              
    });
    
    $scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }
    
    $scope.imagePath = 'http://localhost:8080/elika/images';    
    
});
