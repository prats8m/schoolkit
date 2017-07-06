'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:DeviceCtrl
 * @description
 * # DeviceCtrl
 * Controller of the minovateApp
 */
app
    .controller('DeviceCtrl', function ($scope, $mdDialog, $http, $rootScope, $cookies, arrayPushService, toaster, baseURL, $location, errorHandler, $timeout, appConstants, devicesSvc, utilitySvc) {
        $scope.alphabateList = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        $scope.page = {
            title: appConstants.deviceTitle,
            subtitle: appConstants.dashboardSubTitle
        };

        $rootScope.device = {};

        $scope.result = appConstants.empty;
        $scope.showConfirm = function (id, facility_id, ev) {
            var confirm = $mdDialog.confirm()
                .title(appConstants._deletePrimaryDevice)
                .content(appConstants.empty)
                .ok(appConstants.delete)
                .cancel(appConstants.cancel)
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                devicesSvc.deleteDevice(appConstants.devicedelete + '?device_id=' + id, appConstants.deleteMethod, {}, {}, function (succResponse) {
                    if (succResponse.status) {
                        toaster.pop(appConstants.success, appConstants._successdeleteDevice);
                        var tempDevice = [];
                        for (var i = 0; i < $scope.data.length; i++) {
                            if (id != $scope.data[i].device_id) {
                                tempDevice.push($scope.data[i]);
                            }
                        }
                        $scope.data = tempDevice;
                        $rootScope.dashboardData.primary_device--;
                    }
                    else {
                        $scope.result = succResponse.msg;
                    }
                });
            }, function () {
                toaster.pop(appConstants.error, appConstants._canceldevicedelete);
                //$scope.result =appConstants._canceldevicedelete;
                //$scope.statusclass = appConstants.successstatusClass;
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


        //........This method has been updated to change URL........................

        $rootScope.getDoorsList = function () {
            devicesSvc.getDoorsList(appConstants.doorlistnotassigntodevice + '?facility_id=' + $rootScope.device.facility_id, appConstants.getMethod, {}, {}, function (succResponse) {
                $rootScope.doorList = [];
                if (succResponse.status) {
                    $rootScope.doorList = succResponse.data;
                }
            });
        };
        //$scope.getDoorsList();

        $scope.resetDeviceModel = function () {
            $rootScope.device = {};
            $scope.getTechnicianList();
            $scope.facilityInit();
            //   $scope.deviceModelInit();
        };

        $rootScope.formSubmit = function (device, device_form) {
            if (!device_form.validate()) {
                return false;
            }
            device.technician_id = parseInt(device.technician_id);
            devicesSvc.formSubmit(appConstants.deviceadd, appConstants.postMethod, {}, device, function (succResponse) {
                if (succResponse.status) {
                    toaster.pop(appConstants.success, succResponse.msg);
                    $scope.pageNo = 1;
                    $rootScope.dashboardData.primary_device++;
                    // $scope.dashboardInit();
                    $scope.deviceInit();
                    $timeout(function () { $("#close").click(); })
                }
                else {
                    $rootScope.masters = [];
                    $rootScope.masters = succResponse.error;
                }
            });
        };
        $scope.refreshList = function () {
            $scope.searchAlphabet = '';
            $scope.pageNo = 1;
            $(".f-wm:contains(" + appConstants.nomoredataavailable + ")").text('Load More').css("opacity", 1);
            $scope.deviceInit();
        }
        $scope.pageNo = 1;
        // $scope.devicePageLimit = 8;
        $scope.searchAlphabet = '';
        $scope.searchByAlphabet = function (alphabet) {
            $scope.searchText = '';
            $(".f-wm:contains(" + appConstants.nomoredataavailable + ")").text('Load More').css("opacity", 1);
            $scope.pageNo = 1;
            if (alphabet == 'All') {
                $scope.searchAlphabet = '';
                $scope.deviceInit();
                return;
            }
            $scope.searchAlphabet = alphabet;
            $scope.deviceInit();

        }
        $scope.deviceInit = function () {
            if (!$scope.searchText) {
                $scope.searchText = appConstants.empty;
            }
            devicesSvc.deviceInit(appConstants.devicelistmaster + '?limit='+ appConstants.pageLimit +'&pageNo=' + $scope.pageNo + '&searchVal=' + $scope.searchText + '&facility_id=' + utilitySvc.getCurrentFacility() + '&albhabet=' + $scope.searchAlphabet,
                appConstants.getMethod, {}, {}, function (succResponse) {
                    if (succResponse.status) {
                        if ($scope.pageNo <= 1)
                            $scope.data = [];
                        angular.forEach(succResponse["data"]["data"], function (device, index) {
                            $scope.data.push(device);
                        });
                        $rootScope.deviceList = succResponse.data.data;
                        $scope.pageNo = $scope.pageNo + 1;
                        $scope.count = succResponse.data.count;
                    }
                    else {
                        if (succResponse.msg == 'No_Records_Found') {
                            $scope.data = [];
                            $("#loadMoreBtn").text(appConstants.nomorerecords);
                            $("#loadMoreBtn").attr("disabled", appConstants.disabled);
                        }
                    }
                });
        };

        $scope.searchFunction = function (e) {
            if (e)
                if (e.keyCode != 13) { return false; }
            if (!$scope.searchText) {
                $scope.searchText = appConstants.empty;
            }
            $scope.searchAlphabet = '';
            $scope.pageNo = 1;
            devicesSvc.searchFunction(appConstants.devicelistmaster + '?searchVal=' + $scope.searchText + '&facility_id=' + utilitySvc.getCurrentFacility(), appConstants.getMethod, {}, {}, function (succResponse) {
                $scope.data = [];
                if (succResponse.status) {
                    $scope.data = succResponse.data.data;
                    $scope.pageNo = $scope.pageNo + 1;
                }
            });
        };

        $scope.getDoorsList = function () {
            devicesSvc.getDoorsList(appConstants.doorlist + '?limits=100&pageNo=1' + '&facility_id=' + utilitySvc.getCurrentFacility(), appConstants.getMethod, {}, {}, function (succResponse) {
                $rootScope.doorList = [];
                if (succResponse.status) {
                    $rootScope.doorList = succResponse.data.data;
                }
            });
        };

        $scope.getTechnicianList = function (device) {
            devicesSvc.getTechnicianList(appConstants.technicianlist, appConstants.getMethod, {}, device, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.technicianList = succResponse.data.data;
                }
            });
        };
        //$scope.getDoorsList();


        $scope.facilityInit = function () {
            devicesSvc.facilityInit(appConstants.facilitylist + '?facility_id=' + utilitySvc.getCurrentFacility(), appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.facilityList = succResponse.data.data;
                    if (utilitySvc.getCurrentFacility() != '') {
                        $rootScope.device.facility_id = parseInt(utilitySvc.getCurrentFacility());
                        $('#facility_id').attr('disabled', 'disabled');
                        $rootScope.getDoorsList();
                    }
                }
            });
        };

        $scope.orderByMe = function (x) {
            $scope.myOrderBy = x;
        };

        //  device/models-list
        $scope.deviceModelInit = function () {
            devicesSvc.deviceModelInit(appConstants.devicemodellist, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.deviceModel = succResponse.data;
                }
            });
        };

        /* $scope.dashboardInit = function(){
            devicesSvc.dashboardInit(appConstants.userDashboard + '?facility_id=' + utilitySvc.getCurrentFacility(),appConstants.getMethod,{},{},function (succResponse) {
                if(succResponse.status){
                    $rootScope.dashboardData = succResponse.data;
                }
            });
        };
        $scope.dashboardInit(); */

        $scope.imagePath = baseURL + appConstants.imagePath;

    });


