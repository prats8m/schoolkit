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
            // data.expiration_date = utilitySvc.convertDateToMilliecondTimeStamp(new Date(data.expiration_date))/1000;
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

        technicianSvcResp.submitTechProfile = function(url,method,params,data,cb){
            console.log(data);
            data.technician_zipcode = data.technician_zipcode.toString();
            var data = {
                first_name:data.technician_first_name,
                last_name:data.technician_last_name,
                email:data.technician_email,
                address:data.technician_address,
                zipcode:data.technician_zipcode,
                phone_number:data.technician_phone,
                status:data.technician_status,
                technician_id:data.technician_id,
                expiration_date:data.expiration_date
            }
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
                    cb(succResponse);
                }
            });
        }

        return technicianSvcResp;
    }]);