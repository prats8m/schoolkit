app
  .controller('ActivityCtrl', function ($scope, $mdDialog, $http, $rootScope, $cookies, arrayPushService,toaster,baseURL,$location,errorHandler,$timeout, DTOptionsBuilder, DTColumnDefBuilder,dataService) {
    $scope.page = {
		title: 'Activity',
    };
	
	/*$scope.activities = [{
      datetime: '10:10:42 AM EST',
	  user: 'Jhone',
	  event: 'abc',
	  facility: 'USA Services Corporate',
	  door: 'Front Gate',
	  device: 'Elika-76',
    },{
      datetime: '10:09:22 AM EST',
	  user: 'Karley',
	  event: 'holiday',
	  facility: 'USA Cloud Firm',
	  door: 'Pool Gate',
	  device: 'Elika-2101',
    },{
      datetime: '09:55:22 PM EST',
	  user: 'bob',
	  event: 'wowjoe',
	  facility: 'USA Cloud Firm',
	  door: 'Parking Gate',
	  device: 'Elika-2101',
    },{
      datetime: '09:40:42 AM EST',
	  user: 'John',
	  event: 'abc event',
	  facility: 'USA Services Corporate',
	  door: 'Front Gate',
	  device: 'Elika-76',
    },{
      datetime: '09:32:12 AM EST',
	  user: 'Karley',
	  event: 'holiday meet',
	  facility: 'USA Cloud Firm',
	  door: 'Pool Gate',
	  device: 'Elika-2101',
    },{
      datetime: '08:35:52 PM EST',
	  user: 'bob',
	  event: 'wowenjoy',
	  facility: 'USA Cloud Firm',
	  door: 'Parking Gate',
	  device: 'Elika-2101',
    },{
      datetime: '10:10:32 AM EST',
	  user: 'Jhone',
	  event: 'abc',
	  facility: 'USA Services Corporate',
	  door: 'Front Gate',
	  device: 'Elika-76',
    },{
      datetime: '10:09:02 AM EST',
	  user: 'Karley',
	  event: 'holiday',
	  facility: 'USA Cloud Firm',
	  door: 'Pool Gate',
	  device: 'Elika-2101',
    },{
      datetime: '09:55:22 PM EST',
	  user: 'bob',
	  event: 'wowjoe',
	  facility: 'USA Cloud Firm',
	  door: 'Parking Gate',
	  device: 'Elika-2101',
    },{
      datetime: '09:40:12 AM EST',
	  user: 'John',
	  event: 'abc event',
	  facility: 'USA Services Corporate',
	  door: 'Front Gate',
	  device: 'Elika-76',
    },{
      datetime: '09:32:42 AM EST',
	  user: 'Karley',
	  event: 'holiday meet',
	  facility: 'USA Cloud Firm',
	  door: 'Pool Gate',
	  device: 'Elika-2101',
    },{
      datetime: '08:35:02 PM EST',
	  user: 'bob',
	  event: 'wowenjoy',
	  facility: 'USA Cloud Firm',
	  door: 'Parking Gate',
	  device: 'Elika-2101',
    }];
*/
    $scope.getFacilityList = function(){

		dataService.getData(null,baseURL + "facility/list")
		.success(function(response) {
			if(response.status == true){
				$scope.facility = response.data.data;
			}else{
				dataService.responseError(response);
			}
		});
	}
	$scope.getFacilityList();
	

    $scope.getDeviceList = function(){

    	if(!$scope.facility_id){$scope.devices = [];return false;}
		dataService.getData(null,baseURL + "device/list-master-device?facilityId="+$scope.facility_id)
		.success(function(response) {
			if(response.status == true){
				$scope.devices = response.data.data;
				$scope.eventFetch();	
			}else{
				$scope.devices = [];
				dataService.responseError(response);
			}
		});
	}

	$scope.getEventTypeList = function(){

		dataService.getData(null,baseURL + "event/list-event-type")
		.success(function(response) {
			if(response.status == true){
				var event_type = response.data;
				var tmp = [];
				for (var x in event_type) {
        	tmp.push({event_name:x,event_id:event_type[x]});
    		}
				console.log(tmp);
				$scope.event_types = tmp;
			}else{
				$scope.devices = [];
				dataService.responseError(response);
			}
		});
	}
	$scope.getEventTypeList();

	$scope.eventFetch = function(){
		// var requestData = {facility_id:$scope.facility_id,event_id:null,facility_id:null};
		var params = '?';
		if($scope.facility_id){params += 'facility_id='+$scope.facility_id;}else{params += 'facility_id=null';}
		if($scope.device_id){params += '&device_id='+$scope.device_id;}else{params += '&device_id=null';}
		if($scope.event_id){params += '&event_id='+$scope.event_id;}else{params += '&event_id=null';}

	dataService.getData(null,baseURL + "event/list-event" + params)
//	dataService.getData(null,baseURL + "event/list-event" + "?facility_id=null&device_id=null&event_id=null")
	.success(function(response) {
		if(response.status == true){
			$scope.activities = response.data.data;	
			console.log($scope.activities);			
		}else{
			$scope.activities = [];
			dataService.responseError(response);
		}
	});
}
$scope.eventFetch();
				$scope.dtOptions = DTOptionsBuilder.newOptions().withBootstrap();
				$scope.dtColumnDefs = [
					DTColumnDefBuilder.newColumnDef(0),
					DTColumnDefBuilder.newColumnDef(1),
					DTColumnDefBuilder.newColumnDef(2),
					DTColumnDefBuilder.newColumnDef(3),
					DTColumnDefBuilder.newColumnDef(4),
					DTColumnDefBuilder.newColumnDef(5),
					DTColumnDefBuilder.newColumnDef(6).notSortable()
				];
	
	
});