'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:DeviceDetailsCtrl
 * @description
 * # DeviceDetailsCtrl
 * Controller of the minovateApp
 */
app
    .controller('ViewDeviceCtrl', function ($scope, $mdDialog, $http, $stateParams, $cookies, toaster, $rootScope, baseURL, errorHandler, $location, appConstants, devicesSvc, utilitySvc) {
        $scope.page = {
            title: appConstants.deviceviewUITitle,
            subtitle: appConstants.dashboardSubTitle
        };
        var device_id = $stateParams.device_id;
        $scope.device_id = device_id;
        //$rootScope.facilityId = $cookies.get('facilityId');

        $rootScope.submitDependentDevice = function (device, add_dependent) {
            if (!add_dependent.validate()) {
                return false;
            }
            device.technician_id = parseInt(device.technician_id);
            device.serial_no = parseInt(device.serial_no);


            devicesSvc.submitDependentDevice(appConstants.deviceadd, appConstants.postMethod, {}, device, function (succResponse) {
                if (succResponse.status) {
                    toaster.pop(appConstants.success, appConstants.submitSuccessfully);
                }
            });
        };


        $scope.result = appConstants.empty;
        $scope.showConfirm = function (facility_id, ev) {
            var confirm = $mdDialog.confirm()
                .title(appConstants._deletePrimaryDevice)
                .content(appConstants.empty)
                .ok(appConstants.delete)
                .cancel(appConstants.cancel)
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                devicesSvc.deleteDevice(appConstants.devicedelete + '?device_id=' + parseInt($stateParams.device_id), appConstants.deleteMethod, {}, {}, function (succResponse) {
                    if (succResponse.status) {
                        toaster.pop(appConstants.success, appConstants._successdeleteDevice);
                    }
                });
            }, function () {
                toaster.pop(appConstants.error, appConstants._canceldevicedelete);
                //$scope.result = appConstants._canceldevicedelete;
                //$scope.statusclass = appConstants.successstatusClass;
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

        $scope.dependentDeviceInit = function () {
            devicesSvc.dependentDeviceInit(appConstants.deviceview + '?device_id=' + device_id + '&facility_id=' + utilitySvc.getCurrentFacility(), appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.details = succResponse.data;
                    $scope.editDevice = succResponse.data;
                    $scope.editDevice.device_technician_id = $scope.editDevice.device_technician_id.toString();
                }
            });
        };

        $scope.showDoorsForDevice = function (doors) {
            if (doors) {
                var drs = '';
                var totalkeyValues = Object.keys(doors).length;
                var count = 0;
                for (var k in doors) {
                    if (doors.hasOwnProperty(k)) {
                        count++;
                        if (count < totalkeyValues) {
                            drs += doors[k] + ', ';
                        }
                        else {
                            drs += doors[k];
                        }
                    }
                }
                return drs;
            }
        };

        $scope.deviceModelInit = function () {
            devicesSvc.deviceModelInit(appConstants.devicemodellist, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.deviceModel = succResponse.data;
                }
            });
        };
        $scope.deviceModelInit();

        $scope.pageNo = 1;
        $scope.dependent_devices = [];
        $scope.dependentDevices = function (e) {
            if (e)
                if (e.keyCode != 13) { return false; }
            if (!$scope.searchText) {
                $scope.searchText = appConstants.empty;
            }
            devicesSvc.dependentDevices(appConstants.listslaveofmasterdevice + '?limit=8&pageNo=' + $scope.pageNo + '&searchVal=' + $scope.searchText + '&device_master_id=' + $stateParams.device_id + '&facility_id=' + utilitySvc.getCurrentFacility(), appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.dependent_devices = succResponse.data;
                }
            });
        };
        $scope.dependentDevices();

        $scope.deviceUsers = function () {
            devicesSvc.deviceUsers(appConstants.userdetailsbydevice + '/1', appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {

                }
            });
        };
        //$scope.deviceUsers();


        $scope.orderByMe = function (x) {
            $scope.myOrderBy = x;
        }

        $scope.imagePath = baseURL + appConstants.imagePath;

        $scope.editFormSubmit = function (device) {
            device.registration_code = device.device_registration_code;
            device.technician_id = device.device_technician_id;
            device.serial_no = parseInt(device.device_serial_no);
            device.facility_id = parseInt($rootScope.facilityId);

            devicesSvc.editFormSubmit(appConstants.deviceedit, appConstants.putMethod, {}, device, function (succResponse) {
                if (succResponse.status) {
                    toaster.pop(appConstants.success, appConstants.submitSuccessfully);
                }
            });
        };

        $scope.getTechnicianList = function (device) {
            devicesSvc.getTechnicianList(appConstants.technicianlist, appConstants.getMethod, {}, device, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.technicianList = succResponse.data;
                }
            });
        };


        $scope.searchFunction = function (e) {
            if (e)
                if (e.keyCode != 13) { return false; }
            if (!$scope.searchText) {
                $scope.searchText = '';
            }
            $scope.pageNo = 1;

            devicesSvc.searchFunction(appConstants.listslaveofmasterdevice + '?limit=8&pageNo=' + $scope.pageNo + '&searchVal=' + $scope.searchText + '&device_master_id=' + $stateParams.device_id + '&facility_id=' + utilitySvc.getCurrentFacility(), appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.data = succResponse.data.data;
                    $scope.pageNo = $scope.pageNo + 1;
                }
            });
        };

        $scope.facilityInit = function () {
            devicesSvc.facilityInit(appConstants.facilitylist, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    var facilityList = succResponse.data.data;
                    for (var i = 0; i < facilityList.length; i++) {
                        if (parseInt(facilityList[i].facility_id) == parseInt($cookies.get('facilityId')))
                            $rootScope.FacilityName = facilityList[i].facility_name;
                    }
                }
            });
        };
        $scope.facilityInit();

        $scope.deviceData = [];
        $scope.pageNo = 1;
        $scope.deviceInit = function () {
            devicesSvc.deviceInit(appConstants.devicelistmaster + '?limit=100&pageNo=' + $scope.pageNo + '&facility_id=' + utilitySvc.getCurrentFacility(), appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.deviceData = succResponse.data.data;
                    $scope.pageNo = $scope.pageNo + 1;
                    $scope.getTechnicianList();
                }
            });
        };
        $scope.deviceInit();

        /* $scope.dashboardInit = function(){
            devicesSvc.dashboardInit(appConstants.userDashboard,appConstants.getMethod,{},{},function (succResponse) {
                if(succResponse.status){
                    $rootScope.dashboardData = succResponse.data;
                }
            });
        };
        $scope.dashboardInit();*/

    });

