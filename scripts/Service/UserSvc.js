'use strict';

app
    .factory('userSvc',['toaster','utilitySvc','appConstants','$rootScope',function (toaster,utilitySvc,appConstants,$rootScope) {

        var userSvcSvcResp=this;

        userSvcSvcResp.uploadProfilePic=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    if($rootScope.toasterPool!=succResponse.msg){
                        $rootScope.toasterPool=succResponse.msg;
                        toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
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
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
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
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
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
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
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
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
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
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
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
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
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
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
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

                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
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
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
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
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
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
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
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
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
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
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
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
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.profileInit=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    succResponse.msg = succResponse.msg.replace(/_/g,' ');
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.editdoorList=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    succResponse.msg = succResponse.msg.replace(/_/g,' ');
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.assignEditUserGroup=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    succResponse.msg = succResponse.msg.replace(/_/g,' ');
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.editassignedGroup=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    succResponse.msg = succResponse.msg.replace(/_/g,' ');
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.userNotAssignedGroup=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    succResponse.msg = succResponse.msg.replace(/_/g,' ');
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.deleteGroup=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    succResponse.msg = succResponse.msg.replace(/_/g,' ');
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.submitEditAccessCode=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {

                    if(succResponse.msg == 'InValid_Data'){
                        toaster.pop(appConstants.error,appConstants.invaliddata);
                    }
                    else {
                        if(succResponse.error != appConstants.empty && succResponse.error != null){
                            var n=[];
                            var arr = succResponse.error;
                            $.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
                            succResponse.msg = n.join(", ");
                            if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                        }
                    }
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.getAccessCodeList=function(url,method,params,data,cb) {
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

        userSvcSvcResp.submitEditNfcCode=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {

                    if(succResponse.msg == 'InValid_Data'){
                        toaster.pop(appConstants.error,appConstants.invaliddata);
                    }
                    else {
                        if(succResponse.error != appConstants.empty && succResponse.error != null){
                            var n=[];
                            var arr = succResponse.error;
                            $.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
                            succResponse.msg = n.join(", ");
                            if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                        }
                    }
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.getNfcCodeList=function(url,method,params,data,cb) {
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

        userSvcSvcResp.getPhoneList=function(url,method,params,data,cb) {
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

        userSvcSvcResp.submitEditPhoneCode=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {

                    if(succResponse.msg == 'InValid_Data'){
                        toaster.pop(appConstants.error,appConstants.invaliddata);
                    }
                    else {
                        if(succResponse.error != appConstants.empty && succResponse.error != null){
                            var n=[];
                            var arr = succResponse.error;
                            $.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
                            succResponse.msg = n.join(", ");
                            if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                        }
                    }
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.getRfidList=function(url,method,params,data,cb) {
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

        userSvcSvcResp.submitEditRFIDCode=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {

                    if(succResponse.msg == 'InValid_Data'){
                        toaster.pop(appConstants.error,appConstants.invaliddata);
                    }
                    else {
                        if(succResponse.error != appConstants.empty && succResponse.error != null){
                            var n=[];
                            var arr = succResponse.error;
                            $.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
                            succResponse.msg = n.join(", ");
                            if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                        }
                    }
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.getBleList=function(url,method,params,data,cb) {
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

        userSvcSvcResp.submitEditBLECode=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    if(succResponse.msg == 'InValid_Data'){
                        toaster.pop(appConstants.error,appConstants.invaliddata);
                    }
                    else {
                        if(succResponse.error != appConstants.empty && succResponse.error != null){
                            var n=[];
                            var arr = succResponse.error;
                            $.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
                            succResponse.msg = n.join(", ");
                            if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                        }
                    }
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.unassignUserGroupEdit=function(url,method,params,data,cb) {
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

        userSvcSvcResp.deleteUser=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    succResponse.msg = succResponse.msg.replace(/_/g,' ');
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.removeCredential=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    succResponse.msg = succResponse.msg.replace(/_/g,' ');
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.usersInit=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    succResponse.msg = succResponse.msg.replace(/_/g,' ');
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.doorList=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    succResponse.msg = succResponse.msg.replace(/_/g,' ');
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.saveRFID=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                        if(succResponse.error != appConstants.empty && succResponse.error != null){
                            var n=[];
                            var arr = succResponse.error;
                            $.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
                            succResponse.msg = n.join(", ");
                            if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                        }
                        else {
                            succResponse.msg = succResponse.msg.replace(/_/g,' ');
                            if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                        }
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.submitPhoneCode=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    if(succResponse.error != appConstants.empty && succResponse.error != null){
                        var n=[];
                        var arr = succResponse.error;
                        $.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
                        succResponse.msg = n.join(", ");
                        if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    }
                    else {
                        succResponse.msg = succResponse.msg.replace(/_/g,' ');
                        if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    }
                    cb(succResponse);
                }
            });
        };


        userSvcSvcResp.saveBLEcode=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    if(succResponse.error != appConstants.empty && succResponse.error != null){
                        var n=[];
                        var arr = succResponse.error;
                        $.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
                        succResponse.msg = n.join(", ");
                        if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    }
                    else {
                        succResponse.msg = succResponse.msg.replace(/_/g,' ');
                        if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    }
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.saveNFCcode=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    if(succResponse.error != appConstants.empty && succResponse.error != null){
                        var n=[];
                        var arr = succResponse.error;
                        $.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
                        succResponse.msg = n.join(", ");
                        if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    }
                    else {
                        succResponse.msg = succResponse.msg.replace(/_/g,' ');
                        if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    }
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.saveAccessCode=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    if(succResponse.error != appConstants.empty && succResponse.error != null){
                        var n=[];
                        var arr = succResponse.error;
                        $.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
                        succResponse.msg = n.join(", ");
                        if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    }
                    else {
                        succResponse.msg = succResponse.msg.replace(/_/g,' ');
                        if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    }
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.assignUserGroup=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    succResponse.msg = succResponse.msg.replace(/_/g,' ');
                    cb(succResponse);
                }
                else {
                    if($rootScope.toasterPool!=succResponse.msg){                         $rootScope.toasterPool=succResponse.msg;                         toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));                     }
                    cb(succResponse);
                }
            });
        };

        userSvcSvcResp.unassignUserToUsergroup=function(url,method,params,data,cb) {
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

        userSvcSvcResp.assignedGroup=function(url,method,params,data,cb) {
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

        userSvcSvcResp.unassignedGroup=function(url,method,params,data,cb) {
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

        return userSvcSvcResp;
    }]);