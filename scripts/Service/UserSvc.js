'use strict';

app
    .factory('userSvc',['toaster','utilitySvc','appConstants',function (toaster,utilitySvc,appConstants) {

        var userSvcSvcResp=this;

        userSvcSvcResp.uploadProfilePic=function(url,method,params,data,cb) {
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

        userSvcSvcResp.submitUserData=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    var n = [];
                    var arr = succResponse.error;
                    if(arr != null){
                        $.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1) ; $.each(value.messages, function(ind, value){ n[index] += " "+value })});
                        succResponse.msg= n.join(", ");
                    }
                    else{
                        succResponse.msg= succResponse.msg.replace(/_/g,' ');
                    }
                    toaster.pop(appConstants.oops,succResponse.msg);
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.submitEditUser=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    var n = [];
                    var arr = succResponse.error;
                    if(arr != null){
                        $.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1) ; $.each(value.messages, function(ind, value){ n[index] += " "+value })});
                        succResponse.msg= n.join(", ");
                    }
                    else{
                        succResponse.error=[];
                        succResponse.error[0]= succResponse.msg.replace(/_/g,' ');
                    }
                    toaster.pop(appConstants.oops,succResponse.msg);
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.dashboardInit=function(url,method,params,data,cb) {
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

        userSvcSvcResp.usergroupDetail=function(url,method,params,data,cb) {
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

        userSvcSvcResp.userGroupDetailDelete=function(url,method,params,data,cb) {
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

        userSvcSvcResp.unassignUserGroupDetail=function(url,method,params,data,cb) {
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

        userSvcSvcResp.facilityInit=function(url,method,params,data,cb) {
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

        userSvcSvcResp.saveUserGroup=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    var n = [];
                    var arr = succResponse.error;
                    if(arr != null){
                        $.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' '); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
                        succResponse.msg= n.join(", ");
                    }
                    else{
                        succResponse.msg = response.msg.replace(/_/g,' ');
                    }

                    toaster.pop(appConstants.oops,succResponse.msg);
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.addDoorScheduleUserGroup=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    succResponse.msg = succResponse.msg.replace(/_/g,' ');
                    cb(succResponse);
                }
                else {
                    succResponse.msg = succResponse.msg.replace(/_/g,' ');
                    toaster.pop(appConstants.oops,succResponse.msg);
                    cb(succResponse);
                }
            });
        };


        userSvcSvcResp.listDoorSchedule=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    succResponse.msg = succResponse.msg.replace(/_/g,' ');
                    toaster.pop(appConstants.oops,succResponse.msg);
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.searchFunction=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    succResponse.msg = succResponse.msg.replace(/_/g,' ');
                    toaster.pop(appConstants.oops,succResponse.msg);
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.getUserGroupList=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    succResponse.msg = succResponse.msg.replace(/_/g,' ');
                    toaster.pop(appConstants.oops,succResponse.msg);
                    cb(succResponse);
                }
            });
        };


        userSvcSvcResp.userGroupDelete=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    succResponse.msg = succResponse.msg.replace(/_/g,' ');
                    toaster.pop(appConstants.oops,succResponse.msg);
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.editUserGroupp=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    succResponse.msg = succResponse.msg.replace(/_/g,' ');
                    toaster.pop(appConstants.oops,succResponse.msg);
                    cb(succResponse);
                }
            });
        };



        return userSvcSvcResp;
    }]);