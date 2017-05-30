'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:AddRolesCtrl
 * @description
 * # AddRolesCtrl
 * Controller of the minovateApp
 */
app
  .controller('AddRolesCtrl', function ($scope, $mdDialog, $http, $rootScope, dataService, toaster, $timeout,$location) {
     $scope.page = {
      title: 'Add Roles',
    };

    $scope.role = {};
    $scope.role.status=1
    $scope.role.inventory = {};
    $scope.role.inventory.add = 0;
    $scope.role.inventory.edit = 0;
    $scope.role.inventory.delete = 0;
    $scope.role.firmware = {};
    $scope.role.firmware.view = 0;
    $scope.role.firmware.delete = 0;
    $scope.role.diagnostic = {};
    $scope.role.diagnostic.view = 0;
    $scope.role.diagnostic.edit = 0	;

    $scope.addrole = function(role){
    	dataService.postData(role,baseUrl+'warehouse/add-role')
    	.success(function(response){
    		if(response.status){
    			if(response.msg = 'Success'){
    				toaster.pop('success','Roles has been saved successfully.');
    				$location.path('app/administrator/roles');
    			}
    		}else{
    			var n = [];
    			var arr = response.error;
				if(Array.isArray(arr) && arr != null){
				$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1) ; $.each(value.messages, function(ind, value){ n[index] += " "+value })});
				$rootScope.errorMessage = n.join(", ");
				}
    			dataService.responseError(response);
    		}
    	});
    }
	
	$scope.imagePath = 'http://localhost:8080/elika-warehouse/images';	
	
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
  .controller('RoleCtrl', function ($scope,toaster,$timeout, $state, $mdDialog, $http, $rootScope, dataService) {
     $scope.page = {
      title: 'Roles',
    };  
    
    $scope.result = '';
    $scope.showConfirm = function(ev) {
        var confirm = $mdDialog.confirm()       
        .title('Would you like to delete role?')
        .content('')
        .ok('Yes')
        .cancel('No')
        .targetEvent(ev);
        $mdDialog.show(confirm).then(function() {
            $scope.result = 'Your role has been deleted successfully.';
            $scope.statusclass = 'alert alert-danger alert-dismissable';
        }, function() {
            $scope.result = 'You decided to keep role.';
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
      
    $scope.rolesInit = function(e){  
        if(e)
        if(e.keyCode!=13){return false;}
        if(!$scope.searchText){
            $scope.searchText = '';
        }
        // $http.get('http://localhost:8080/elika-warehouse/json/roles.json')
        dataService.getData({limit:1000,pageNo:1,search_val:$scope.searchText},baseUrl + 'warehouse/list-role')
        .success(function(response){
            if(response.status){
                $scope.aroles = response.data.data;
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
            } else {
                $scope.aroles = [];
            }            
        });
    }
    $scope.rolesInit();
    
    $scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }
    
    $scope.imagePath = 'http://localhost:8080/elika-warehouse/images';  
    
});