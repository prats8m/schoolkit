'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:FacilityCtrl
 * @description
 * # FacilityCtrl
 * Controller of the minovateApp
 */
app
    .controller('FacilityCtrl', function ($scope, $mdDialog, $rootScope, toaster, $timeout, baseURL, $uibModal, appConstants, facilitiesSvc, dashboardSvc, utilitySvc, $cookies) {

        $scope.page = {
            title: appConstants.facilityTitle,
            subtitle: appConstants.facilitySubTitle
        };
        $scope.lmbtn = {
            display: appConstants.none
        };

        $rootScope.facility = {};
        $scope.facilities = [];
        $rootScope.facility.status = 1;
        $scope.usTimeZonesForFacility = appConstants.availableTimeZoneOptions;
        $scope.addFacility = function () {
            $rootScope.fac_error = appConstants.empty;
            $scope.facility = {};
            $scope.addFacilityModal = $uibModal.open({
                templateUrl: 'myModalContent.html',
                size: 'md',
                scope: $scope,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
        };

        $rootScope.save = function (facility, addFacility) {
            if (!addFacility.validate()) {
                return false;
            }
            facilitiesSvc.addfacility(appConstants.facilityAdd, appConstants.postMethod, {}, facility, function (succResponse) {
                if (succResponse.status) {
                    toaster.pop(appConstants.success, appConstants._successfacilityAdd);
                    $scope.addFacilityModal.dismiss(appConstants.cancel);
                    $scope.refreshList();
                    $rootScope.fac_error = succResponse.msg.replace(/_/g, " ");
                }
                else {
                    $rootScope.fac_error = succResponse.msg;
                }
            });
        };

        $scope.result = appConstants.empty;
        $scope.showConfirm = function (ev, facilityId) {
            if(facilityId == $cookies.get('current_facility_id')){
                toaster.pop('error',appConstants._switchtootherfacility);
                return false;
            }
            var confirm = $mdDialog.confirm()
                .title(appConstants._deleteFacilityConfirm)
                .content(appConstants.empty)
                .ok(appConstants.delete)
                .cancel(appConstants.cancel)
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                facilitiesSvc.deleteFacility(appConstants.facilitydelete + '?facility_id=' + facilityId, appConstants.deleteMethod, {}, {}, function (succResponse) {
                    if (succResponse.status) {
                        toaster.pop(appConstants.success, appConstants._successDeleteFacility);
                        $scope.refreshList();
                    }
                    else {
                        toaster.pop('info', succResponse.msg);
                        //$scope.result = succResponse.msg;
                        //$scope.statusclass = appConstants.dangerstatusClass;
                    }
                });
            }, function () {
                toaster.pop(appConstants.info, appConstants._cancelFacilityDelete);
            });
        };

        $scope.layout = appConstants.gridLayout;
        $scope.class = appConstants.gridviewClass;
        $scope.changeClass = function () {
            if ($scope.class === appConstants.gridviewClass)
                $scope.class = appConstants.listviewClass;
            $scope.layout = appConstants.listLayout;
        };
        $scope.facilityZipCode = "asdad";
        $scope.changeaClass = function () {
            if ($scope.class === appConstants.listviewClass)
                $scope.class = appConstants.gridviewClass;
            $scope.layout = appConstants.gridLayout;
        };

        $rootScope.search_facility = function (e) {
            if (e)
                if (e.keyCode != 13) { return false; }
            if (!$scope.search) {
                $scope.search = appConstants.empty;
            }
            var current_facility = utilitySvc.getCurrentFacility();
            facilitiesSvc.searchfacility(appConstants.facilitylist, appConstants.getMethod, { limit: 20, page_no: 1, search_val: $scope.search, facility_id: current_facility }, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.facilities = succResponse["data"]["data"] ? succResponse["data"]["data"] : [];
                } else if (succResponse.msg == "No_Records_Found") {
                    $scope.facilities = [];
                }
                else {
                    $scope.facilities = [];
                }
            });
        };
        $scope.refreshList = function () {
            $scope.searchAlphabet = '';
            $scope.pageNo = 1;
            $(".f-wm:contains(" + appConstants.nomoredataavailable + ")").text('Load More').css("opacity", 1);
            $scope.facilityInit();
        }
        $scope.alphabateList = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        $scope.pageNo = 1;
        // $scope.devicePageLimit = 8;
        $scope.searchAlphabet = '';
        $scope.searchByAlphabet = function (alphabet) {
            $scope.searchText = '';
            $(".f-wm:contains(" + appConstants.nomoredataavailable + ")").text('Load More').css("opacity", 1);
            $scope.pageNo = 1;
            if (alphabet == 'All') {
                $scope.searchAlphabet = '';
                $scope.facilityInit();
                return;
            }
            $scope.searchAlphabet = alphabet;
            $scope.facilityInit();
        }
        $scope.facilityInit = function () {
            var current_facility = utilitySvc.getCurrentFacility();
            facilitiesSvc.facility_Init(appConstants.facilitylist, appConstants.getMethod, { limit: 20, page_no: $scope.pageNo, facility_id: current_facility, albhabet: $scope.searchAlphabet }, {}, function (succResponse) {
                if (succResponse.status) {
                    if ($scope.pageNo <= 1)
                        $scope.facilities = [];
                    angular.forEach(succResponse["data"]["data"], function (facility, index) {
                        $scope.facilities.push(facility);
                    });
                    $scope.pageNo = $scope.pageNo + 1;
                    $scope.count = succResponse.data.count
                } else if (succResponse.msg == "No_Records_Found") {
                    $scope.facilities = [];
                }
            });
        };

        $scope.facilityInit();
        $scope.LoadMoreLimit = 8;
        $scope.LoadMorePage = 2;
        $scope.totalDisplayed = 8;

        $scope.loadMore = function () {
            facilitiesSvc.searchfacility(appConstants.facilitylist, appConstants.getMethod, { limit: 8, pageNo: $scope.LoadMorePage }, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.facilities = $scope.facilities.concat(succResponse["data"]["data"] ? succResponse["data"]["data"] : []);
                    $scope.totalDisplayed += 8;
                    $scope.LoadMorePage++;
                    if (succResponse.data.count > $scope.totalDisplayed) {
                        $scope.lmbtn = {
                            display: appConstants.block
                        };
                    } else {
                        $scope.lmbtn = {
                            display: appConstants.none
                        };
                    }
                }
            });
        };

        $scope.orderByMe = function (x) {
            $scope.myOrderBy = x;
        };

        $scope.imagePath = baseURL + appConstants.imagePath;

        /* $scope.dashboardInit = function () {
            dashboardSvc.getDashboardData(appConstants.userDashboard, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.dashboardData = succResponse.data ? succResponse.data : [];
                }
            });
        };
        if (!$rootScope.hasOwnProperty('dashboardData')) {
            $scope.dashboardInit();
        }*/

    });


