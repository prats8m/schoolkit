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
                    toaster.pop(appConstants.oops,succResponse.msg);
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
                    toaster.pop(appConstants.oops,succResponse.msg);
                    cb(succResponse);
                }
            });
        };

        return profileSettingsSvcResp;
    }]);