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
	
	
	$scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }

	$rootScope.submitAddMasterAdmin = function(master,add_master_admin){
		console.log();
		if(!add_master_admin.validate()){
	      return false;
	    }
		$rootScope.errorMessage = '';
		
		 dataService.postData(master,baseUrl+'warehouse/add-master-admin')
		 .success(function(response){
		 	if(response.status == true){
				toaster.pop('success','Master Admin successfully added.');
		 		$timeout(function(){$("#close").click();});
		 		$scope.listMasterAdmin();

		 	}else{
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

	$scope.listMasterAdmin = function(){
		 dataService.getData({},baseUrl+'warehouse/list-master-admin')
		 .success(function(response){
		 	if(response.status == true){
		 		$scope.listData = response.data.data;
		 	}else{
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
	$scope.listMasterAdmin();


});


'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:MasterAdminProfileCtrl
 * @description
 * # MasterAdminProfileCtrl
 * Controller of the minovateApp
 */
app
  .controller('MasterAdminProfileCtrl', function ($scope, $mdDialog, $http, $rootScope, dataService, toaster, $timeout, $state, $stateParams) {
     $scope.page = {
      title: 'Master Admin Profile',
    };
	$scope.user_id = $stateParams.user_id;
	$scope.result = '  ';
    $scope.showConfirm = function(ev,id) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete master admin?')
		.content('')
		.ok('Yes')
		.cancel('No')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			$state.go('app.administrator.master-admin');
		}, function() {
			$scope.result = 'You decided to keep master admin.';
			$scope.statusclass = 'alert alert-success alert-dismissable';
		});
    };


	
	$scope.imagePath = 'http://localhost/elika-warehouse/images';

	$scope.viewUserDetails = function(){
		 dataService.getData({},baseUrl+'user/view-user-details?user_id=' + $stateParams.user_id)
		 .success(function(response){
		 	if(response.status == true){
		 		$scope.userData = response.data;
		 	}else{
		 		dataService.responseError(response);
		 	}
		 });
	}
	$scope.viewUserDetails();

	$scope.submitEditProfile = function(data){
		 var submitData = {
		 	user_id:parseInt($stateParams.user_id),
		 	first_name:data.user_first_name,
		 	last_name:data.user_last_name,
		 	phone:data.user_phone_no,
	//	 	password:data.user_first_name,
	//	 	confirm_password:data.user_first_name,
		 	zipcode:data.user_zipcode,
		 	status:data.user_status
		}
		dataService.putData(submitData,baseUrl + 'warehouse/edit-master-admin')
		 .success(function(response){
		 	if(response.status == true){
		 		$scope.userData = response.data;
		 		$state.go('app.administrator.master-admin');
		 	}else{
		 		dataService.responseError(response);
		 	}
		 });
	}
	
});

