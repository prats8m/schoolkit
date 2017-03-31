'use strict';

app
    .controller('DeviceSettingController', function ($scope, $mdDialog, $http, $cookies, arrayPushService, $location, toaster, baseURL, $timeout, $stateParams, dataService, $rootScope) {
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

        function commonSetAPIDataObject() {
            return {
                device_id: $scope.device_id,
                module: "",
                type: "",
                value: {}
            };
            // return commonSetAPIData;
        }

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
                        $scope.deviceGeneralSettingModals.dgs_camera['video-recording-access'] = $scope.parseStringArr($scope.deviceGeneralSettingModals.dgs_camera['video-recording-access']);
                        $scope.deviceGeneralSettingModals.dgs_camera['picture-snapshot-access']=$scope.parseStringArr($scope.deviceGeneralSettingModals.dgs_camera['picture-snapshot-access']);

                    } else {

                    }
                }).error(function () {

                });
        };

        $scope.setAccessGrantKey = function () {
            var data = new commonSetAPIDataObject();
            data.module = "access-grant-key";
            data.type = "gen";
            data.value["access-grant-key"] = $scope.grantAccessKey.value;
            commonSetHTTPService(data, 'Access Granted key changed successfully.');
        };

        $scope.setCameraSettings = function () {
            var data = new commonSetAPIDataObject();
            data.module = "camera-setup";
            data.type = "gen";
            var vedioArr=[];

            data.value["picture-snapshot-access"] = $scope.parseIntArr($scope.deviceGeneralSettingModals.dgs_camera['picture-snapshot-access']);
            data.value["snapshot-status"] = $scope.deviceGeneralSettingModals.dgs_camera['snapshot-status'];
            data.value["video-recording-access"] = $scope.parseIntArr($scope.deviceGeneralSettingModals.dgs_camera['video-recording-access']);
            data.value["recording-status"] = $scope.deviceGeneralSettingModals.dgs_camera['recording-status'];
            commonSetHTTPService(data, 'Camera Configured successfully.');
        }; 

        $scope.parseIntArr=function(data){
            var response=[];
            for(var i=0;i<data.length;i++){
                response[i]=parseInt(data[i])
            }
            return response;
        }
        $scope.parseStringArr=function(data){
            var response=[];
            for(var i=0;i<data.length;i++){
                response[i]=data[i].toString();
            }
            return response;
        }

        $scope.setTalkTime = function () {
            var data = new commonSetAPIDataObject();
            data.module = "talk-time-setup";
            data.type = "gen";
            data.value["talk-time"] = $scope.deviceGeneralSettingModals.dgs_talk_time['talk-time'];
            commonSetHTTPService(data, 'Talk Time Configured successfully.');
        };

        $scope.setLEDConfiguration = function () {
            var data = new commonSetAPIDataObject();
            data.module = "led-setup";
            data.type = "gen";
            data.value['keypad-setup'] = parseInt($scope.deviceGeneralSettingModals.dgs_led['keypad-setup']);
            data.value['keypad-brightness'] = $scope.deviceGeneralSettingModals.dgs_led['keypad-brightness'];
            data.value['courtesy-light-setup'] = parseInt($scope.deviceGeneralSettingModals.dgs_led['courtesy-light-setup']);
            data.value['courtesy-brightness'] = $scope.deviceGeneralSettingModals.dgs_led['courtesy-brightness'];
            console.log(data);
            commonSetHTTPService(data, 'LED Configured successfully.');
        };

        $scope.setSpeakerMicrophone = function () {
            var data = new commonSetAPIDataObject();
            data.module = "speaker-microphone-setup";
            data.type = "gen";
            data.value['speaker-beeper'] = parseInt($scope.deviceGeneralSettingModals.dgs_speaker['speaker-beeper']);
            data.value['microphone-beeper'] = parseInt($scope.deviceGeneralSettingModals.dgs_speaker['microphone-beeper']);
            data.value['speaker-volume'] = $scope.deviceGeneralSettingModals.dgs_speaker['speaker-volume'];
            data.value['microphone-sensitivity'] = $scope.deviceGeneralSettingModals.dgs_speaker['microphone-sensitivity'];
            commonSetHTTPService(data, 'Speaker and Microphone configured successfully.');
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
            var data = new commonSetAPIDataObject();
            data.module = "lockout";
            data.type = "gen";
            data.value['lockout-mode'] = $scope.deviceGeneralSettingModals.dgs_lockout_mode['lockout-mode'];
            data.value['max-tries'] = $scope.deviceGeneralSettingModals.dgs_lockout_mode['max-tries'];
            data.value['lockout-period'] = $scope.deviceGeneralSettingModals.dgs_lockout_mode['lockout-period'];
            commonSetHTTPService(data, 'Lockout Mode Configured successfully.');
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
            var data = new commonSetAPIDataObject();
            data.module = "master-code";
            data.type = "adv";
            data.value['master-code'] = $scope.deviceAdvanceSettingModals.das_master_code['master-code'];
            commonSetHTTPService(data, 'Master Code Configured successfully.');
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
            var data = new commonSetAPIDataObject();
            var time = createTimeStamp($scope.advanceClockSetting.date, $scope.advanceClockSetting.time);
            data.module = "clock-settings";
            data.type = "adv";
            data.value['real-time-clock'] = Math.floor(time / 1000);
            data.value['time-zone'] = $scope.deviceAdvanceSettingModals.das_clock_setting['time-zone'];
            commonSetHTTPService(data, 'Clock Configured successfully.');
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
            var data = new commonSetAPIDataObject();
            data.module = "latch-code";
            data.type = "adv";
            data.value['latch-code'] = $scope.deviceAdvanceSettingModals.das_latch_code['latch-code']
            data.value['access-gates'] = $scope.deviceAdvanceSettingModals.das_latch_code['access-gates'];
            commonSetHTTPService(data, 'Clock Configured successfully.');
        };
        $scope.setDiagnostics = function () {
            var data = new commonSetAPIDataObject();
            var time = createTimeStamp($scope.advanceDiagRealTime.date, $scope.advanceDiagRealTime.time);
            data.module = "diagnostics";
            data.type = "adv";
            data.value['real-time-clock'] = Math.floor(time / 1000);
            data.value['start-time'] = Math.floor(((new Date($scope.advanceDiagRealTime.startTime)).getTime()) / 1000);
            data.value['end-time'] = Math.floor(((new Date($scope.advanceDiagRealTime.endTime)).getTime()) / 1000);
            data.value['description'] = $scope.deviceAdvanceSettingModals.das_diagonastic['description'];
            commonSetHTTPService(data, 'Diagnostics Configured successfully.');
        };

        $scope.setCallButtonSetup = function () {
            var data = new commonSetAPIDataObject();
            var time = createTimeStamp($scope.advanceDiagRealTime.date, $scope.advanceDiagRealTime.time);
            data.module = "call-button-setup";
            data.type = "gen";
            data.value['call-button'] = $scope.deviceGeneralSettingModals.dgs_call_button['call-button'];
            commonSetHTTPService(data, 'Call Button Setup Configured successfully.');
        };

        $scope.getReplayDoorList = function () {
            $http({
                    url: baseURL + 'device/get-device-relay?device_id=' + $scope.device_id,
                    method: 'GET',
                    dataType: 'JSON',
                    headers: {
                        "Authorization": $cookies.get("token"),
                        "Content-type": "application/json"
                    }
                })
                .success(function (response) {
                    if (response.status == true) {
                        $scope.relayNDoorGenSetting = response.data;
                    } else {}
                })
                .error(function (data, status, headers, config) {

                });
        };

        $scope.setRelayDoorSetup = function () {
            var data = {
                device_id: $scope.device_id,
                relays: []
            }
            for (var i = 0; i < $scope.relayNDoorGenSetting.length; i++) {
                var singleObject = {};
                singleObject.relay = $scope.relayNDoorGenSetting[i].drd_relay;
                singleObject.door_id = $scope.relayNDoorGenSetting[i].drd_door_id;
                singleObject.status = $scope.relayNDoorGenSetting[i].drd_status;
                singleObject.strike_time = $scope.relayNDoorGenSetting[i].strike_time;
                data.relays.push(singleObject);
            }
            $http({
                    url: baseURL + 'door/assign-device',
                    method: 'PUT',
                    dataType: 'JSON',
                    data: data,
                    headers: {
                        "Authorization": $cookies.get("token"),
                        "Content-type": "application/json"
                    }
                })
                .success(function (response) {
                    if (response.status == true) {
                        toaster.pop('success', "Relay & Door Setup configured successfully");
                    }
                })
                .error(function (data, status, headers, config) {

                });
        }


        $scope.dashboardInit = function(){
        $http({
            url: baseURL + 'user/dashboard',
            method: 'GET',
            dataType : 'JSON',
            headers: {
                "Authorization": $cookies.get("token"),
                "Content-type": "application/json"
            }
        })
        .success(function(response) {
            if(response.status == true){
                $rootScope.dashboardData = response.data;
            }else{
                if(response.msg == 'Invalid_Token'){
                    toaster.pop('error','Session Expired');
                    $cookies.remove("token");
                    $location.path('/core/login');return false;
                }
            }
        })
        .error(function (data, status, headers, config) {
            
        });
    }
        $scope.dashboardInit();
    });