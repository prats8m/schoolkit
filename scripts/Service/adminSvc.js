'use strict';

app
    .factory('adminSvc',['toaster','utilitySvc','appConstants',function (toaster,utilitySvc,appConstants) {

        var adminSvcResp=this;

        adminSvcResp.dashboardInit=function(url,method,params,data,cb) {
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

        adminSvcResp.createAdmin=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {

                    var n = [];
                    var arr = succResponse.error;
                    if(arr != null){
                        $.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1); $.each(value.messages, function(ind, value){ n[index] += " "+value })});
                        succResponse.msg = n.join(", ");
                    }
                    else{
                        succResponse.msg= succResponse.msg.replace(/_/g,' ');
                    }
                    toaster.pop(appConstants.error,succResponse.msg);
                    cb(succResponse);
                }
            });
        };


        return adminSvcResp;
    }]);