'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:FacilityDetailsCtrl
 * @description
 * # FacilityDetailsCtrl
 * Controller of the minovateApp
 */
app
    .controller('FacilityDetailsCtrl', function ($scope, $mdDialog, $http, $stateParams, $cookies, $uibModal, baseURL, toaster, $rootScope, $location, appConstants, facilitiesSvc) {

        $scope.page = {
            title: appConstants.facilityDetailsTitle,
            subtitle: appConstants.facilityDetailsSubTitle
        };
        $scope.timezones = {
            model: null,
            availableOptions: appConstants.availableTimeZoneOptions
        };
        //Code to default select device type
        $rootScope.facility_device = {};
        $rootScope.facility_device.device_type = appConstants.primaryDevice;
        //Code ends to default select device type

        $scope.result = '';
        $scope.showConfirm = function (ev) {
             if(facilityId == $cookies.get('current_facility_id')){
                toaster.pop('error',appConstants._switchtootherfacility);
                return false;
            }
            var confirm = $mdDialog.confirm()
                .title(appConstants._deletePrimaryDevice)
                .content(appConstants.content)
                .ok(appConstants.delete)
                .cancel(appConstants.ok)
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                toaster.pop('info', appConstants._successdeleteDevice);
            }, function () {
                toaster.pop('info', appConstants._canceldevicedelete);
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

        // if(typeof $stateParams == "undefined" || $stateParams.facility_id == undefined)
        // {
        // 	$stateParams = {};
        // 	$stateParams.facility_id = $stateParams.id;
        // }

        $scope.getFacilityDetailsUIData = function () {
            facilitiesSvc.getFacilityViewDetails(appConstants.facilityview + $stateParams.facility_id, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.facility = succResponse.data;
                    $scope.facility.timezone = appConstants.empty;
                } else {
                    $scope.facility = [];

                }
                $scope.getListMasterDevice();
            });
        };
        $scope.getFacilityDetailsUIData();

        $scope.getListMasterDevice = function () {
            facilitiesSvc.getListMasterDevice(appConstants.devicelistmaster, appConstants.getMethod, { limit: 20, pageNo: 1, facilityId: $stateParams.facility_id }, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.devices = succResponse.data.data;
                    $scope.totalDisplayed = 6;
                    if ($scope.devices.length > $scope.totalDisplayed) {
                        $scope.lmbtn = {
                            display: appConstants.block
                        };
                    } else {
                        $scope.lmbtn = {
                            display: appConstants.none
                        };
                    }
                }
                else {
                    $scope.result = succResponse.msg;
                }
            });
        }

        //Code starts to search facility device by text
        $scope.search_facility_device = function (facility) {
            $scope.searchAlphabet = '';
            facilitiesSvc.getListMasterDevice(appConstants.devicelistmaster, appConstants.getMethod, { limit: 20, pageNo: 1, facilityId: $stateParams.facility_id, searchVal: facility.search_val }, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.devices = succResponse.data.data;
                    $scope.totalDisplayed = 6;
                    $scope.result = appConstants.empty;

                    if ($scope.devices.length > $scope.totalDisplayed) {
                        $scope.lmbtn = {
                            display: appConstants.block
                        };
                    } else {
                        $scope.lmbtn = {
                            display: appConstants.none
                        };
                    }
                }
                else {
                    $scope.result = succResponse.msg;
                }
            });
        };

        //Code ends to search facility device by text

        //Code starts to save facility device
        $rootScope.saveFacilityDevice = function (facility_device) {
            facility_device.facility_id = jQuery.parseJSON($cookies.get(appConstants.facilitycookieID)).facility_id;
            facility_device.serial_no = parseInt(facility_device.serial_no);
            facility_device.technician_id = parseInt(facility_device.technician_id);
            facility_device.registration_code = "1234";

            facilitiesSvc.saveFacilityDevice(appConstants.deviceadd, appConstants.postMethod, {}, facility_device, function (succResponse) {
                if (succResponse.status) {
                    toaster.pop(appConstants.success, appConstants._successfacilityAdd);
                }
            });
        };
        //Code ends to save facility device

        $scope.imagePath = baseURL + appConstants.imagePath;

    });


