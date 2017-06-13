'use strict';

app
    .factory('doorsSvc', ['toaster', 'utilitySvc', 'appConstants', '$rootScope', function (toaster, utilitySvc, appConstants, $rootScope) {

        var doorsSvcResp = this;

        doorsSvcResp.submitCreateDoorGroup = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                }
                else {
                    succResponse.msg = succResponse.msg.replace(/_/g, ' ');
                    toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
                    cb(succResponse);
                }
            });
        };

        doorsSvcResp.getDoorGroupList = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                }
                else {
                    // if (succResponse.msg != 'No_Record_Found')
                    // toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
                    cb(succResponse);
                }
            });
        };

        doorsSvcResp.getDoorsList = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                }
                else {
                    if (succResponse.msg != 'No_Record_Found')
                        toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
                    cb(succResponse);
                }
            });
        };

        doorsSvcResp.doorGroupSubmit = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    succResponse.msg = succResponse.msg.replace(/_/g, " ");
                    cb(succResponse);
                }
                else {
                    succResponse.msg = succResponse.msg.replace(/_/g, " ");
                    toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
                    cb(succResponse);
                }
            });
        };

        doorsSvcResp.doorGroupDelete = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                }
                else {
                    succResponse.msg = succResponse.msg.replace(/_/g, " ");
                    toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
                    cb(succResponse);
                }
            });
        };

        doorsSvcResp.deletedoors = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                }
                else {
                    succResponse.msg = succResponse.msg.replace(/_/g, " ");
                    toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
                    cb(succResponse);
                }
            });
        };

        doorsSvcResp.facilityInit = function (url, method, params, data, cb) {
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

        doorsSvcResp.submitAddDoor = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                }
                else {
                    succResponse.msg = succResponse.msg.replace(/_/g, " ");
                    toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
                    cb(succResponse);
                }
            });
        };

        doorsSvcResp.dashboardInit = function (url, method, params, data, cb) {
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

        doorsSvcResp.createDoor = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                }
                else {
                    succResponse.msg = succResponse.msg.replace(/_/g, " ");
                    toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
                    cb(succResponse);
                }
            });
        };

        doorsSvcResp.searchFunction = function (url, method, params, data, cb) {
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

        doorsSvcResp.listDoors = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                }
                else {
                    if (succResponse.msg != 'No_Record_Found')
                        toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
                    cb(succResponse);
                }
            });
        };

        doorsSvcResp.doorInit = function (url, method, params, data, cb) {
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


        doorsSvcResp.editDoordata = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    succResponse.msg = succResponse.msg.replace(/_/g, " ");
                    cb(succResponse);
                }
                else {
                    toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
                    cb(succResponse);
                }
            });
        };



        return doorsSvcResp;
    }]);