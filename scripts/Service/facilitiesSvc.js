'use strict';

app
    .factory('facilitiesSvc', ['toaster', 'utilitySvc', 'appConstants', '$rootScope', function (toaster, utilitySvc, appConstants, $rootScope) {

        var facilitiesSvcResp = this;

        facilitiesSvcResp.addfacility = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                }
                else {
                    var n = [];
                    $.each(succResponse.error, function (index, value) {
                        n[index] = value.property.split("request.body.")[1].replace(/_/g, ' ')[0].toUpperCase() + value.property.split("request.body.")[1].replace(/_/g, ' ').slice(1);
                        $.each(value.messages, function (ind, value) {
                            n[index] += " " + value
                        })
                    });
                    succResponse.msg = n.join(", ");
                    toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
                    cb(succResponse);
                }
            });
        };

        facilitiesSvcResp.searchfacility = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                }
                else {
                    toaster.clear('*');
                    toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
                    cb(succResponse);
                }
            });
        };

        facilitiesSvcResp.facility_Init = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                }
                else {
                    // if (succResponse.msg != "No_Record_Found")
                    // toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
                    cb(succResponse);
                }
            });
        };

        facilitiesSvcResp.getFacilityViewDetails = function (url, method, params, data, cb) {
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

        facilitiesSvcResp.getListMasterDevice = function (url, method, params, data, cb) {
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

        facilitiesSvcResp.saveFacilityDevice = function (url, method, params, data, cb) {
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

        facilitiesSvcResp.edit_facility = function (url, method, params, data, cb) {
            utilitySvc.callHttpService(url, method, params, data, function (succResponse) {
                if (succResponse.status) {
                    cb(succResponse);
                }
                else {
                    var n = [];
                    var arr = succResponse.error;
                    if (arr != null) {
                        $.each(arr, function (index, value) {
                            n[index] = value.property.split("request.body.")[1].replace(/_/g, ' ')[0].toUpperCase() + value.property.split("request.body.")[1].replace(/_/g, ' ').slice(1);
                            $.each(value.messages, function (ind, value) {
                                n[index] += " " + value
                            })
                        });
                        succResponse.msg = n.join(", ");
                        toaster.pop(appConstants.error, succResponse.msg);
                        cb(succResponse);
                    }
                }
            });
        };

        facilitiesSvcResp.deleteFacility = function (url, method, params, data, cb) {
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

        facilitiesSvcResp.uploadFacilityPic = function (url, method, params, data, cb) {
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

        return facilitiesSvcResp;
    }]);