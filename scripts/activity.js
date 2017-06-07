'use strict';

app
  .controller('ActivityCtrl', function ($scope, $mdDialog, $http, $rootScope, $cookies, arrayPushService,toaster,baseURL,$location,errorHandler,$timeout, DTOptionsBuilder, DTColumnDefBuilder,appConstants,activitiesSvc) {
    $scope.page = {
		title: appConstants.activitiesTitle
    };
	$scope.date = new Date();

    $scope.getFacilityList = function(){
        activitiesSvc.getFacilityList(appConstants.facilitylist,appConstants.getMethod,{},{},function (succResponse) {
            if(succResponse.status){
                $scope.facility = succResponse.data.data;
            }
        });
	};
	$scope.getFacilityList();

    $scope.getDoorsList = function(){
        if(!$scope.facility_id){$scope.doors = [];return false;}
        activitiesSvc.getDoorsList(appConstants.doorlist+'?facilityId='+$scope.facility_id,appConstants.getMethod,{},{},function (succResponse) {
            $scope.doors = [];
        	if(succResponse.status){
                $scope.doors = succResponse.data.data;
                $scope.eventFetch();
            }
        });
	};
	$scope.getDoorsList();

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
                $scope.doors = [];
            }
        });
	};
	$scope.getEventTypeList();


	$scope.eventFetch = function(){
		var params = appConstants.questionMark;
		if($scope.facility_id){params += 'facility_id='+$scope.facility_id;}else{params += 'facility_id='+appConstants.null;}
		if($scope.door_id){params += '&door_id='+$scope.door_id;}else{params += '&door_id='+appConstants.null;}
		if($scope.event_id){params += '&event_id='+$scope.event_id;}else{params += '&event_id='+appConstants.null;}
		//$scope.date = $scope.date/1000;
		//if($scope.date){params += '&date='+$scope.date;}
		params += "&limit=100&pageNo=1&searchValue=";
        activitiesSvc.eventFetch(appConstants.listevent + params,appConstants.getMethod,{},{},function (succResponse) {
        //activitiesSvc.eventFetch('event/list-event?facility_id=null&door_id=null&event_id=null&limit=5&pageNo=1&searchVlaue=',appConstants.getMethod,{},{},function (succResponse) {
            $scope.activities = [];
            if(succResponse.status){
                $scope.activities = succResponse.data.data;
				
            }
			$scope.date = $scope.date;
        });
	};

	$scope.eventFetch();

	$scope.dtOptions = DTOptionsBuilder.newOptions().withBootstrap();
	$scope.dtColumnDefs = [
		DTColumnDefBuilder.newColumnDef(0),
		DTColumnDefBuilder.newColumnDef(1),
		DTColumnDefBuilder.newColumnDef(2),
		DTColumnDefBuilder.newColumnDef(3),
		DTColumnDefBuilder.newColumnDef(4).notSortable()
	];

    $scope.mediafile = 'images/avatar.jpg';
    $scope.mediatype = 'jpeg';
    $scope.viewActivity = function(device_id,mediafile){
        var url = appConstants.geteventmediaurl + '?device_id='+device_id+'&media_file='+mediafile;
        activitiesSvc.viewActivity(url ,appConstants.getMethod,{},{},function (succResponse) {
            if(succResponse.status){
                $scope.mediafile = (succResponse.data != null || succResponse.data != "") ? succResponse.data:'images/avatar.jpg';
                $scope.mediatype = 'jpeg';
            }
        });
    }
});