'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:ViewDependentDeviceCtrl
 * @description
 * # ViewDependentDeviceCtrl
 * Controller of the minovateApp
 */
app
    .controller('ViewDependentDeviceCtrl', function ($scope, $mdDialog, $http, $rootScope, $stateParams, $cookies, toaster, errorHandler, baseURL, $location, appConstants, devicesSvc, utilitySvc) {
        $scope.page = {
            title: appConstants.dependentDevice,
            subtitle: appConstants.dashboardSubTitle
        };

        $scope.result = appConstants.empty;
        $scope.showConfirm = function (id, ev) {
            var confirm = $mdDialog.confirm()
                .title(appConstants._deletePrimaryDevice)
                .content(appConstants.empty)
                .ok(appConstants.delete)
                .cancel(appConstants.cancel)
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                $scope.deleteThisDevice();
                //$scope.result = appConstants._successdeleteDevice;
                //$scope.statusclass = appConstants.dangerstatusClass;
            }, function () {
                toaster.pop(appConstants.error, appConstants._canceldevicedelete);
                //$scope.result = appConstants._canceldevicedelete;
                //$scope.statusclass = appConstants.successstatusClass;
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

        $scope.users = [{
            serialno: '1',
            name: 'Arnold',
            group: 'Office Hours',
            phone: '+1 212 1467 8920',
            imagename: '2'
        }];

        $scope.orderByMe = function (x) {
            $scope.myOrderBy = x;
        };

        $scope.imagePath = baseURL + appConstants.imagePath;

        var device_id = $stateParams.device_id;
        $scope.dependentDeviceInit = function () {
            devicesSvc.dependentDeviceInit(appConstants.deviceview + '?device_id=' + $stateParams.device_id, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.details = succResponse.data;
                }
            });
        };
        $scope.dependentDeviceInit();

        $scope.showDoorsForDevice = function (doors) {
            if (doors) {
                var drs = '';
                var totalkeyValues = Object.keys(doors).length;
                var count = 0;
                for (var k in doors) {
                    if (doors.hasOwnProperty(k)) {
                        count++;
                        if (count < totalkeyValues) {
                            drs += doors[k] + ', ';
                        }
                        else {
                            drs += doors[k];
                        }
                    }
                }
                return drs;
            }
        };

        $scope.editFormSubmit = function (device) {
            device.registration_code = device.device_registration_code;
            device.technician_id = parseInt(device.device_technician_id);
            device.serial_no = parseInt(device.device_serial_no);
            device.facility_id = device.device_facility_id;

            devicesSvc.editFormSubmit(appConstants.deviceedit, appConstants.putMethod, {}, device, function (succResponse) {
                if (succResponse.status) {
                    toaster.pop(appConstants.success, appConstants.submitSuccessfully);
                }
            });
        };

        $scope.getTechnicianList = function (device) {
            devicesSvc.getTechnicianList(appConstants.technicianlist, appConstants.getMethod, {}, device, function (succResponse) {
                if (succResponse.status) {
                    $scope.technicianList = succResponse.data;
                }
            });
        };
        $scope.getTechnicianList();

        /*  $scope.dashboardInit = function(){
            devicesSvc.dashboardInit(appConstants.userDashboard,appConstants.getMethod,{},{},function (succResponse) {
                if(succResponse.status){
                    $rootScope.dashboardData = succResponse.data;
                }
            });
        };
        $scope.dashboardInit();*/


        $scope.deleteThisDevice = function () {
            if (!confirm(appConstants.deletedeviceconfirmationmessage)) {
                return false;
            }
            devicesSvc.deleteThisDevice(appConstants.devicedelete + '?device_id=' + parseInt($stateParams.device_id), appConstants.deleteMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    toaster.pop(appConstants.success, succResponse.msg);
                    $location.path('/app/admin/device/dependent-devices');
                }
            });
        };
    });

