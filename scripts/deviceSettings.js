'use strict';

app
    .controller('DeviceSettingController', function ($scope, $mdDialog, $http, $cookies, arrayPushService, $location, toaster, baseURL, $timeout, $stateParams, dataService) {
        $scope.page = {
            title: 'Settings',
            subtitle: ''
        };

        $scope.deviceGeneralSettingModals = {};
        $scope.grantAccessKey = {
            value: 0
        };

        $scope.device_id = parseInt($stateParams.device_id);
        $scope.commonGetAPIData = {
            device_id: $scope.device_id,
            type: ""
        };

        $scope.commonSetAPIData = {
            device_id: $scope.device_id,
            module: "",
            type: "",
            value: {}
        };

        var commonSetHTTPService = function (data, msg) {
            $http({
                    method: 'POST',
                    url: baseURL + 'device/add-settings',
                    dataType: 'JSON',
                    data: data,
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": $cookies.get("token")
                    }
                })
                .success(function (response) {
                    if (response.status == true) {
                        toaster.pop('success', msg);
                    } else {

                    }
                }).error(function () {

                });
        };

        $scope.getGeneralSettings = function () {
            $scope.commonGetAPIData.type = "gen";
            $http({
                    method: 'GET',
                    url: baseURL + 'device/get-settings?device_id=' + $scope.commonGetAPIData.device_id + '&type=' + $scope.commonGetAPIData.type,
                    dataType: 'JSON',
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": $cookies.get("token")
                    }
                })
                .success(function (response) {
                    if (response.status == true) {
                        $scope.deviceGeneralSettingModals = response.data;
                        $scope.grantAccessKey.value = response.data.dgs_access_granted_key["access-grant-key"];
                        $scope.lockoutMode = response.data.dgs_lockout_mode['lockout-mode'];
                    } else {

                    }
                }).error(function () {

                });
        };

        $scope.setAccessGrantKey = function () {
            $scope.commonSetAPIData.module = "access-grant-key";
            $scope.commonSetAPIData.type = "gen";
            $scope.commonSetAPIData.value["access-grant-key"] = $scope.grantAccessKey.value;
            commonSetHTTPService($scope.commonSetAPIData, 'Access Granted key changed successfully.');
        };

        $scope.setCameraSettings = function () {
            $scope.commonSetAPIData.module = "camera-setup";
            $scope.commonSetAPIData.type = "gen";
            $scope.commonSetAPIData.value["picture-snapshot-access"] = $scope.deviceGeneralSettingModals.dgs_camera['picture-snapshot-access'];
            $scope.commonSetAPIData.value["snapshot-status"] = $scope.deviceGeneralSettingModals.dgs_camera['snapshot-status'];
            $scope.commonSetAPIData.value["video-recording-access"] = $scope.deviceGeneralSettingModals.dgs_camera['video-recording-access'];
            $scope.commonSetAPIData.value["recording-status"] = $scope.deviceGeneralSettingModals.dgs_camera['recording-status'];
            commonSetHTTPService($scope.commonSetAPIData, 'Camera Configured successfully.');
        };

        $scope.setTalkTime = function () {
            $scope.commonSetAPIData.module = "talk-time-setup";
            $scope.commonSetAPIData.type = "gen";
            $scope.commonSetAPIData.value["talk-time"] = $scope.deviceGeneralSettingModals.dgs_talk_time['talk-time'];
            commonSetHTTPService($scope.commonSetAPIData, 'Talk Time Configured successfully.');
        };

        $scope.setLEDConfiguration = function () {
            $scope.commonSetAPIData.module = "led-setup";
            $scope.commonSetAPIData.type = "gen";
            $scope.commonSetAPIData.value['led-setup'] = {
                'led-key-setup': ""
            };
            $scope.commonSetAPIData.value['led-setup'] = {
                'brightness': ""
            };
            $scope.commonSetAPIData.value['courtsey-led-setup'] = {
                'led-key-setup': ""
            };
            $scope.commonSetAPIData.value['courtsey-led-setup'] = {
                'brightness': ""
            };
            $scope.commonSetAPIData.value['led-setup']['led-key-setup'] = $scope.deviceGeneralSettingModals.dgs_led['led-setup']['led-key-setup'];
            $scope.commonSetAPIData.value['led-setup']['brightness'] = $scope.deviceGeneralSettingModals.dgs_led['led-setup']['brightness'];
            $scope.commonSetAPIData.value['courtsey-led-setup']['led-key-setup'] = $scope.deviceGeneralSettingModals.dgs_led['courtsey-led-setup']['led-key-setup'];
            $scope.commonSetAPIData.value['courtsey-led-setup']['brightness'] = $scope.deviceGeneralSettingModals.dgs_led['courtsey-led-setup']['brightness'];
            commonSetHTTPService($scope.commonSetAPIData, 'LED Configured successfully.');
        };

        $scope.setSpeakerMicrophone = function () {
            $scope.commonSetAPIData.module = "speaker-microphone-setup";
            $scope.commonSetAPIData.type = "gen";
            $scope.commonSetAPIData.value['speaker-beeper'] = $scope.deviceGeneralSettingModals.dgs_speaker['speaker-beeper'];
            $scope.commonSetAPIData.value['microphone-beeper'] = $scope.deviceGeneralSettingModals.dgs_speaker['microphone-beeper'];
            $scope.commonSetAPIData.value['speaker-volume'] = $scope.deviceGeneralSettingModals.dgs_speaker['speaker-volume'];
            $scope.commonSetAPIData.value['microphone-sensitivity'] = $scope.deviceGeneralSettingModals.dgs_speaker['microphone-sensitivity'];
            commonSetHTTPService($scope.commonSetAPIData, 'Speaker and Microphone configured successfully.');
        };

        $scope.createLockoutModeArray = function (data) {
            var idx = $scope.deviceGeneralSettingModals.dgs_lockout_mode['lockout-mode'].indexOf(data);
            // is currently selected
            if (idx > -1) {
                $scope.deviceGeneralSettingModals.dgs_lockout_mode['lockout-mode'].splice(idx, 1);
            } else {
                $scope.deviceGeneralSettingModals.dgs_lockout_mode['lockout-mode'].push(data);
            }
            console.log($scope.deviceGeneralSettingModals.dgs_lockout_mode['lockout-mode']);
        };

        $scope.setLockoutMode = function () {
            $scope.commonSetAPIData.module = "lockout-setup";
            $scope.commonSetAPIData.type = "gen";
            $scope.commonSetAPIData.value['lockout-mode'] = $scope.deviceGeneralSettingModals.dgs_lockout_mode['lockout-mode'];
            $scope.commonSetAPIData.value['max-tries'] = $scope.deviceGeneralSettingModals.dgs_lockout_mode['max-tries'];
            $scope.commonSetAPIData.value['lockout-period'] = $scope.deviceGeneralSettingModals.dgs_lockout_mode['lockout-period'];
            commonSetHTTPService($scope.commonSetAPIData, 'Lockout Mode Configured successfully.');
        };

        $scope.advanceClockSetting = {
            date: "",
            time: new Date()
        }
        $scope.advanceDiagRealTime = {
            date: "",
            time: new Date(),
            startTime: new Date(),
            endTime: new Date()
        }
        $scope.getAdvancedSettings = function () {
            $scope.commonGetAPIData.type = "adv";
            $http({
                    method: 'GET',
                    url: baseURL + 'device/get-settings?device_id=' + $scope.commonGetAPIData.device_id + '&type=' + $scope.commonGetAPIData.type,
                    dataType: 'JSON',
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": $cookies.get("token")
                    }
                })
                .success(function (response) {
                    if (response.status == true) {
                        $scope.deviceAdvanceSettingModals = response.data;
                        if (response.data.das_clock_setting['real-time-clock'] != 0)
                            $scope.advanceClockSetting.time = new Date(response.data.das_clock_setting['real-time-clock'] * 1000);
                        $scope.advanceClockSetting.date = decodeTimeStamp($scope.advanceClockSetting.time);
                        if (response.data.das_diagonastic['real-time-clock'] != 0)
                            $scope.advanceDiagRealTime.time = new Date(response.data.das_diagonastic['real-time-clock'] * 1000);
                        $scope.advanceDiagRealTime.date = decodeTimeStamp($scope.advanceDiagRealTime.time);
                        if (response.data.das_diagonastic['start-time'] != 0)
                            $scope.advanceDiagRealTime.startTime = new Date(response.data.das_diagonastic['start-time'] * 1000);
                        if (response.data.das_diagonastic['end-time'] != 0)
                            $scope.advanceDiagRealTime.endTime = new Date(response.data.das_diagonastic['end-time'] * 1000);
                    } else {

                    }
                }).error(function () {

                });
        };

        $scope.setMasterCode = function () {
            $scope.commonSetAPIData.module = "master-code";
            $scope.commonSetAPIData.type = "adv";
            $scope.commonSetAPIData.value['master-code'] = $scope.deviceAdvanceSettingModals.das_master_code['master-code'];
            commonSetHTTPService($scope.commonSetAPIData, 'Master Code Configured successfully.');
        }
        var decodeTimeStamp = function (stamp) {
            var temp = new Date(stamp * 1000);
            return temp.getDate() + "/" + (temp.getMonth() + 1) + "/" + temp.getFullYear();
        }
        var createTimeStamp = function (appliedDate, appliedTime) {
            var fullDate = appliedDate;
            var date = fullDate.slice(fullDate.indexOf("/") - 2, fullDate.indexOf("/"));
            var month = fullDate.slice(fullDate.indexOf("/") + 1, fullDate.indexOf("/") + 3);
            var year = fullDate.slice(fullDate.indexOf("/") + 4, fullDate.length);
            var time = new Date(appliedTime);
            time.setDate(parseInt(date));
            time.setMonth(parseInt(month) - 1);
            return time = time.setFullYear(parseInt(year));
        };
        $scope.setClockSettings = function () {
            var time = createTimeStamp($scope.advanceClockSetting.date, $scope.advanceClockSetting.time);
            $scope.commonSetAPIData.module = "clock-settings";
            $scope.commonSetAPIData.type = "adv";
            $scope.commonSetAPIData.value['real-time-clock'] = Math.floor(time / 1000);
            $scope.commonSetAPIData.value['time-zone'] = $scope.deviceAdvanceSettingModals.das_clock_setting['time-zone'];
            commonSetHTTPService($scope.commonSetAPIData, 'Clock Configured successfully.');
        };

        $scope.getDoorListAdvanceSetting = function () {
            $http({
                    url: baseURL + 'door/list-door-for-deviceid?deviceId=' + $scope.device_id,
                    method: 'GET',
                    dataType: 'JSON',
                    headers: {
                        "Authorization": $cookies.get("token"),
                        "Content-type": "application/json"
                    }
                })
                .success(function (response) {
                    if (response.status == true) {
                        $scope.doorListAdvanceSetting = response.data;
                    } else {}
                })
                .error(function (data, status, headers, config) {

                });
        };

        $scope.setLatchCode = function () {
            $scope.commonSetAPIData.module = "latch-code";
            $scope.commonSetAPIData.type = "adv";
            $scope.commonSetAPIData.value['latch-code'] = $scope.deviceAdvanceSettingModals.das_latch_code['latch-code']
            $scope.commonSetAPIData.value['access-gates'] = $scope.deviceAdvanceSettingModals.das_latch_code['access-gates'];
            commonSetHTTPService($scope.commonSetAPIData, 'Clock Configured successfully.');
        };
        $scope.setDiagnostics = function () {
            var time = createTimeStamp($scope.advanceDiagRealTime.date, $scope.advanceDiagRealTime.time);
            $scope.commonSetAPIData.module = "diagnostics";
            $scope.commonSetAPIData.type = "adv";
            $scope.commonSetAPIData.value['real-time-clock'] = Math.floor(time / 1000);
            $scope.commonSetAPIData.value['start-time'] = Math.floor(((new Date($scope.advanceDiagRealTime.startTime)).getTime()) / 1000);
            $scope.commonSetAPIData.value['end-time'] = Math.floor(((new Date($scope.advanceDiagRealTime.endTime)).getTime()) / 1000);
            $scope.commonSetAPIData.value['description'] = $scope.deviceAdvanceSettingModals.das_diagonastic['description'];
            commonSetHTTPService($scope.commonSetAPIData, 'Diagnostics Configured successfully.');
        };

        // $scope.restrictLimit = function (e,min,max) {
        //         e.preventDefault();
        // }
    });