'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:ViewFacilityCtrl
 * @description
 * # ViewFacilityCtrl
 * Controller of the minovateApp
 */
app
    .controller('ViewFacilityCtrl', function ($scope, $mdDialog, $http, $stateParams, $cookies, $uibModal, baseURL, toaster, $rootScope, $location, appConstants, facilitiesSvc, dashboardSvc) {
        $scope.page = {
            title: appConstants.facilityDetailsTitle,
            subtitle: appConstants.facilityDetailsSubTitle
        };
        $scope.imagePath = baseURL + appConstants.imagePath;

        $scope.showConfirm = function (ev, facilityId) {
             if(facilityId == $cookies.get('current_facility_id')){
                toaster.pop('error',appConstants._switchtootherfacility);
                return false;
            }
            var confirm = $mdDialog.confirm()
                .title(appConstants._deleteFacilityConfirm)
                .content(appConstants.empty)
                .ok(appConstants.delete)
                .cancel(appConstants.cancel)
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                facilitiesSvc.deleteFacility(appConstants.facilitydelete + '?facility_id=' + facilityId, appConstants.deleteMethod, {}, {}, function (succResponse) {
                    if (succResponse.status) {
                        toaster.pop('info', appConstants._successDeleteFacility);
                        $location.path('/app/admin/facility/facility');
                    }
                    else {
                        toaster.pop('error',succResponse.msg);
                        //$scope.result = succResponse.msg;
                        //$scope.statusclass = appConstants.dangerstatusClass;
                    }
                });
            }, function () {
                toaster.pop('info', appConstants._cancelFacilityDelete);
            });
        };

        $scope.getFacilityDetailsUIData = function () {
            facilitiesSvc.getFacilityViewDetails(appConstants.facilityview + $stateParams.facility_id, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.facility = succResponse.data;
                    $scope.dashboardInit();
                }
            });
        };

        $scope.getFacilityDetailsUIData();
        $scope.dashboardInit = function () {
            dashboardSvc.getDashboardData(appConstants.userDashboard, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.dashboardData = succResponse.data;
                }
            });
        };
    });