'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:DependentDeviceCtrl
 * @description
 * # DependentDeviceCtrl
 * Controller of the minovateApp
 */
app
    .controller('DependentDeviceCtrl', function ($scope, $mdDialog, $http, $rootScope, $stateParams, $cookies, toaster, errorHandler, baseURL, $location, arrayPushService, appConstants, devicesSvc, $timeout, utilitySvc) {
        $scope.page = {
            title: appConstants.dependentDevice + 's',
            subtitle: appConstants.dashboardSubTitle
        };

        $rootScope.facilityId = $cookies.get("facilityId");
        $scope.result = appConstants.empty;
        $scope.showConfirm = function (id, ev) {
            var confirm = $mdDialog.confirm()
                .title(appConstants.deletedependentdeviceconfirmation)
                .content(appConstants.empty)
                .ok(appConstants.delete)
                .cancel(appConstants.cancel)
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                devicesSvc.deleteDevice(appConstants.devicedelete + '?device_id=' + parseInt(id), appConstants.deleteMethod, {}, {}, function (succResponse) {
                    if (succResponse.status) {
                        for (var key in $scope.dependentDevice) {
                            if ($scope.dependentDevice[key].device_id == parseInt(id)) {
                                $scope.dependentDevice.splice(key, 1);
                                break;
                            }
                        }
                        toaster.pop(appConstants.success, appConstants._successdeletedependentDevice);
                        //$scope.result = appConstants._successdeletedependentDevice;
                        //$scope.statusclass = appConstants.dangerstatusClass;
                    }
                    else {
                        toaster.pop(appConstants.error, succResponse.msg);
                        //$scope.result = succResponse.msg;
                        //$scope.statusclass = appConstants.dangerstatusClass;
                    }
                });
            }, function () {
                toaster.pop(appConstants.error, appConstants._canceldependentdevicedelete);
                //$scope.result = appConstants._canceldependentdevicedelete;
                //$scope.statusclass = appConstants.successstatusClass;
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

        $scope.dependentDevice = [];
        $scope.hideLoadMore = false;
        $scope.getDependentDevice = function () {
            devicesSvc.getDependentDevice(appConstants.devicelistslave + '?limits=8&pageNo=1' + '&facility_id=' + utilitySvc.getCurrentFacility(), appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.dependentDevice = [];
                    angular.forEach(succResponse["data"]["data"], function (dependentDevice, index) {
                        $scope.dependentDevice.push(dependentDevice);
                    });
                    if (succResponse.data.data.length < 8) { $scope.hideLoadMore = true; } else { $scope.hideLoadMore = false; }
                }
                else {
                    $scope.dependentDevice = [];
                    $scope.hideLoadMore = true;
                }
            });
        };
        $scope.getDependentDevice();

        $scope.getDoorsList = function () {
            devicesSvc.getDoorsList(appConstants.doorlist + '?limits=100&pageNo=1' + '&facility_id=' + utilitySvc.getCurrentFacility(), appConstants.getMethod, {}, {}, function (succResponse) {
                $rootScope.doorList = [];
                if (succResponse.status) {
                    $rootScope.doorList = succResponse.data.data;
                    $scope.getTechnicianList();
                }
            });
        };
        $scope.getDoorsList();

        $scope.getTechnicianList = function (device) {
            devicesSvc.getTechnicianList(appConstants.technicianlist, appConstants.getMethod, {}, device, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.technicianList = succResponse.data;
                }
            });
        };
        //$scope.getDoorsList();
        $scope.getTechnicianList();

        $scope.resetDependentDeviceModel = function () {
            $rootScope.device = {};
        }

        $rootScope.formSubmit = function (device, device_form) {

            if (!device_form.validate()) {
                return false;
            }
            device.technician_id = parseInt(device.technician_id);
            //device.serial_no = parseInt(device.serial_no);
            //device.facility_id = parseInt($rootScope.facilityId);

            devicesSvc.formSubmit(appConstants.deviceadd, appConstants.postMethod, {}, device, function (succResponse) {
                if (succResponse.status) {
                    toaster.pop(appConstants.success, succResponse.msg);
                    $scope.pageNo = 1;
                    $scope.getDependentDevice();
                    $timeout(function () { $("#close").click(); });
                }
                else {
                    $rootScope.masters = [];
                    $rootScope.masters = succResponse.error;
                }
            });
        };

        $scope.searchFunction = function () {
            devicesSvc.searchFunction(appConstants.devicelistslave + '?limit=8&pageNo=' + $scope.pageNo + '&searchVal=' + $scope.searchText + '&facility_id=' + utilitySvc.getCurrentFacility(), appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.dependentDevice = succResponse.data.data;
                }
            });
        };
        //$scope.searchFunction();

        $scope.orderByMe = function (x) {
            $scope.myOrderBy = x;
        };

        $scope.data = [];
        $scope.pageNo = 1;
        $scope.deviceInit = function () {
            if (!$scope.searchText) {
                $scope.searchText = appConstants.empty;
            }
            devicesSvc.deviceInit(appConstants.devicelistmaster + '?limit=100&pageNo=' + $scope.pageNo + '&facility_id=' + utilitySvc.getCurrentFacility(), appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.deviceList = succResponse.data.data;
                    $scope.pageNo = $scope.pageNo + 1;
                }
                else {
                    if (succResponse.msg == 'No_Records_Found') {
                        $("#loadMoreBtn").text(appConstants.nomorerecords);
                        $("#loadMoreBtn").attr("disabled", appConstants.disabled);
                    }
                }
            });
        };
        $scope.deviceInit();

        /*  $scope.dashboardInit = function(){
            devicesSvc.dashboardInit(appConstants.userDashboard + '&facility_id=' + utilitySvc.getCurrentFacility(),appConstants.getMethod,{},{},function (succResponse) {
                if(succResponse.status){
                    $rootScope.dashboardData = succResponse.data;
                }
            });
        };
        $scope.dashboardInit();*/


        $scope.facilityInit = function () {
            devicesSvc.facilityInit(appConstants.facilitylist + '?facility_id=' + utilitySvc.getCurrentFacility(), appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.facilityList = succResponse.data.data;
                }
            });
        };
        $scope.facilityInit();

        $scope.imagePath = baseURL + appConstants.imagePath;

    });



