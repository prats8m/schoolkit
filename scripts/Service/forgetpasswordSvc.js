'use strict';

app
    .factory('forgetpasswordSvc',['toaster','utilitySvc','appConstants',function (toaster,utilitySvc,appConstants) {

        var forgetpasswordSvcResp=this;

        forgetpasswordSvcResp.questionsInit = function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    toaster.pop(appConstants.oops,succResponse.msg.replace(/_/g,' '));
                    cb(succResponse);
                }
            });
        };

        forgetpasswordSvcResp.submitSecretQuestion = function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                    toaster.pop(appConstants.oops,succResponse.msg.replace(/_/g,' '));
                    cb(succResponse);
                }
            });
        };

        return forgetpasswordSvcResp;
    }]);