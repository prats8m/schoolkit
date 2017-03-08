'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:DoorCtrl
 * @description
 * # DoorCtrl
 * Controller of the minovateApp
 */
app
  .controller('DoorCtrl', function ($scope, $mdDialog, $http, $rootScope, baseURL, $cookies, toaster, arrayPushService, $timeout) {
     $scope.page = {
      title: 'Doors',
      subtitle: 'So much more to see at a glance.'
    };
	$rootScope.addDoors = {};
	$scope.hideLoadMore = false;
	
	$rootScope.facilityId = $cookies.get('facilityId');
	
	$scope.result = '';
    $scope.showConfirm = function(ev, door_id) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete Door?')
		.content('')
		.ok('Delete')
		.cancel('Cancel')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			//Code to delete door
			$http(
			{
				method: 'DELETE', 
				url: baseURL + 'door/delete/'+door_id,
				dataType : 'JSON', 
				headers: {
					"Content-type": "application/json",
					"Authorization": $cookies.get("token")
				}
			})
			.success(function(response){
				if(response.status == true){
					toaster.pop('success','Your Door has been deleted successfully.');
				
					var adoor = $scope.adoors;
					var tempUser = [];
					for(var i=0;i<adoor.length;i++){
						if(door_id != adoor[i].door_id){
							tempUser.push(adoor[i]);
						}
					}
					$scope.adoors = tempUser;
					$rootScope.dashboardData.door--;
				}else{	
					if(response.msg == 'Invalid_Token'){
						toaster.pop('error','Session Expired');
						$cookies.remove("token");
						$location.path('/core/login');
					}
					toaster.pop('error',response.msg.replace(/_/g,' '));
				}
			}).error(function(){

			});
			
			//Code end to delete door
		}, function() {
			$scope.result = 'You decided to keep Door.';
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
	
	$scope.pageNo = 1;
	$scope.searchText = '';
	
	$scope.facilityInit = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL+'facility/list',
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$rootScope.facilityList = response.data.data;
				$rootScope.addDoors.facility_id = parseInt($cookies.get('facilityId'));	
			}else{
				
			}
		}).error(function(){

		});
	}
	$scope.facilityInit();
	
	$rootScope.submitAddDoor = function(submitData){
		//alert();
		$http(
		{
			method: 'POST', 
			url: baseURL+'door/add',
			dataType : 'JSON', 
			data : submitData, 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				toaster.pop('success','Door added successfully.');
				$scope.pageNo = 1;
				$scope.listDoors();
				$rootScope.dashboardData.door++; 
			}else{
				toaster.pop('error',response.msg.replace(/_/g,' '));
			}
		}).error(function(){

		});
	}
	
	$scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }
	
	$scope.dashboardInit = function(){
		$http({
			url: baseURL + 'user/dashboard',
			method: 'GET',
			dataType : 'JSON',
			headers: {
				"Authorization": $cookies.get("token"),
				"Content-type": "application/json"
			}
		})
		.success(function(response) {
			if(response.status == true){
				$rootScope.dashboardData = response.data;
				// console.log($rootScope.dashboardData);
			}
		})
		.error(function (data, status, headers, config) {
			
		});
	}
		$scope.dashboardInit();


	//Create Doors
	$rootScope.doormsg = "";
	$rootScope.createDoor = function(door, create_door){
		if(!create_door.validate()){
			return false;
		}
		//door.facility_id = parseInt($cookies.get("facilityId"));
		door.description = " ";
		$http({
			url: baseURL + 'door/add',
			method: 'POST',
			dataType : 'JSON',
			data: door,
			headers: {
				"Authorization": $cookies.get("token"),
				"Content-type": "application/json"
			}
		})
		.success(function(response) {
			if(response.status == true){

				toaster.pop('success','Door added successfully.');
				$scope.pageNo = 1;
				$scope.listDoors();
				$rootScope.dashboardData.door++;
				$timeout(function() {
					$("#close").click();
				});
			}else{
				toaster.pop('error',response.msg.replace(/_/g,' '));
			}
		})
		.error(function (data, status, headers, config) {
		});
	}
		//End of create door

		//Search Door
		$scope.searchFunction = function(e){
		if(e)
		if(e.keyCode!=13){return false;}
		if(!$scope.searchText){
			$scope.searchText = '';
		}
		$scope.pageNo = 1;
		$scope.users =[];
		
		$http(
		{
			method: 'GET', 
			url: baseURL + 'door/list?limit=8&pageNo='+$scope.pageNo+'&searchVal='+$scope.searchText,
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$scope.adoors = response.data.data;
				$scope.pageNo = $scope.pageNo + 1 ;
			}else{
				if(response.msg == 'Invalid_Token'){
					toaster.pop('error','Session Expired');
					$cookies.remove("token");
					$location.path('/core/login');
				}
				$scope.adoors = [];
			}
		}).error(function(){

		});	
	}

		//End of search door

		//List Doors
		$scope.pageNo = 1;
		$scope.searchText = '';
		$scope.adoors = [];
		$scope.listDoors = function(){
			$http({
				url: baseURL + 'door/list?limit=8&pageNo='+$scope.pageNo,
				method: 'GET',
				dataType : 'JSON',
				headers: {
					"Authorization": $cookies.get("token"),
					"Content-type": "application/json"
				}
			})
			.success(function(response) {
				if(response.status == true){
					if($scope.pageNo != 1){
						$scope.adoors = arrayPushService.arrayPush(response.data.data,  $scope.adoors);
					}else{
						$scope.adoors = response.data.data;
					}
					if(response.data.data.length < 8){$scope.hideLoadMore = true;}else{$scope.hideLoadMore = false;}
					$scope.pageNo = $scope.pageNo + 1 ;
				}else{
					$rootScope.doormsg = response.msg;
				}
			})
			.error(function (data, status, headers, config) {
				
		});
		}
		$scope.listDoors();
		//End of list doors
		
		$scope.facilityInit = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL+'facility/list',
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$rootScope.facilityList = response.data.data;
				/* for(var i=0;i<facilityList.length;i++){
					if(parseInt(facilityList[i].facility_id) == parseInt($cookies.get('facilityId')))
						$rootScope.FacilityName = facilityList[i].facility_name;
				} */	
			}else{
				
			}
		}).error(function(){

		});
	}
	$scope.facilityInit();

	$scope.imagePath = 'http://localhost/elika/elika/images';
	
});

