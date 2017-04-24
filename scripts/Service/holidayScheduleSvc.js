'use strict';

app
    .factory('HolidayScheduleSvc',['toaster','utilitySvc','appConstants','$rootScope',function (toaster,utilitySvc,appConstants,$rootScope) {

        var HolidayScheduleSvcResp=this;

        HolidayScheduleSvcResp.addEditHolidaySchedule=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    cb(succResponse);
                }
            });
        };

        HolidayScheduleSvcResp.dashboardInit=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    cb(succResponse);
                }
            });
        };

        HolidayScheduleSvcResp.getHolidayScheduleList=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    for(var key in succResponse.data){
                        if(succResponse.data[key].hs_start_date)
                            succResponse.data[key].hs_start_date=utilitySvc.getDateTimeFromTimeStamp(succResponse.data[key].hs_start_date*1000);
                        if(succResponse.data[key].hs_end_date)
                            succResponse.data[key].hs_end_date=utilitySvc.getDateTimeFromTimeStamp(succResponse.data[key].hs_end_date*1000);
                        if(succResponse.data[key].hs_expiration)
                            succResponse.data[key].hs_expiration=utilitySvc.getDateTimeFromTimeStamp(succResponse.data[key].hs_expiration*1000);
                        if(succResponse.data[key].hs_created_on)
                            succResponse.data[key].hs_created_on=utilitySvc.getDateTimeFromTimeStamp(succResponse.data[key].hs_created_on*1000);
                    }
                    cb(succResponse);
                }
                else {
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    cb(succResponse);
                }
            });
        };

        HolidayScheduleSvcResp.getSelectedHolidayScheduleDetail=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    if(succResponse.data){
                        if(succResponse.data.hs_start_date)
                            succResponse.data.hs_start_date=utilitySvc.getDateTimeFromTimeStamp(succResponse.data.hs_start_date*1000);
                        if(succResponse.data.hs_end_date)
                            succResponse.data.hs_end_date=utilitySvc.getDateTimeFromTimeStamp(succResponse.data.hs_end_date*1000);
                        if(succResponse.data.hs_expiration)
                            succResponse.data.hs_expiration=utilitySvc.getDateTimeFromTimeStamp(succResponse.data.hs_expiration*1000);
                        if(succResponse.data.hs_created_on)
                            succResponse.data.hs_created_on=utilitySvc.getDateTimeFromTimeStamp(succResponse.data.hs_created_on*1000);
                    }
                    cb(succResponse);
                }
                else {
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    cb(succResponse);
                }
            });
        };

        HolidayScheduleSvcResp.deleteHolidaySchedule=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    cb(succResponse);
                }
            });
        };


        return HolidayScheduleSvcResp;
    }]);