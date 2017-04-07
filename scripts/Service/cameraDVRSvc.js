'use strict';

app
    .factory('cameraDVRSvc',['toaster','utilitySvc','appConstants',function (toaster,utilitySvc,appConstants) {

        var cameraDVRSvcResp=this;

        cameraDVRSvcResp.dashboardInit=function(url,method,params,data,cb) {
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

        cameraDVRSvcResp.cameraInit=function(url,method,params,data,cb) {
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

        cameraDVRSvcResp.getCameraGroups=function(url,method,params,data,cb) {
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

        cameraDVRSvcResp.getfacilites=function(url,method,params,data,cb) {
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

        cameraDVRSvcResp.deleteCameraGroup=function(url,method,params,data,cb) {
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

        cameraDVRSvcResp.getCamerasOnSearchItems=function(url,method,params,data,cb) {
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

        cameraDVRSvcResp.getRecordedFeedVideosByCameraID=function(url,method,params,data,cb) {
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

        cameraDVRSvcResp.addCameraGroup=function(url,method,params,data,cb) {
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


        return cameraDVRSvcResp;
    }]);