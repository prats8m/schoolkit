'use strict';

app
    .factory('profileSettingsSvc',['toaster','utilitySvc','appConstants',function (toaster,utilitySvc,appConstants) {

        var profileSettingsSvcResp=this;

        profileSettingsSvcResp.dashboardInit=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    toaster.pop(appConstants.oops,succResponse.msg.replace(/_/g,' '));
                    cb(succResponse);
                }
            });
        };

        profileSettingsSvcResp.updateLoggedInUserProfile=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    toaster.pop(appConstants.oops,succResponse.msg.replace(/_/g,' '));
                    cb(succResponse);
                }
            });
        };

        profileSettingsSvcResp.getSecurityQuestion=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    toaster.pop(appConstants.oops,succResponse.msg.replace(/_/g,' '));
                    cb(succResponse);
                }
            });
        };

        profileSettingsSvcResp.changeSecurityQuestion=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    toaster.pop(appConstants.oops,succResponse.msg.replace(/_/g,' '));
                    cb(succResponse);
                }
            });
        };

        profileSettingsSvcResp.changeloggedInuserPassword=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    toaster.pop(appConstants.oops,succResponse.msg.replace(/_/g,' '));
                    cb(succResponse);
                }
            });
        };

        return profileSettingsSvcResp;
    }]);