'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:EditDeviceCtrl
 * @description
 * # EditDeviceCtrl
 * Controller of the minovateApp
 */
app
    .controller('EditDeviceCtrl', function ($scope, $mdDialog, $http, $rootScope, $stateParams, $cookies, toaster, $state, errorHandler, baseURL, $location, appConstants, devicesSvc, utilitySvc) {
        $scope.page = {
            title: appConstants.editDeviceUiTitle
        };
        var device_id = $stateParams.device_id;
        $scope.device_id = device_id;

        $scope.result = appConstants.empty;
        $scope.showConfirm = function (ev, id, facilityId) {
            var confirm = $mdDialog.confirm()
                .title(appConstants._deletePrimaryDevice)
                .content(appConstants.empty)
                .ok(appConstants.yes)
                .cancel(appConstants.no)
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                devicesSvc.deleteDevice(appConstants.devicedelete + '?device_id=' + parseInt(id), appConstants.deleteMethod, {}, {}, function (succResponse) {
                    if (succResponse.status) {
                        toaster.pop(appConstants.success, succResponse.msg.replace(/_/g, " "));
                        $state.go('app.admin.device.devices');
                    }
                });
            }, function () {
                toaster.pop(appConstants.error, appConstants._canceldevicedelete);
            });
        };

        $scope.imagePath = baseURL + appConstants.imagePath;

        $scope.deviceModelInit = function () {
            devicesSvc.deviceModelInit(appConstants.devicemodellist, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.deviceModel = succResponse.data;
                }
            });
        };
        $scope.deviceModelInit();

        $scope.facilityInit = function () {
            devicesSvc.facilityInit(appConstants.facilitylist + '?facility_id=' + utilitySvc.getCurrentFacility(), appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.facilityList = succResponse.data.data;
                }
            });
        };
        $scope.facilityInit();

        $scope.dependentDeviceInit = function () {
            devicesSvc.dependentDeviceInit(appConstants.deviceview + '?device_id=' + device_id + '&facility_id=' + utilitySvc.getCurrentFacility(), appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.details = succResponse.data;
                    $scope.editDevice = succResponse.data;
                    $scope.editDevice.technician_id = $scope.editDevice.device_technician_id;
                    var obj = $scope.editDevice.doors;
                    var tmpArray = [];
                    for (var prop in obj) {
                        tmpArray.push(Number(prop));
                    }
                    $scope.editDevice.door_id = tmpArray;
                    $scope.getDeviceDoorsList(succResponse.data.device_facility_id, $scope.editDevice.doors);
                }
            });
        };
        $scope.dependentDeviceInit();

        $scope.getDeviceDoorsList = function (facility_id, doors) {
            devicesSvc.getDoorsList(appConstants.doorlistnotassigntodevice + '?facility_id=' + facility_id, appConstants.getMethod, {}, {}, function (succResponse) {
                $scope.doorList = [];
                if (succResponse.status) {
                    $scope.doorList = succResponse.data;
                    for (var prop in doors) {
                        $scope.doorList.push({ door_id: parseInt(prop), door_name: doors[prop] });
                    }
                }
                else {
                    for (var prop in doors) {
                        $scope.doorList.push({ door_id: parseInt(prop), door_name: doors[prop] });
                    }

                }
            });
        };

        $scope.getTechnicianList = function (device) {
            devicesSvc.getTechnicianList(appConstants.technicianlist, appConstants.getMethod, {}, device, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.technicianList = succResponse.data;
                }
            });
        };
        $scope.getTechnicianList();

        $scope.getDoorsList = function () {
            devicesSvc.getDoorsList(appConstants.doorlist + '?limits=100&pageNo=1' + '&facility_id=' + utilitySvc.getCurrentFacility(), appConstants.getMethod, {}, {}, function (succResponse) {
                $rootScope.doorList = [];
                if (succResponse.status) {
                    $rootScope.doorList = succResponse.data.data;
                }
            });
        };
        // $scope.getDoorsList();

        $rootScope.formSubmit = function (device, device_form) {
            if (!device_form.validate()) {
                return false;
            }
            device.technician_id = parseInt(device.technician_id);
            device.serial_no = device.device_serial_no;
            device.facility_id = device.device_facility_id;
            device.registration_code = device.device_registration_code;

            devicesSvc.formSubmit(appConstants.deviceedit, appConstants.putMethod, {}, device, function (succResponse) {
                if (succResponse.status) {
                    toaster.pop(appConstants.success, succResponse.msg);
                    $location.path('/app/admin/device/devices');

                }
                else {
                    $rootScope.masters = [];
                    $rootScope.masters = succResponse.error;
                }
            });
        };

        $scope.getmasterDevice = function () {
            devicesSvc.getmasterDevice(appConstants.devicelistmaster + '?facility_id=' + utilitySvc.getCurrentFacility(), appConstants.getMethod, {}, {}, function (succResponse) {
                $rootScope.masterDevices = [];
                if (succResponse.status) {
                    $rootScope.masterDevices = succResponse.data.data;
                }
            });
        };
        $scope.getmasterDevice();

        /*$scope.dashboardInit = function(){
            devicesSvc.dashboardInit(appConstants.userDashboard + '&facility_id=' + utilitySvc.getCurrentFacility(),appConstants.getMethod,{},{},function (succResponse) {
                if(succResponse.status){
                    $rootScope.dashboardData = succResponse.data;
                }
            });
        };
        $scope.dashboardInit();*/

    });