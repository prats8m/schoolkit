'use strict';

app
    .factory('dashboardSvc', ['toaster', 'utilitySvc', 'appConstants', '$rootScope', function (toaster, utilitySvc, appConstants, $rootScope) {

        var dashboardSvcResp = this;

        dashboardSvcResp.getDashboardData = function (url, method, params, data, cb) {
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

        dashboardSvcResp.getShortCutList = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                }
                else {
                    //  toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
                    cb(succResponse);
                }
            });
        };

        dashboardSvcResp.addOrUpdateShortcuts = function (url, method, params, data, cb) {
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

        dashboardSvcResp.submitSignUpForm = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                } else {
                    toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
                    cb(succResponse);
                }
            });
        };

        dashboardSvcResp.getHeaderFacilityList = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                } else {
                    toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
                    cb(succResponse);
                }
            });
        };

        dashboardSvcResp.getFacilityName = function (url, method, params, data, cb) {
            console.log(utilitySvc.getCurrentFacility());
            if(utilitySvc.getCurrentFacility() == ''){
                var responceData = {"status":false,"msg":"Success","data":{"facility_id":0,"facility_name":"CRYSTAL COVE","facility_location":"NEWPORT COAST"},"error":null};
                cb(responceData);
            }else{
                var url = url + utilitySvc.getCurrentFacility();
                utilitySvc.callHttpService(url , method, params, data, function (succResponse) {
                    if (succResponse.status) {
                        cb(succResponse);
                    } else {
                        toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
                        cb(succResponse);
                    }
                });
            }
        };

        return dashboardSvcResp;
    }]);