'use strict';

app
  .controller('ActivityCtrl', function ($scope, $mdDialog, $http, $rootScope, $cookies, arrayPushService,toaster,baseURL,$location,errorHandler,$timeout, DTOptionsBuilder, DTColumnDefBuilder,appConstants,activitiesSvc,$sce,utilitySvc) {
    $scope.page = {
		title: appConstants.activitiesTitle
    };
	$scope.date = new Date();

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }

    $scope.getFacilityList = function(){
        activitiesSvc.getFacilityList(appConstants.facilitylist,appConstants.getMethod,{},{},function (succResponse) {
            if(succResponse.status){
                $scope.facility = succResponse.data.data;
                if(utilitySvc.getCurrentFacility() != ''){
                    $rootScope.facility_id = parseInt( utilitySvc.getCurrentFacility() );
                    $rootScope.facility_disable = true;
                    $scope.eventFetch();
                }
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
		        
		if($scope.time){
            var d = new Date($scope.time); console.log(d);
            //var t = d.setHours(00,00,00,0000); console.log(t); return false;
            var time = Date.UTC(d.getUTCFullYear(),(d.getUTCMonth()),(d.getUTCDate()+1)); console.log(time);
            //time.setHours(00,00,00);
            time = time/1000;
            params += '&time=' + time;
        }else{
            params += '&time=' + appConstants.null;
        }
		params += "&limit=1000&pageNo=1&searchValue=";
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
    var setEvent = setInterval(function(){ 
        //console.log($location.path());
        if($location.path() != '/app/admin/activity'){
            clearTimeout(setEvent);
            return false;
        }
        $scope.eventFetch();
    }, 30000);
    

	$scope.dtOptions = DTOptionsBuilder.newOptions().withBootstrap().withOption('order', [3, 'desc']);
	$scope.dtColumnDefs = [
		DTColumnDefBuilder.newColumnDef(0),
		DTColumnDefBuilder.newColumnDef(1),
		DTColumnDefBuilder.newColumnDef(2),
		DTColumnDefBuilder.newColumnDef(3),
		DTColumnDefBuilder.newColumnDef(4).notSortable()
	];

    $scope.mediafile = 'images/avatar.jpg';
    $scope.mediatype = 'jpeg';
    $scope.viewActivity = function(device_id,mediafile,event_id){
        var url = appConstants.geteventmediaurl + '?device_id='+device_id+'&media_file='+mediafile+'&event_id='+event_id;
        activitiesSvc.viewActivity(url ,appConstants.getMethod,{},{},function (succResponse) {
            // succResponse = {
            //     "status":true,
            //     "msg":"success",
            //     "data":{
            //         "fileType":"wav",	"url":"https://s3-us-west-2.amazonaws.com/elika-v2-devices/ELIKA/voice_msg/recorded/voice_message_2147483647_1500033482.wav"
            //     },
            //     "error":null
            // };

            if(succResponse.status){
                if(succResponse.data != null){
                    $scope.mediafile = (succResponse.data.url != null || succResponse.data.url != "") ? succResponse.data.url:'images/avatar.jpg';
                    $scope.mediatype = succResponse.data.fileType;
                }
            }
        });
    }
   
});
