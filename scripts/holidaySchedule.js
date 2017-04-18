app
    .controller('HolidayScheduleCtrl', function ($scope,$rootScope,$mdDialog,baseURL,appConstants,HolidayScheduleSvc) {
        $scope.page = {
            title: appConstants._titleHolidaySchedule,
            subtitle: appConstants.dashboardSubTitle
        };

        $scope.pageNo=0;
        $scope.schedularLimit=8;
        $scope.searchText=appConstants.empty;
        $scope.status = appConstants.empty;
        $scope.lstHolidaySchedular=[];

        $scope.showConfirm = function(ev) {
            var confirm = $mdDialog.confirm()
                .title(appConstants._deleteholidayscheduleconfirmationmessage)
                .content(appConstants.content)
                .ok(appConstants.delete)
                .cancel(appConstants.cancel)
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function() {
                $scope.status = appConstants._successdeleteholidayschedule;
                $scope.statusclass = appConstants.dangerstatusClass;
            }, function() {
                $scope.status = appConstants._cancelholidayscheduledeletion;
                $scope.statusclass = appConstants.successstatusClass;
            });
        };

        $scope.layout = appConstants.gridLayout;
        $scope.class = appConstants.gridviewClass;
        $scope.changeClass = function(){
            if ($scope.class === appConstants.gridviewClass)
                $scope.class = appConstants.listviewClass;
            $scope.layout = appConstants.listLayout;
        };

        $scope.changeaClass = function(){
            if ($scope.class === appConstants.listviewClass)
                $scope.class = appConstants.gridviewClass;
            $scope.layout = appConstants.gridLayout;
        };

        $scope.orderByMe = function(x) {
            $scope.myOrderBy = x;
        };

        $scope.getHolidayScheduleList = function(){
            $scope.pageNo++;
            HolidayScheduleSvc.getHolidayScheduleList(appConstants.holidayschedulelist+'?limit='+$scope.schedularLimit+'&pageNo='+$scope.pageNo+'&search_val='+$scope.searchText,appConstants.getMethod,{},{},function (succResponse) {
                if(succResponse.status){
                    $scope.lstHolidaySchedular=$scope.lstHolidaySchedular.concat(succResponse.data);
                   // $scope.lstHolidaySchedular = succResponse.data;
                }else {
                    if(succResponse.msg=='No_Record_Found'){
                        $scope.lmbtn = {
                            display : appConstants.none
                        };
                    }
                }
            });
        };


        $scope.dashboardInit = function(){
            HolidayScheduleSvc.dashboardInit(appConstants.userDashboard,appConstants.getMethod,{},{},function (succResponse) {
                if(succResponse.status){
                    $rootScope.dashboardData = succResponse.data;
                }
                $scope.getHolidayScheduleList();
            });
        };
        $scope.dashboardInit();

        $scope.imagePath = baseURL+appConstants.imagePath;

    })


//.....Add Holiday Schedular Modal..............................

    .controller('addHolidaySchedularCTRL', function ($scope,$uibModal, $mdDialog,baseURL,appConstants,HolidayScheduleSvc,toaster) {

        $scope.open = function(size) {
            var modalInstance = $uibModal.open({
                templateUrl: 'myholidaySchedularModalContent.html',
                controller: 'AddHolidaySchedularModalInstanceCtrl',
                size:size,
                resolve: {
                    items: function () {
                        return null;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope._contentAddHolidaySchedule = selectedItem;
                HolidayScheduleSvc.addHolidaySchedule(appConstants.holidayscheduleadd,appConstants.postMethod,{},selectedItem,function (succResponse) {
                    if(succResponse.status){
                        toaster.pop(appConstants.success,appConstants._successholidayscheduleadded);
                        $scope.$parent.getHolidayScheduleList();
                    }
                })
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    })


    .controller('AddHolidaySchedularModalInstanceCtrl', function ($scope, $uibModalInstance, items,appConstants,utilitySvc) {
        $scope.starttimedropdown=appConstants.timedropdown;
        $scope.endtimedropdown=appConstants.timedropdown;
        //$scope.addHolidayScheduleObj = items;  // we are returning items as null
        var today=new Date();
        $scope.addHolidayScheduleObj={
            hs_name:null,
            hs_start_date:today ,
            hs_end_date:today,
            hs_status:'1',
            hs_expiration:today,

            hs_starttime:null,
            hs_endtime:null
        };

    $scope.ok = function () {
        $scope.addHolidayScheduleObj.hs_start_date=utilitySvc.convertDateToMilliecondTimeStamp($scope.addHolidayScheduleObj.hs_start_date,$scope.addHolidayScheduleObj.hs_starttime)/1000;
        $scope.addHolidayScheduleObj.hs_end_date=utilitySvc.convertDateToMilliecondTimeStamp($scope.addHolidayScheduleObj.hs_end_date,$scope.addHolidayScheduleObj.hs_endtime)/1000;
        $scope.addHolidayScheduleObj.hs_expiration=utilitySvc.convertDateToMilliecondTimeStamp($scope.addHolidayScheduleObj.hs_expiration)/1000;
        $scope.addHolidayScheduleObj.hs_status=parseInt($scope.addHolidayScheduleObj.hs_status);

        delete $scope.addHolidayScheduleObj.hs_starttime;
        delete $scope.addHolidayScheduleObj.hs_endtime;
        $uibModalInstance.close($scope.addHolidayScheduleObj);
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


});