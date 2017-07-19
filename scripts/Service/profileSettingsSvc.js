'use strict';

app
    .factory('profileSettingsSvc',['toaster','utilitySvc','appConstants','$rootScope',function (toaster,utilitySvc,appConstants,$rootScope) {

        var profileSettingsSvcResp=this;

        profileSettingsSvcResp.dashboardInit=function(url,method,params,data,cb) {
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

        profileSettingsSvcResp.updateLoggedInUserProfile=function(url,method,params,data,cb) {
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

        profileSettingsSvcResp.getSecurityQuestion=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    // toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
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
                     toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
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
                     toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
                    cb(succResponse);
                }
            });
        };

        profileSettingsSvcResp.validateImage = function(file){
            console.log(file);
            var imageTypeObj = ['image/jpeg'];
            if(imageTypeObj.indexOf(file.type) > -1){
                return true;
            }else{
                toaster.pop('error',appConstants.providevalidimagefile);
                return false;
            }
            if(file.size < appConstants.maxprofileimagesize){
                return true;
            }else{
                toaster.pop('error',appConstants.imageistoolarge);
                return false;
            }
            return false;
        }

        return profileSettingsSvcResp;
    }]);