'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:ViewDoorCtrl
 * @description
 * # ViewDoorCtrl
 * Controller of the minovateApp
 */
app
  .controller('ViewDoorCtrl', function ($scope,$http,$cookies, $stateParams, baseURL, $rootScope,$location,toaster,$timeout, $mdDialog) {
     $scope.page = {
      title: 'Doors Details',
      subtitle: 'So much more to see at a glance.'
    };
	
	$scope.imagePath = 'http://localhost:8080/elika/images';
	// $scope.doorData = {};
	// $scope.doorData.door_status = 1;
	$scope.doorInit = function(){
		$http({
			url: baseURL + 'door/view?doorId='+$stateParams.door_id,
				method: 'GET',
				dataType : 'JSON',
				headers: {
					"Authorization": $cookies.get("token"),
					"Content-type": "application/json" 
				}
		})
		.success(function(response){
			$scope.doorData = response.data;
			$scope.facilityInit();
		})
	}	

	$scope.doorInit();

	$scope.facilityInit = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL+'facility/list',
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$scope.facilityList = response.data.data;
				$scope.doorData.facility_id = parseInt($cookies.get('facilityId'));	
			}else{
				
			}
		}).error(function(){

		});
	}

	$scope.editDoordata = function(doorData, door_data){
		doorData.facility_id = doorData.facility.facility_id;
		delete doorData.facility;
		$http(
		{
			method: 'PUT', 
			url: baseURL+'door/edit',
			dataType : 'JSON', 
			data: doorData,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			toaster.pop('success',response.msg.replace(/_/g," "));
		})
	}

	$scope.result = '';
    $scope.showConfirm = function(ev, door_id) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete Door?')
		.content('')
		.ok('Delete')
		.cancel('Cancel')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			//Code to delete door
			$http(
			{
				method: 'DELETE', 
				url: baseURL + 'door/delete/'+door_id,
				dataType : 'JSON', 
				headers: {
					"Content-type": "application/json",
					"Authorization": $cookies.get("token")
				}
			})
			.success(function(response){
				if(response.status == true){
					$rootScope.dashboardData.door--;
					$location.path('/app/admin/door/doors');
				}else{	
					if(response.msg == 'Invalid_Token'){
						toaster.pop('error','Session Expired');
						$cookies.remove("token");
						$location.path('/core/login');
					}
					toaster.pop('error',response.msg.replace(/_/g,' '));
				}
			}).error(function(){

			});
			//Code end to delete door

			
		}, function() {
			$scope.result = 'You decided to keep Door.';
			$scope.statusclass = 'alert alert-success alert-dismissable';
		});
    };

	if($stateParams.type == "edit"){
		$timeout(function() {
			$("a:contains('Edit Door')").click();
		});
	}
	
	$scope.dashboardInit = function(){
		$http({
			url: baseURL + 'user/dashboard',
			method: 'GET',
			dataType : 'JSON',
			headers: {
				"Authorization": $cookies.get("token"),
				"Content-type": "application/json"
			}
		})
		.success(function(response) {
			if(response.status == true){
				$rootScope.dashboardData = response.data;
			}
		})
		.error(function (data, status, headers, config) {
			
		});
	}
		$scope.dashboardInit();
	
	
});

