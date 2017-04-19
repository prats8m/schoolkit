'use strict';

app
    .factory('technicianSvc',['toaster','utilitySvc','appConstants',function (toaster,utilitySvc,appConstants) {

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

        return technicianSvcResp;
    }]);