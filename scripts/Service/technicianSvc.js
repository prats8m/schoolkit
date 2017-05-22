'use strict';

app
    .factory('technicianSvc',['toaster','utilitySvc','appConstants','$rootScope',function (toaster,utilitySvc,appConstants,$rootScope) {

        var technicianSvcResp=this;

        technicianSvcResp.getTechnicians=function(url,method,params,data,cb) {
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

        technicianSvcResp.addTechnicianSubmit=function(url,method,params,data,cb) {
            data.expiration_date = utilitySvc.convertDateToMilliecondTimeStamp(new Date(data.expiration_date))/1000;
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

        technicianSvcResp.getTechnician=function(url,method,params,data,cb) {
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

        technicianSvcResp.deleteTechnician=function(url,method,params,data,cb) {
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

        return technicianSvcResp;
    }]);