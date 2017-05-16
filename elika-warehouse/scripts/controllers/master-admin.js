'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:MasterAdminCtrl
 * @description
 * # MasterAdminCtrl
 * Controller of the minovateApp
 */
app
  .controller('MasterAdminCtrl', function ($scope, $mdDialog, $http, $rootScope, dataService, toaster, $timeout ) {
     $scope.page = {
      title: 'Master Admin',
    };
	
	$scope.result = '  ';
    $scope.showConfirm = function(ev) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete master admin?')
		.content('')
		.ok('Yes')
		.cancel('No')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			$scope.result = 'Your master admin has been deleted successfully.';
			$scope.statusclass = 'alert alert-danger alert-dismissable';
		}, function() {
			$scope.result = 'You decided to keep master admin.';
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
	
	$http.get('http://localhost/elika-warehouse/json/admin.json').success(function(response){
		$scope.admin = response;
		$scope.totalDisplayed = 8;
		
		if($scope.admin.length > $scope.totalDisplayed) {
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
			if($scope.totalDisplayed > $scope.admin.length) {				
				$scope.lmbtn = {
					"display" : "none"
				};	
			}			
		};		
	});
	
	$scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }
	
	$scope.imagePath = 'http://localhost/elika-warehouse/images';	
	$rootScope.submitAddMasterAdmin = function(master,add_master_admin){
		$rootScope.errorMessage = '';
		console.log(master);
		
		 dataService.postData(master,baseUrl+'warehouse/add-master-admin')
		 .success(function(response){
		 	if(response.status == true){
				toaster.pop('success','Master Admin successfully added.');
		 		$timeout(function(){$("#close").click();});

		 	}else{
				console.log(response);
		 		var n = [];
		 		var arr = response.error;
		 		if(Array.isArray(arr) && arr != null){
		 		$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1) ; 
		 		$.each(value.messages, function(ind, value){ n[index] += " "+value })});
		 		$rootScope.errorMessage = n.join(", ");
				}
		 		if(response.msg == 'Invalid_Token'){
		 			$timeout(function(){$("#close").click();});
				}
		 		dataService.responseError(response);
		 	}
		 });
	}


});
