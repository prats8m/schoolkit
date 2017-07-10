'use strict';

app
    .factory('helpSvc',['toaster','utilitySvc','appConstants','$rootScope',function (toaster,utilitySvc,appConstants,$rootScope) {

        var helpSvcResp=this;

        helpSvcResp.historyList=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    cb(succResponse);
                }
            });
        };

        

        return helpSvcResp;
    }]);