app
  .controller('EditDoorCtrl', function ($scope,$http,$cookies, $stateParams, baseURL, $rootScope,$location,toaster,$timeout, $mdDialog) {
		$scope.page = {
			title: 'Edit Door',
		};
	
	$scope.imagePath = 'http://localhost:8080/elika/images';
	
	$scope.facilityInit = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL+'facility/list',
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$rootScope.facilityList = response.data.data;
				$rootScope.addDoors.facility_id = parseInt($cookies.get('facilityId'));	
			}else{
				
			}
		}).error(function(){

		});
	}
	
	$scope.showConfirm = function(ev, door_id) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete Door?')
		.content('')
		.ok('Delete')
		.cancel('Cancel')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			//Code to delete door
			$http(
			{
				method: 'DELETE', 
				url: baseURL + 'door/delete/'+door_id,
				dataType : 'JSON', 
				headers: {
					"Content-type": "application/json",
					"Authorization": $cookies.get("token")
				}
			})
			.success(function(response){
				if(response.status == true){
					$rootScope.dashboardData.door--;
					$location.path('/app/admin/door/doors');
				}else{	
					if(response.msg == 'Invalid_Token'){
						toaster.pop('error','Session Expired');
						$cookies.remove("token");
						$location.path('/core/login');
					}
					toaster.pop('error',response.msg.replace(/_/g,' '));
				}
			}).error(function(){

			});
			//Code end to delete door
		}, function() {
			$scope.result = 'You decided to keep Door.';
			$scope.statusclass = 'alert alert-success alert-dismissable';
		});
    };
	
	$scope.doorInit = function(){
		$http({
			url: baseURL + 'door/view?doorId='+$stateParams.door_id,
			method: 'GET',
			dataType : 'JSON',
			headers: {
				"Authorization": $cookies.get("token"),
				"Content-type": "application/json" 
			}
		})
		.success(function(response){
			$scope.doorData = response.data;
			$scope.facilityInit();
		})
	}	

	$scope.doorInit();
	
	$scope.editDoordata = function(doorData, door_data){
		if(!door_data.validate()){
			return false;
		}		
		doorData.facility_id = parseInt(doorData.facility_id );
		delete doorData.facility;
		$http(
		{	
			method: 'PUT', 
			url: baseURL+'door/edit',
			dataType : 'JSON', 
			data: doorData,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			toaster.pop('success',response.msg.replace(/_/g," "));
		})
	}
	
	$scope.dashboardInit = function(){
		$http({
			url: baseURL + 'user/dashboard',
			method: 'GET',
			dataType : 'JSON',
			headers: {
				"Authorization": $cookies.get("token"),
				"Content-type": "application/json"
			}
		})
		.success(function(response) {
			if(response.status == true){
				$rootScope.dashboardData = response.data;
				// console.log($rootScope.dashboardData);
			}
		})
		.error(function (data, status, headers, config) {
			
		});
	}
		$scope.dashboardInit();
  });

