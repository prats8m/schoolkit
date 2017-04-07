'use strict';

app
    .factory('activitiesSvc',['toaster','utilitySvc','appConstants',function (toaster,utilitySvc,appConstants) {

        var activitiesSvcResp=this;

        activitiesSvcResp.getFacilityList=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    toaster.pop(appConstants.error,succResponse.msg);
                    cb(succResponse);
                }
            });
        };

        activitiesSvcResp.getDeviceList=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    toaster.pop(appConstants.error,succResponse.msg);
                    cb(succResponse);
                }
            });
        };

        activitiesSvcResp.getEventTypeList=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    toaster.pop(appConstants.error,succResponse.msg);
                    cb(succResponse);
                }
            });
        };
        activitiesSvcResp.eventFetch=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    toaster.pop(appConstants.error,succResponse.msg);
                    cb(succResponse);
                }
            });
        };

        return activitiesSvcResp;
    }]);