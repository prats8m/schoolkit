'use strict';

app
    .factory('dashboardSvc',['toaster','utilitySvc','appConstants','$rootScope',function (toaster,utilitySvc,appConstants,$rootScope) {

        var dashboardSvcResp=this;

        dashboardSvcResp.getDashboardData=function(url,method,params,data,cb) {
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
        return dashboardSvcResp;
    }]);