'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:EditFacilityCtrl
 * @description
 * # EditFacilityCtrl
 * Controller of the minovateApp
 */
app
    .controller('EditFacilityCtrl', function ($scope, $mdDialog, $http, $stateParams, $cookies, $uibModal, baseURL, toaster, $rootScope, $location, appConstants, facilitiesSvc, dashboardSvc) {
        $scope.usTimeZonesForFacility = appConstants.availableTimeZoneOptions;
        $scope.page = {
            title: $location.path().indexOf('view-facility') >= 0 ? appConstants.facilityDetailsTitle : appConstants.facilityedittitle,
            subtitle: appConstants.facilityDetailsSubTitle
        };

        $scope.imagePath = baseURL + appConstants.imagePath;


        $scope.getFacilityViewData = function () {
            facilitiesSvc.getFacilityViewDetails(appConstants.facilityview + $stateParams.facility_id, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.facility = succResponse.data;
                }
            });
        };

        $scope.getFacilityViewData();
        $scope.editFaciltyDashboardInit = function () {
            dashboardSvc.getDashboardData(appConstants.userDashboard, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.dashboardData = succResponse.data;
                }
            });
        };

        $scope.edit_facility = function (facility, editfacility) {
            if (!editfacility.validate()) {
                return false;
            }
            facility.timeZone = facility.facility_timezone;
            facility.zip_code = appConstants.empty + facility.facility_zipcode;
            facility.status = facility.facility_status == appConstants.active ? 1 : 0;
            facilitiesSvc.edit_facility(appConstants.facilityedit, appConstants.putMethod, {}, facility, function (succResponse) {
                if (succResponse.status) {
                    toaster.pop(appConstants.success, appConstants._editFacilitySuccess);
                    $location.path('/app/admin/facility/facility');
                }
                else {
                    $scope.facility_edit_error = succResponse.msg;
                }
            });
        };

        $scope.showConfirm = function (ev, facilityId) {
             if(facilityId == $cookies.get('current_facility_id')){
                toaster.pop('error',appConstants._switchtootherfacility);
                return false;
            }
            var confirm = $mdDialog.confirm()
                .title(appConstants._deleteFacilityConfirm)
                .content(appConstants.empty)
                .ok(appConstants.delete)
                .cancel(appConstants.cancel)
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                facilitiesSvc.deleteFacility(appConstants.facilitydelete + '?facility_id=' + facilityId, appConstants.deleteMethod, {}, {}, function (succResponse) {
                    if (succResponse.status) {
                        toaster.pop('info', appConstants._successDeleteFacility);
                        $location.path('/app/admin/facility/facility');
                    }
                    else {
                        $scope.result = succResponse.msg;
                        $scope.statusclass = appConstants.dangerstatusClass;
                    }
                });
            }, function () {
                toaster.pop('info', appConstants._cancelFacilityDelete);
            });
        };

    });

