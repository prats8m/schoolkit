app
  .controller('ActivityCtrl', function ($scope, $mdDialog, $http, $rootScope, $cookies, arrayPushService,toaster,baseURL,$location,errorHandler,$timeout, DTOptionsBuilder, DTColumnDefBuilder,appConstants,activitiesSvc) {
    $scope.page = {
		title: appConstants.activitiesTitle
    };

    $scope.getFacilityList = function(){
        activitiesSvc.getFacilityList(appConstants.facilitylist,appConstants.getMethod,{},{},function (succResponse) {
            if(succResponse.status){
                $scope.facility = succResponse.data.data;
            }
        });
	};
	$scope.getFacilityList();

    $scope.getDeviceList = function(){
        if(!$scope.facility_id){$scope.devices = [];return false;}
        activitiesSvc.getDeviceList(appConstants.devicelistmaster+'?facilityId='+$scope.facility_id,appConstants.getMethod,{},{},function (succResponse) {
            $scope.devices = [];
        	if(succResponse.status){
                $scope.devices = succResponse.data.data;
                $scope.eventFetch();
            }
        });
	};

	$scope.getEventTypeList = function(){
        activitiesSvc.getEventTypeList(appConstants.listeventtype,appConstants.getMethod,{},{},function (succResponse) {
        	if(succResponse.status){
                var event_type = succResponse.data;
                var tmp = [];
                for (var x in event_type) {
                    tmp.push({event_name:x,event_id:event_type[x]});
                }
                //console.log(tmp);
                $scope.event_types = tmp;
            }
            else {
                $scope.devices = [];
            }
        });
	};
	$scope.getEventTypeList();


	$scope.eventFetch = function(){
		var params = appConstants.questionMark;
		if($scope.facility_id){params += 'facility_id='+$scope.facility_id;}else{params += 'facility_id='+appConstants.null;}
		if($scope.device_id){params += '&door_id='+$scope.device_id;}else{params += '&door_id='+appConstants.null;}
		if($scope.event_id){params += '&event_id='+$scope.event_id;}else{params += '&event_id='+appConstants.null;}
		params += "&limit=100&pageNo=1&searchVlaue=";
        activitiesSvc.eventFetch(appConstants.listevent + params,appConstants.getMethod,{},{},function (succResponse) {
        //activitiesSvc.eventFetch('event/list-event?facility_id=null&door_id=null&event_id=null&limit=5&pageNo=1&searchVlaue=',appConstants.getMethod,{},{},function (succResponse) {
            $scope.activities = [];
            if(succResponse.status){
                $scope.activities = succResponse.data.data;
            }
        });
	};
	
	$scope.dashboardInit = function(){
        activitiesSvc.dashboardInit(appConstants.userDashboard,appConstants.getMethod,{},{},function (succResponse) {
            if(succResponse.status){
                $rootScope.dashboardData = succResponse.data;
            }
        });
	};
	$scope.dashboardInit();

	$scope.eventFetch();
		$scope.dtOptions = DTOptionsBuilder.newOptions().withBootstrap();
		$scope.dtColumnDefs = [
			DTColumnDefBuilder.newColumnDef(0),
			DTColumnDefBuilder.newColumnDef(1),
			DTColumnDefBuilder.newColumnDef(2),
			DTColumnDefBuilder.newColumnDef(3),
			DTColumnDefBuilder.newColumnDef(4).notSortable()
		];
});