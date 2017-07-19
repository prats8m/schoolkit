'use strict';

app
    .controller('DeviceSettingController', function ($scope, $mdDialog, $http, $cookies, arrayPushService, $location, toaster, baseURL, $timeout, $stateParams, dataService, $rootScope, appConstants, devicesSvc) {
        $scope.page = {
            title: appConstants.settings,
            subtitle: appConstants.empty
        };
        $scope.usTimeZonesForFacility = appConstants.availableTimeZoneOptions;
        console.log($scope.usTimeZonesForFacility);
        $scope.deviceGeneralSettingModals = {};
        $scope.grantAccessKey = {
            value: 0
        };

        $scope.device_id = parseInt($stateParams.device_id);
        $scope.commonGetAPIData = {
            device_id: $scope.device_id,
            type: appConstants.empty
        };

        function commonSetAPIDataObject() {
            return {
                device_id: $scope.device_id,
                module: appConstants.empty,
                type: appConstants.empty,
                value: {}
            };
            // return commonSetAPIData;
        }

        var commonSetHTTPService = function (data, msg) {
            devicesSvc.commonSetHTTPService(appConstants.deviceaddsettings, appConstants.postMethod, {}, data, function (succResponse) {
                if (succResponse.status) {
                    toaster.pop(appConstants.success, msg);
                }
            });
        };

        $scope.getGeneralSettings = function () {
            $scope.commonGetAPIData.type = appConstants.deviceSettings.commonGetAPIData.type;
            devicesSvc.getGeneralSettings(appConstants.devicegetsettings + '?device_id=' + $scope.commonGetAPIData.device_id + '&type=' + $scope.commonGetAPIData.type, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.deviceGeneralSettingModals = succResponse.data;
                    $scope.wiegandSetting = $scope.deviceGeneralSettingModals.dgs_wiegand_setting;
                    $scope.grantAccessKey.value = succResponse.data.dgs_access_granted_key[appConstants.deviceSettings.accessgrantkey];
                    $scope.lockoutMode = succResponse.data.dgs_lockout_mode[appConstants.deviceSettings.lockoutmode];
                    $scope.deviceGeneralSettingModals.dgs_camera[appConstants.deviceSettings.videorecordingaccess] = $scope.parseStringArr($scope.deviceGeneralSettingModals.dgs_camera[appConstants.deviceSettings.videorecordingaccess]);
                    $scope.deviceGeneralSettingModals.dgs_camera[appConstants.deviceSettings.picturesnapshotsaccess] = $scope.parseStringArr($scope.deviceGeneralSettingModals.dgs_camera[appConstants.deviceSettings.picturesnapshotsaccess]);
                    $scope.welcomeMessage = succResponse.data.dgs_welcome_setting["welcome-message-key"];
                    $scope.callsettings = succResponse.data.dgs_call_setting["voip-call-setting-key"];
                }
            });
        };

        $scope.setAccessGrantKey = function () {
            var data = new commonSetAPIDataObject();
            data.module = appConstants.deviceSettings.accessgrantkey;
            data.type = appConstants.deviceSettings.commonGetAPIData.type;
            data.value[appConstants.deviceSettings.accessgrantkey] = $scope.grantAccessKey.value;
            commonSetHTTPService(data, appConstants._successaccessgrantkeychangesmessage);
        };

        $scope.setCameraSettings = function () {
            var data = new commonSetAPIDataObject();
            data.module = appConstants.deviceSettings.camerasetup;
            data.type = appConstants.deviceSettings.commonGetAPIData.type;
            var vedioArr = [];

            data.value[appConstants.deviceSettings.picturesnapshotsaccess] = $scope.parseIntArr($scope.deviceGeneralSettingModals.dgs_camera[appConstants.deviceSettings.picturesnapshotsaccess]);
            data.value[appConstants.deviceSettings.snapshotsstatus] = $scope.deviceGeneralSettingModals.dgs_camera[appConstants.deviceSettings.snapshotsstatus];
            data.value[appConstants.deviceSettings.videorecordingaccess] = $scope.parseIntArr($scope.deviceGeneralSettingModals.dgs_camera[appConstants.deviceSettings.videorecordingaccess]);
            data.value[appConstants.deviceSettings.recordingstatus] = $scope.deviceGeneralSettingModals.dgs_camera[appConstants.deviceSettings.recordingstatus];
            commonSetHTTPService(data, appConstants._successCameraConfigured);
        };
        $scope.setWelcomeMessage = function (msg) {
            var data = new commonSetAPIDataObject();
            data.module = appConstants.deviceSettings.welcomesetting;
            data.type = appConstants.deviceSettings.commonGetAPIData.type;
            data.value[appConstants.deviceSettings.welcomemessagekey] = msg;
            commonSetHTTPService(data, 'Welcome Message Configured');
        }
        $scope.parseIntArr = function (data) {
            var response = [];
            for (var i = 0; i < data.length; i++) {
                response[i] = parseInt(data[i])
            }
            return response;
        };
        $scope.parseStringArr = function (data) {
            var response = [];
            for (var i = 0; i < data.length; i++) {
                response[i] = data[i].toString();
            }
            return response;
        };

        $scope.setTalkTime = function () {
            var data = new commonSetAPIDataObject();
            data.module = appConstants.deviceSettings.talktimesetup;
            data.type = appConstants.deviceSettings.commonGetAPIData.type;
            data.value[appConstants.deviceSettings.talktime] = $scope.deviceGeneralSettingModals.dgs_talk_time[appConstants.deviceSettings.talktime];
            commonSetHTTPService(data, appConstants._successTaltimeConfigured);
        };

        $scope.setLEDConfiguration = function () {
            var data = new commonSetAPIDataObject();
            data.module = appConstants.deviceSettings.ledsetup;
            data.type = appConstants.deviceSettings.commonGetAPIData.type;
            data.value[appConstants.deviceSettings.keypadsetup] = parseInt($scope.deviceGeneralSettingModals.dgs_led[appConstants.deviceSettings.keypadsetup]);
            data.value[appConstants.deviceSettings.keypadbrightness] = $scope.deviceGeneralSettingModals.dgs_led[appConstants.deviceSettings.keypadbrightness];
            data.value[appConstants.deviceSettings.courtesylightsetup] = parseInt($scope.deviceGeneralSettingModals.dgs_led[appConstants.deviceSettings.courtesylightsetup]);
            data.value[appConstants.deviceSettings.courtesybrightness] = $scope.deviceGeneralSettingModals.dgs_led[appConstants.deviceSettings.courtesybrightness];
            console.log(data);
            commonSetHTTPService(data, appConstants._successledConfigured);
        };

        $scope.setSpeakerMicrophone = function () {
            var data = new commonSetAPIDataObject();
            data.module = appConstants.deviceSettings.speakermicrophonesetup;
            data.type = appConstants.deviceSettings.commonGetAPIData.type;
            data.value[appConstants.deviceSettings.speakerbeeper] = parseInt($scope.deviceGeneralSettingModals.dgs_speaker[appConstants.deviceSettings.speakerbeeper]);
            // data.value[appConstants.deviceSettings.microphonebeeper] = parseInt($scope.deviceGeneralSettingModals.dgs_speaker[appConstants.deviceSettings.microphonebeeper]);
            data.value[appConstants.deviceSettings.speakervolume] = $scope.deviceGeneralSettingModals.dgs_speaker[appConstants.deviceSettings.speakervolume];
            data.value[appConstants.deviceSettings.microphonesensitivity] = $scope.deviceGeneralSettingModals.dgs_speaker[appConstants.deviceSettings.microphonesensitivity];
            commonSetHTTPService(data, appConstants._successspeakerandmicrophoneconfigured);
        };

        $scope.createLockoutModeArray = function (data) {
            var idx = $scope.deviceGeneralSettingModals.dgs_lockout_mode[appConstants.deviceSettings.lockoutmode].indexOf(data);
            // is currently selected
            if (idx > -1) {
                $scope.deviceGeneralSettingModals.dgs_lockout_mode[appConstants.deviceSettings.lockoutmode].splice(idx, 1);
            } else {
                $scope.deviceGeneralSettingModals.dgs_lockout_mode[appConstants.deviceSettings.lockoutmode].push(data);
            }
            console.log($scope.deviceGeneralSettingModals.dgs_lockout_mode[appConstants.deviceSettings.lockoutmode]);
        };

        $scope.setLockoutMode = function () {
            var data = new commonSetAPIDataObject();
            data.module = appConstants.deviceSettings.lockout;
            data.type = appConstants.deviceSettings.commonGetAPIData.type;
            data.value[appConstants.deviceSettings.lockoutmode] = $scope.deviceGeneralSettingModals.dgs_lockout_mode[appConstants.deviceSettings.lockoutmode];
            data.value[appConstants.deviceSettings.maxtries] = $scope.deviceGeneralSettingModals.dgs_lockout_mode[appConstants.deviceSettings.maxtries];
            data.value[appConstants.deviceSettings.lockoutperiod] = $scope.deviceGeneralSettingModals.dgs_lockout_mode[appConstants.deviceSettings.lockoutperiod];
            commonSetHTTPService(data, appConstants._successlockoutmodeconfigured);
        };
       
        $scope.advanceClockSetting = {
            date: appConstants.empty,
            time: new Date()
        };
        $scope.advanceDiagRealTime = {
            date: appConstants.empty,
            time: new Date(),
            startTime: new Date(),
            endTime: new Date()
        };
        $scope.setMotionDetectionSettings = function () {
            var data = new commonSetAPIDataObject();
            data.module = appConstants.deviceSettings.motiondetection;
            data.type = appConstants.deviceSettings.commonGetAPIData.typeadv;
            data.value[appConstants.deviceSettings.motiondetection] = parseInt($scope.deviceAdvanceSettingModals.das_motion_detection['motion-detection']);
            commonSetHTTPService(data, appConstants._successmotiondetectionmodeconfigured);
        }
        $scope.getAdvancedSettings = function () {
            $scope.commonGetAPIData.type = appConstants.deviceSettings.commonGetAPIData.typeadv;
            devicesSvc.getAdvancedSettings(appConstants.devicegetsettings + '?device_id=' + $scope.commonGetAPIData.device_id + '&type=' + $scope.commonGetAPIData.type, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.deviceAdvanceSettingModals = succResponse.data;
                    if (succResponse.data.das_clock_setting[appConstants.deviceSettings.realtimeclock] != 0)
                        $scope.advanceClockSetting.time = new Date(succResponse.data.das_clock_setting[appConstants.deviceSettings.realtimeclock] * 1000);
                    $scope.advanceClockSetting.date = decodeTimeStamp($scope.advanceClockSetting.time);
                    if (succResponse.data.das_diagonastic[appConstants.deviceSettings.realtimeclock] != 0)
                        $scope.advanceDiagRealTime.time = new Date(succResponse.data.das_diagonastic[appConstants.deviceSettings.realtimeclock] * 1000);
                    $scope.advanceDiagRealTime.date = decodeTimeStamp($scope.advanceDiagRealTime.time);
                    if (succResponse.data.das_diagonastic[appConstants.deviceSettings.starttime] != 0)
                        $scope.advanceDiagRealTime.startTime = new Date(succResponse.data.das_diagonastic[appConstants.deviceSettings.starttime] * 1000);
                    if (succResponse.data.das_diagonastic[appConstants.deviceSettings.endtime] != 0)
                        $scope.advanceDiagRealTime.endTime = new Date(succResponse.data.das_diagonastic[appConstants.deviceSettings.endtime] * 1000);
                }
            });
        };

        $scope.setMasterCode = function () {
            var data = new commonSetAPIDataObject();
            data.module = appConstants.deviceSettings.mastercode;
            data.type = appConstants.deviceSettings.commonGetAPIData.typeadv;
            data.value[appConstants.deviceSettings.mastercode] = $scope.deviceAdvanceSettingModals.das_master_code[appConstants.deviceSettings.mastercode];
            commonSetHTTPService(data, appConstants._successmastercodeconfigured);
        };
        var decodeTimeStamp = function (stamp) {
            var temp = stamp;
            return temp.getDate() + "/" + (temp.getMonth() + 1) + "/" + temp.getFullYear();
        };
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
            //var time = createTimeStamp($scope.advanceClockSetting.date, $scope.advanceClockSetting.time);
            data.module = appConstants.deviceSettings.clocksettings;
            data.type = appConstants.deviceSettings.commonGetAPIData.typeadv;
            // data.value[appConstants.deviceSettings.realtimeclock] = Math.floor(time / 1000);
            data.value[appConstants.deviceSettings.timezone] = $scope.deviceAdvanceSettingModals.das_clock_setting["timezone"];
            commonSetHTTPService(data, appConstants._successclockconfigured);
        };

        $scope.getDoorListAdvanceSetting = function () {
            devicesSvc.getDoorListAdvanceSetting(appConstants.doorlistfordeviceid + '?deviceId=' + $scope.device_id, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.doorListAdvanceSetting = succResponse.data;
                }
            });
        };

        $scope.setLatchCode = function () {
            var data = new commonSetAPIDataObject();
            data.module = appConstants.deviceSettings.latchcode;
            data.type = appConstants.deviceSettings.commonGetAPIData.typeadv;
            data.value[appConstants.deviceSettings.latchcode] = $scope.deviceAdvanceSettingModals.das_latch_code[appConstants.deviceSettings.latchcode];
            data.value[appConstants.deviceSettings.accessgates] = $scope.deviceAdvanceSettingModals.das_latch_code[appConstants.deviceSettings.accessgates];
            commonSetHTTPService(data, appConstants._successlatchcodeconfigured);
        };

        $scope.setDiagnostics = function () {
            var data = new commonSetAPIDataObject();
            var time = createTimeStamp($scope.advanceDiagRealTime.date, $scope.advanceDiagRealTime.time);
            data.module = appConstants.deviceSettings.diagnostics;
            data.type = appConstants.deviceSettings.commonGetAPIData.typeadv;
            data.value[appConstants.deviceSettings.realtimeclock] = Math.floor(time / 1000);
            data.value[appConstants.deviceSettings.starttime] = Math.floor(((new Date($scope.advanceDiagRealTime.startTime)).getTime()) / 1000);
            data.value[appConstants.deviceSettings.endtime] = Math.floor(((new Date($scope.advanceDiagRealTime.endTime)).getTime()) / 1000);
            data.value[appConstants.deviceSettings.description] = $scope.deviceAdvanceSettingModals.das_diagonastic[appConstants.deviceSettings.description];
            commonSetHTTPService(data, appConstants._successdiagnosticsconfigured);
        };

        $scope.setWiegandSetting = function () {
            var data = new commonSetAPIDataObject();
            var time = createTimeStamp($scope.advanceDiagRealTime.date, $scope.advanceDiagRealTime.time);
            data.module = appConstants.deviceSettings.wiegandSetting;
            data.type = appConstants.deviceSettings.commonGetAPIData.type;
            var singleObject = {};
            for (var i = 0; i < Object.keys($scope.wiegandSetting).length; i++) {
                singleObject[i] = {
                    'wiegand-code': $scope.wiegandSetting[i]['wiegand-code'],
                    'wiegand-device': $scope.wiegandSetting[i]['wiegand-device'],
                    'wiegand-bit': $scope.wiegandSetting[i]['wiegand-bit'],
                    'wiegand-status': $scope.wiegandSetting[i]['wiegand-status'],
                    'wiegand-device-serialno': $scope.wiegandSetting[i]['wiegand-device-serialno']
                };
            }
            data.value = singleObject;

            console.log(singleObject);
            commonSetHTTPService(data, appConstants._successdiagnosticsconfigured);
        };

        $scope.setCallButtonSetup = function () {
            var data = new commonSetAPIDataObject();
            var time = createTimeStamp($scope.advanceDiagRealTime.date, $scope.advanceDiagRealTime.time);
            data.module = appConstants.deviceSettings.callbuttonsetup;
            data.type = appConstants.deviceSettings.commonGetAPIData.type;
            data.value[appConstants.deviceSettings.callbutton] = $scope.deviceGeneralSettingModals.dgs_call_button[appConstants.deviceSettings.callbutton];
            commonSetHTTPService(data, appConstants._successcallbuttonconfigured);
        };

        $scope.getReplayDoorList = function () {
            devicesSvc.getReplayDoorList(appConstants.getdevicerelay + '?device_id=' + $scope.device_id, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.relayNDoorGenSetting = succResponse.data;
                }
            });
        };

        $scope.getWiegandDeviceList = function () {
            devicesSvc.getWiegandDeviceList(appConstants.getWiegandDevice, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.wiegandDevice = succResponse.data;
                }
            });
        };

        $scope.setCallSettings = function (value) {
            if (value == undefined || value == '') {
                return false;
            }
            var data = new commonSetAPIDataObject();
            data.module = appConstants.deviceSettings.callsetting;
            data.type = appConstants.deviceSettings.commonGetAPIData.type;
            data.value[appConstants.deviceSettings.voipcallsettingkey] = parseInt(value);
            commonSetHTTPService(data, 'Call Settings Configured');
        }
        $scope.getAvailablity = function (door_id, drd_id, relayNDoorGenSetting) {
            var temp = false;
            angular.forEach(relayNDoorGenSetting, function (data, index) {
                if (data.drd_id != drd_id) {
                    if (data.drd_door_id == door_id) {
                        temp = true;
                    }
                }
            });
            console.log(temp)
            return temp;
        }
        $scope.setRelayDoorSetup = function () {
            var data = {
                device_id: $scope.device_id,
                relays: []
            };
            for (var i = 0; i < $scope.relayNDoorGenSetting.length; i++) {
                var singleObject = {};
                singleObject.relay = $scope.relayNDoorGenSetting[i].drd_relay;
                singleObject.door_id = $scope.relayNDoorGenSetting[i].drd_door_id;
                singleObject.status = $scope.relayNDoorGenSetting[i].drd_status;
                if (parseInt($scope.relayNDoorGenSetting[i].strike_time) < 500 || parseInt($scope.relayNDoorGenSetting[i].strike_time) > 4500) {
                    $scope.GenericError = "Relay strike time range from 500 to 4500 ms ";
                    return null;
                    break;
                }
                if (($scope.relayNDoorGenSetting[i].drd_door_id != undefined && $scope.relayNDoorGenSetting[i].drd_door_id != '') && ($scope.relayNDoorGenSetting[i].interface_type == undefined || $scope.relayNDoorGenSetting[i].interface_type == '' || $scope.relayNDoorGenSetting[i].interface_type == 0)) {
                    $scope.errorMsg = "please Select an Interface Type";
                    return null;
                    break;
                }
                singleObject.strike_time = $scope.relayNDoorGenSetting[i].strike_time;
                singleObject.interface_type = $scope.relayNDoorGenSetting[i].interface_type
                data.relays.push(singleObject);
            }
            devicesSvc.setRelayDoorSetup(appConstants.doorassigndevice, appConstants.putMethod, {}, data, function (succResponse) {
                if (succResponse.status) {
                    toaster.pop(appConstants.success, appConstants._successrelayanddoorsetupconfigured);
                }
            });
        };

        /* $scope.dashboardInit = function () {

            devicesSvc.dashboardInit(appConstants.userDashboard, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.dashboardData = succResponse.data;
                }
            });
        };
        $scope.dashboardInit(); */
    });