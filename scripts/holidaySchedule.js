app
    .controller('HolidayScheduleCtrl', function ($scope, toaster, $rootScope, $mdDialog, baseURL, appConstants, HolidayScheduleSvc) {
        $scope.page = {
            title: appConstants._titleHolidaySchedule,
            subtitle: appConstants.dashboardSubTitle
        };

        $scope.pageNo = 1;
        $scope.schedularLimit = appConstants.pageLimit;
        $scope.searchText = appConstants.empty;
        $scope.status = appConstants.empty;

        $scope.showConfirm = function (ev, holidayScheduleId) {
            var confirm = $mdDialog.confirm()
                .title(appConstants._deleteholidayscheduleconfirmationmessage)
                .content(appConstants.content)
                .ok(appConstants.delete)
                .cancel(appConstants.cancel)
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                $scope.deleteHolidaySchedule(holidayScheduleId);
            }, function () {
                $scope.status = appConstants._cancelholidayscheduledeletion;
                $scope.statusclass = appConstants.successstatusClass;
            });
        };

        $scope.deleteHolidaySchedule = function (holidayScheduleId) {
            HolidayScheduleSvc.deleteHolidaySchedule(appConstants.holidayscheduledelete + '?hs_id=' + holidayScheduleId, appConstants.deleteMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    toaster.pop(appConstants.success, appConstants._successdeleteholidayschedule);
                    $scope.getEditHolidayScheduleList();
                }
            });
        };

        $scope.layout = appConstants.gridLayout;
        $scope.class = appConstants.gridviewClass;
        $scope.changeClass = function () {
            if ($scope.class === appConstants.gridviewClass)
                $scope.class = appConstants.listviewClass;
            $scope.layout = appConstants.listLayout;
        };

        $scope.changeaClass = function () {
            if ($scope.class === appConstants.listviewClass)
                $scope.class = appConstants.gridviewClass;
            $scope.layout = appConstants.gridLayout;
        };

        $scope.orderByMe = function (x) {
            $scope.myOrderBy = x;
        };
        $scope.refreshList = function () {
            $scope.searchAlphabet = '';
            $scope.pageNo = 1;
            $(".f-wm:contains(" + appConstants.nomoredataavailable + ")").text('Load More').css("opacity", 1);
            $scope.getHolidayScheduleList();
        }
        $scope.alphabateList = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        $scope.pageNo = 1;
        $scope.searchAlphabet = '';
        $scope.searchByAlphabet = function (alphabet) {
            $scope.searchText = '';
            $scope.lstHolidaySchedular = [];
            $(".f-wm:contains(" + appConstants.nomoredataavailable + ")").text('Load More').css("opacity", 1);
            $scope.pageNo = 1;
            if (alphabet == 'All') {
                $scope.searchAlphabet = '';
                $scope.getHolidayScheduleList();
                return;
            }
            $scope.searchAlphabet = alphabet;
            $scope.getHolidayScheduleList();
        }
        $scope.getHolidayScheduleList = function () {
            HolidayScheduleSvc.getHolidayScheduleList(appConstants.holidayschedulelist + '?limit=' + $scope.schedularLimit + '&pageNo=' + $scope.pageNo + '&search_val=' + $scope.searchText + '&albhabet=' + $scope.searchAlphabet, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    if ($scope.pageNo == 1)
                        $scope.lstHolidaySchedular = [];
                    angular.forEach(succResponse.data.data, function (holidayschedule, index) {
                        $scope.lstHolidaySchedular.push(holidayschedule);
                    });
                    $scope.pageNo = $scope.pageNo + 1;
                    $scope.count = succResponse.data.count;
                } else {
                    if (succResponse.msg == 'No_Records_Found') {
                        $scope.lstHolidaySchedular = [];
                        $scope.manageHolidayScheduleListLoadMoreButton(0);
                        $scope.status = succResponse.msg.replace(/_/g, ' ');;
                        $scope.statusclass = appConstants.error;
                    }
                }
            });
        };
        $scope.getHolidayScheduleList();


        $scope.getEditHolidayScheduleList = function () {
            $scope.pageNo = 1;
            HolidayScheduleSvc.getHolidayScheduleList(appConstants.holidayschedulelist + '?limit=' + $scope.schedularLimit + '&pageNo=' + $scope.pageNo + '&search_val=' + $scope.searchText + '&albhabet=' + $scope.searchAlphabet, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    if ($scope.pageNo == 1)
                        $scope.lstHolidaySchedular = [];
                    angular.forEach(succResponse.data.data, function (holidayschedule, index) {
                        $scope.lstHolidaySchedular.push(holidayschedule);
                    });
                    $scope.pageNo = $scope.pageNo + 1;
                    $scope.count = succResponse.data.count;
                } else {
                    if (succResponse.msg == 'No_Records_Found') {
                        $scope.lstHolidaySchedular = [];
                        $scope.manageHolidayScheduleListLoadMoreButton(0);
                        $scope.status = succResponse.msg.replace(/_/g, ' ');;
                        $scope.statusclass = appConstants.error;
                    }
                }
            });
        };

        $scope.getDateTime = function (date, time) {
            if (!date) {
                debugger;
            }
            console.log(date);
            console.log(time);
            $scope.datetimeStr = date + ' ' + time;
            return $scope.datetimeStr;
        }
        $scope.manageHolidayScheduleListLoadMoreButton = function (count) {
            if (count < $scope.schedularLimit) {
                $scope.lmbtn = {
                    display: appConstants.none
                };
            }
            else {
                $scope.lmbtn = {
                    display: appConstants.block
                };
            }
        };

        $scope.loadMoreScheduleList = function () {
            $scope.pageNo++;
            $scope.getHolidayScheduleList();
        };

        /* $scope.dashboardInit = function () {
            HolidayScheduleSvc.dashboardInit(appConstants.userDashboard, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.dashboardData = succResponse.data;
                }
                $scope.getHolidayScheduleList();
            });
        }; 
        $scope.dashboardInit(); */

        $scope.imagePath = baseURL + appConstants.imagePath;

    })

    .controller('ViewHolidayScheduleCtrl', function ($scope, $rootScope, $mdDialog, baseURL, appConstants, HolidayScheduleSvc, $stateParams) {
        $scope.page = {
            title: appConstants._titleHolidaySchedule,
            subtitle: appConstants.dashboardSubTitle
        };

        $scope.getSelectedHolidayScheduleDetail = function () {
            HolidayScheduleSvc.getSelectedHolidayScheduleDetail(appConstants.holidayscheduleview + '?hs_id=' + $stateParams.hs_id, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.holidayScheduleDetails = succResponse.data;
                }
            });
        };
        $scope.getSelectedHolidayScheduleDetail();
        /* $scope.dashboardInit = function () {
            HolidayScheduleSvc.dashboardInit(appConstants.userDashboard, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.dashboardData = succResponse.data;
                }
                $scope.getSelectedHolidayScheduleDetail();
            });
        };
        $scope.dashboardInit(); */

    })


    //.....Add Holiday Schedular Modal..............................

    .controller('addHolidaySchedularCTRL', function ($scope, $uibModal, $log, $mdDialog, baseURL, appConstants, HolidayScheduleSvc, toaster) {

        $scope.open = function () {
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
                HolidayScheduleSvc.addEditHolidaySchedule(appConstants.holidayscheduleadd, appConstants.postMethod, {}, selectedItem, function (succResponse) {
                    if (succResponse.status) {
                        toaster.pop(appConstants.success, appConstants._successholidayscheduleadded);
                        $scope.$parent.pageNo = 1;
                        $scope.$parent.getHolidayScheduleList();
                    }
                })
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    })


    .controller('AddHolidaySchedularModalInstanceCtrl', function ($scope, $uibModalInstance, items, appConstants, utilitySvc, toaster) {
        $scope.starttimedropdown = appConstants.timedropdown;
        $scope.endtimedropdown = appConstants.timedropdown;
        //$scope.addHolidayScheduleObj = items;  // we are returning items as null
        var today = new Date();
        $scope.addHolidayScheduleObj = {
            hs_name: null,
            //   hs_start_date:today ,
            //  hs_end_date:today,
            hs_status: '1',
            //   hs_expiration:today,

            hs_starttime: null,
            hs_endtime: null
        };

        $scope.checktimediff = function(form){
            var start_date = $scope.addHolidayScheduleObj.hs_start_date;
            var end_date = $scope.addHolidayScheduleObj.hs_end_date;
            $scope.addHolidayScheduleObj.hs_start_date = parseInt(utilitySvc.convertDateToMilliecondTimeStamp($scope.addHolidayScheduleObj.hs_start_date, $scope.addHolidayScheduleObj.hs_starttime) / 1000);
            $scope.addHolidayScheduleObj.hs_end_date = parseInt(utilitySvc.convertDateToMilliecondTimeStamp($scope.addHolidayScheduleObj.hs_end_date, $scope.addHolidayScheduleObj.hs_endtime) / 1000);
            $scope.addHolidayScheduleObj.hs_expiration = utilitySvc.convertDateToMilliecondTimeStamp($scope.addHolidayScheduleObj.hs_expiration) / 1000;
            $scope.addHolidayScheduleObj.hs_status = parseInt($scope.addHolidayScheduleObj.hs_status);
            $scope.addHolidayScheduleObj.hs_type = "holiday";
            if($scope.addHolidayScheduleObj.hs_end_date < $scope.addHolidayScheduleObj.hs_start_date){
                toaster.pop(appConstants.error, appConstants._errorholidayvalidatitime);
              $scope.addHolidayScheduleObj.hs_start_date = start_date;
              $scope.addHolidayScheduleObj.hs_end_date = end_date;
                return false;
            }
            $scope.addHolidayScheduleObj.hs_start_date = start_date;
            $scope.addHolidayScheduleObj.hs_end_date = end_date;
        }

        $scope.ok = function (form) {
            if (!form.validate()) {
                return false;
            }
            var start_date = $scope.addHolidayScheduleObj.hs_start_date;
            var end_date = $scope.addHolidayScheduleObj.hs_end_date;
            $scope.addHolidayScheduleObj.hs_start_date = parseInt(utilitySvc.convertDateToMilliecondTimeStamp($scope.addHolidayScheduleObj.hs_start_date, $scope.addHolidayScheduleObj.hs_starttime) / 1000);
            $scope.addHolidayScheduleObj.hs_end_date = parseInt(utilitySvc.convertDateToMilliecondTimeStamp($scope.addHolidayScheduleObj.hs_end_date, $scope.addHolidayScheduleObj.hs_endtime) / 1000);
            $scope.addHolidayScheduleObj.hs_expiration = utilitySvc.convertDateToMilliecondTimeStamp($scope.addHolidayScheduleObj.hs_expiration) / 1000;
            $scope.addHolidayScheduleObj.hs_status = parseInt($scope.addHolidayScheduleObj.hs_status);
            $scope.addHolidayScheduleObj.hs_type = "holiday";
            if($scope.addHolidayScheduleObj.hs_end_date < $scope.addHolidayScheduleObj.hs_start_date){
                $scope.addHolidayScheduleObj.hs_start_date = start_date;
                $scope.addHolidayScheduleObj.hs_end_date = end_date;
                toaster.pop(appConstants.error, appConstants._errorholidayvalidatitime);
                return false;
            }
            delete $scope.addHolidayScheduleObj.hs_starttime;
            delete $scope.addHolidayScheduleObj.hs_endtime;
            delete $scope.addHolidayScheduleObj.hs_expiration;
            $uibModalInstance.close($scope.addHolidayScheduleObj);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })

    //..........................................................................................................



    //.....Edit Holiday Schedular Modal..............................

    .controller('editHolidaySchedularCTRL', function ($scope, $uibModal, $log, $mdDialog, baseURL, appConstants, HolidayScheduleSvc, toaster) {
        $scope.open = function (schedule) {
            var modalInstance = $uibModal.open({
                templateUrl: 'editmyholidaySchedularModalContent.html',
                controller: 'editHolidaySchedularModalInstanceCtrl',
                resolve: {
                    items: function () {
                        return schedule;
                    }
                }
            });
            $scope.temp = true;
            modalInstance.result.then(function (selectedItem) {
                if ($scope.temp) {
                    $scope.temp = false
                    HolidayScheduleSvc.addEditHolidaySchedule(appConstants.holidayscheduleedit, appConstants.putMethod, {}, selectedItem, function (succResponse) {
                        if (succResponse.status) {
                            toaster.pop(appConstants.success, appConstants._successholidayscheduleedited);
                            for (var key in $scope.$parent.lstHolidaySchedular) {
                                if ($scope.$parent.lstHolidaySchedular[key].hs_id == selectedItem.hs_id) {
                                    $scope.$parent.lstHolidaySchedular.splice(key, 1, selectedItem);
                                    break;
                                }
                            }
                            $scope.$parent.getEditHolidayScheduleList();
                            $scope.temp = true;
                        }
                    })
                }
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    })


    .controller('editHolidaySchedularModalInstanceCtrl', function ($scope, $uibModalInstance, items, appConstants, utilitySvc, toaster) {
        $scope.editstarttimedropdown = appConstants.timedropdown;
        $scope.editendtimedropdown = appConstants.timedropdown;

        $scope.editHolidayScheduleObj = {
            hs_id: items.hs_id,
            hs_name: items.hs_name,
            hs_start_date: new Date(items.hs_start_date*1000),
            hs_end_date: new Date(items.hs_end_date*1000),
            hs_status: items.hs_status.toString(),
            // hs_expiration: new Date(items.hs_expiration.date),
            hs_starttime: (new Date(items.hs_start_date*1000).getHours().toString().length == 1 ? "0" : "") + new Date(items.hs_start_date*1000).getHours() + ":" + (new Date(items.hs_start_date*1000).getMinutes().toString().length == 1 ? "0" : "") + new Date(items.hs_start_date*1000).getMinutes(),
            hs_endtime: (new Date(items.hs_end_date*1000).getHours().toString().length == 1 ? "0" : "") + new Date(items.hs_end_date*1000).getHours() + ":" + (new Date(items.hs_end_date*1000).getMinutes().toString().length == 1 ? "0" : "") + new Date(items.hs_end_date*1000).getMinutes()
        };
        $scope.mindate = new Date(items.hs_start_date.date);

        $scope.ok = function () {
            var start_date = $scope.editHolidayScheduleObj.hs_start_date;
            var end_date = $scope.editHolidayScheduleObj.hs_end_date;
            var status = $scope.editHolidayScheduleObj.hs_status;
            $scope.editHolidayScheduleObj.hs_start_date = utilitySvc.convertDateToMilliecondTimeStamp($scope.editHolidayScheduleObj.hs_start_date, $scope.editHolidayScheduleObj.hs_starttime) / 1000;
            $scope.editHolidayScheduleObj.hs_end_date = utilitySvc.convertDateToMilliecondTimeStamp($scope.editHolidayScheduleObj.hs_end_date, $scope.editHolidayScheduleObj.hs_endtime) / 1000;
            $scope.editHolidayScheduleObj.hs_expiration = utilitySvc.convertDateToMilliecondTimeStamp($scope.editHolidayScheduleObj.hs_expiration) / 1000;
            $scope.editHolidayScheduleObj.hs_status = parseInt($scope.editHolidayScheduleObj.hs_status);
            $scope.editHolidayScheduleObj.hs_type = "holiday";
            if($scope.editHolidayScheduleObj.hs_end_date < $scope.editHolidayScheduleObj.hs_start_date){
                $scope.editHolidayScheduleObj.hs_start_date = start_date;
                $scope.editHolidayScheduleObj.hs_end_date = end_date;
                $scope.editHolidayScheduleObj.hs_status = status;
                toaster.pop(appConstants.error, appConstants._errorholidayvalidatitime);
                return false;
            }
            delete $scope.editHolidayScheduleObj.hs_starttime;
            delete $scope.editHolidayScheduleObj.hs_endtime;
            $uibModalInstance.close($scope.editHolidayScheduleObj);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });