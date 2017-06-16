'use strict';

app
    .factory('cameraDVRSvc', ['toaster', 'utilitySvc', 'appConstants', '$rootScope', function (toaster, utilitySvc, appConstants, $rootScope) {

        var cameraDVRSvcResp = this;

        cameraDVRSvcResp.dashboardInit = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                }
                else {
                    toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
                    cb(succResponse);
                }
            });
        };

        cameraDVRSvcResp.cameraInit = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                }
                else {
                    if (succResponse.msg != "No_Record_Found")
                        toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
                    cb(succResponse);
                }
            });
        };

        cameraDVRSvcResp.getCameraGroups = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                }
                else {
                    cb(succResponse);
                }
            });
        };

        cameraDVRSvcResp.getfacilites = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                }
                else {
                 //   toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
                    cb(succResponse);
                }
            });
        };

        cameraDVRSvcResp.deleteCameraGroup = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                }
                else {
                    toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
                    cb(succResponse);
                }
            });
        };

        cameraDVRSvcResp.getCamerasOnSearchItems = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                }
                else {
                    toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
                    cb(succResponse);
                }
            });
        };

        cameraDVRSvcResp.getRecordedFeedVideosByCameraID = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                }
                else {
                    toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
                    cb(succResponse);
                }
            });
        };

        cameraDVRSvcResp.addCameraGroup = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                }
                else {
                    toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
                    cb(succResponse);
                }
            });
        };


        return cameraDVRSvcResp;
    }]);