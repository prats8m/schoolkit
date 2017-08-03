'use strict';

app
    .factory('activitiesSvc',['toaster','utilitySvc','appConstants','$rootScope',function (toaster,utilitySvc,appConstants,$rootScope) {

        var activitiesSvcResp=this;

        activitiesSvcResp.getFacilityList=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                   //  toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
                    cb(succResponse);
                }
            });
        };

        activitiesSvcResp.getDoorsList=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                   //  toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
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
                     toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
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
                    if(succResponse.msg != 'No_Records_Found')
                     toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
                    cb(succResponse);
                }
            });
        };
		
		activitiesSvcResp.dashboardInit=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                     toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
                    cb(succResponse);
                }
            });
        };

        activitiesSvcResp.viewActivity=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    if(succResponse.msg != 'No_Records_Found')
                        toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
                    cb(succResponse);
                }
            });
        };

        return activitiesSvcResp;
    }]);