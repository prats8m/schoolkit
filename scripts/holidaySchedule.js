app
    .controller('HolidayScheduleCtrl', function ($scope,toaster,$rootScope,$mdDialog,baseURL,appConstants,HolidayScheduleSvc) {
        $scope.page = {
            title: appConstants._titleHolidaySchedule,
            subtitle: appConstants.dashboardSubTitle
        };

        $scope.pageNo=1;
        $scope.schedularLimit=8;
        $scope.searchText = appConstants.empty;
        $scope.status = appConstants.empty;

        $scope.showConfirm = function(ev,holidayScheduleId) {
            var confirm = $mdDialog.confirm()
                .title(appConstants._deleteholidayscheduleconfirmationmessage)
                .content(appConstants.content)
                .ok(appConstants.delete)
                .cancel(appConstants.cancel)
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function() {
                $scope.deleteHolidaySchedule(holidayScheduleId);
            }, function() {
                $scope.status = appConstants._cancelholidayscheduledeletion;
                $scope.statusclass = appConstants.successstatusClass;
            });
        };

        $scope.deleteHolidaySchedule=function (holidayScheduleId) {
            HolidayScheduleSvc.deleteHolidaySchedule(appConstants.holidayscheduledelete+'?hs_id='+holidayScheduleId,appConstants.deleteMethod,{},{},function (succResponse) {
                if(succResponse.status){
                    toaster.pop(appConstants.success,appConstants._successdeleteholidayschedule);
                    $scope.getHolidayScheduleList();
                }
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
            HolidayScheduleSvc.getHolidayScheduleList(appConstants.holidayschedulelist+'?limit='+$scope.schedularLimit+'&pageNo='+$scope.pageNo+'&search_val='+$scope.searchText,appConstants.getMethod,{},{},function (succResponse) {
                if(succResponse.status){
                    if($scope.pageNo==1) {
                        $scope.lstHolidaySchedular = [];
                        angular.forEach(succResponse.data, function (holidayschedule, index) {
                            $scope.lstHolidaySchedular.push(holidayschedule);
                        });
                    }
                    else{
                        $scope.lstHolidaySchedular=$scope.lstHolidaySchedular.concat(succResponse.data);
                    }
                    $scope.manageHolidayScheduleListLoadMoreButton(succResponse.data.length);
                }else {
                    if(succResponse.msg=='No_Record_Found'){
                        $scope.lstHolidaySchedular = [];
                        $scope.manageHolidayScheduleListLoadMoreButton(0);
                        $scope.status=succResponse.msg.replace(/_/g, ' ');;
                        $scope.statusclass = appConstants.error;
                    }
                }
            });
        };

        $scope.manageHolidayScheduleListLoadMoreButton=function (count) {
            if (count<$scope.schedularLimit){
                $scope.lmbtn = {
                    display : appConstants.none
                };
            }
            else {
                $scope.lmbtn = {
                    display : appConstants.block
                };
            }
        };

        $scope.loadMoreScheduleList=function () {
            $scope.pageNo++;
            $scope.getHolidayScheduleList();
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

    .controller('ViewHolidayScheduleCtrl', function ($scope,$rootScope,$mdDialog,baseURL,appConstants,HolidayScheduleSvc,$stateParams) {
        $scope.page = {
            title: appConstants._titleHolidaySchedule,
            subtitle: appConstants.dashboardSubTitle
        };

        $scope.getSelectedHolidayScheduleDetail = function(){
            HolidayScheduleSvc.getSelectedHolidayScheduleDetail(appConstants.holidayscheduleview+'?hs_id='+$stateParams.hs_id,appConstants.getMethod,{},{},function (succResponse) {
                if(succResponse.status){
                    $scope.holidayScheduleDetails=succResponse.data;
                }
            });
        };

        $scope.dashboardInit = function(){
            HolidayScheduleSvc.dashboardInit(appConstants.userDashboard,appConstants.getMethod,{},{},function (succResponse) {
                if(succResponse.status){
                    $rootScope.dashboardData = succResponse.data;
                }
                $scope.getSelectedHolidayScheduleDetail();
            });
        };
        $scope.dashboardInit();

    })


//.....Add Holiday Schedular Modal..............................

    .controller('addHolidaySchedularCTRL', function ($scope,$uibModal,$log, $mdDialog,baseURL,appConstants,HolidayScheduleSvc,toaster) {

        $scope.open = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'myholidaySchedularModalContent.html',
                controller: 'AddHolidaySchedularModalInstanceCtrl',
                resolve: {
                    items: function () {
                        return null;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                HolidayScheduleSvc.addEditHolidaySchedule(appConstants.holidayscheduleadd,appConstants.postMethod,{},selectedItem,function (succResponse) {
                    if(succResponse.status){
                        toaster.pop(appConstants.success,appConstants._successholidayscheduleadded);
                        $scope.$parent.pageNo=1;
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
         //   hs_start_date:today ,
          //  hs_end_date:today,
            hs_status:'1',
         //   hs_expiration:today,

            hs_starttime:null,
            hs_endtime:null
        };

    $scope.ok = function (form) {
        if(!form.validate()){
            return false;
        }
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
})

//..........................................................................................................



//.....Edit Holiday Schedular Modal..............................

.controller('editHolidaySchedularCTRL', function ($scope,$uibModal,$log, $mdDialog,baseURL,appConstants,HolidayScheduleSvc,toaster) {
    $scope.open = function(schedule) {
        var modalInstance = $uibModal.open({
            templateUrl: 'editmyholidaySchedularModalContent.html',
            controller: 'editHolidaySchedularModalInstanceCtrl',
            resolve: {
                items: function () {
                    return schedule;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            HolidayScheduleSvc.addEditHolidaySchedule(appConstants.holidayscheduleedit,appConstants.putMethod,{},selectedItem,function (succResponse) {
                if(succResponse.status){
                    toaster.pop(appConstants.success,appConstants._successholidayscheduleedited);
                    for(var key in $scope.$parent.lstHolidaySchedular){
                        if($scope.$parent.lstHolidaySchedular[key].hs_id==selectedItem.hs_id){
                            $scope.$parent.lstHolidaySchedular.splice(key,1,selectedItem);
                            break;
                        }
                    }
                }
            })
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
})


    .controller('editHolidaySchedularModalInstanceCtrl', function ($scope, $uibModalInstance, items,appConstants,utilitySvc) {
        $scope.editstarttimedropdown=appConstants.timedropdown;
        $scope.editendtimedropdown=appConstants.timedropdown;

        $scope.editHolidayScheduleObj={
            hs_id:items.hs_id,
            hs_name:items.hs_name,
            hs_start_date:new Date(items.hs_start_date.date) ,
            hs_end_date:new Date(items.hs_end_date.date),
            hs_status:items.hs_status.toString(),
            hs_expiration:new Date(items.hs_expiration.date),

            hs_starttime:items.hs_start_date.time,
            hs_endtime:items.hs_end_date.time
        };
		$scope.mindate = new Date(items.hs_start_date.date);

        $scope.ok = function () {
			
            $scope.editHolidayScheduleObj.hs_start_date=utilitySvc.convertDateToMilliecondTimeStamp($scope.editHolidayScheduleObj.hs_start_date,$scope.editHolidayScheduleObj.hs_starttime)/1000;
            $scope.editHolidayScheduleObj.hs_end_date=utilitySvc.convertDateToMilliecondTimeStamp($scope.editHolidayScheduleObj.hs_end_date,$scope.editHolidayScheduleObj.hs_endtime)/1000;
            $scope.editHolidayScheduleObj.hs_expiration=utilitySvc.convertDateToMilliecondTimeStamp($scope.editHolidayScheduleObj.hs_expiration)/1000;
            $scope.editHolidayScheduleObj.hs_status=parseInt($scope.editHolidayScheduleObj.hs_status);

            delete $scope.editHolidayScheduleObj.hs_starttime;
            delete $scope.editHolidayScheduleObj.hs_endtime;
            $uibModalInstance.close($scope.editHolidayScheduleObj);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });