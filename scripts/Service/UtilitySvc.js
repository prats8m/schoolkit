'use strict';

app
    .factory('utilitySvc',['$http','baseURL','$cookies','toaster','$rootScope','$location','appConstants',function ($http,baseURL,$cookies,toaster,$rootScope,$location,appConstants) {

        var factoryResp=this;

        var respStructure={
            status:false,
            data:null,
            msg:'',
            error:null
        };

        factoryResp.callHttpService=function (url,method,params,data,cb) {
            $http({
                url: baseURL + url,
                method: method,
                data:data,
                dataType : appConstants.dataType,
                headers: {
                    Authorization: $cookies.get(appConstants.sessionTokenCookieID),
                    "Content-type": url.indexOf('pic-upload')<0? appConstants.contentType:undefined
                },
                params:params
            })
                .success(function(response, status, headers, config) {
                    if(response.status == true){
                        cb(respStructure={
                            status:response.status,
                            data:response.data,
                            msg:response.msg,
                            error:response.error
                        });
                    }
                    else {
                        if(response.msg == 'Invalid_Token'){
                            $rootScope.logoutSessionExpiredMassageCount++;
                            if($rootScope.logoutSessionExpiredMassageCount==1){
                                toaster.pop(appConstants.error,appConstants.sessionExp);
                                $cookies.remove(appConstants.sessionTokenCookieID);
                                $location.path('/core/login');
                            }
                        }
                        else {
                            cb(respStructure={
                                status:response.status,
                                data:response.data,
                                msg:response.msg,
                                error:response.error
                            });
                        }
                    }
                })
                .error(function (data, status, headers, config) {
                    cb(respStructure={
                        status:status=false,
                        data:data,
                        msg:appConstants.somethingwrong,
                        error:null
                    });
                });

        };

        factoryResp.logoutfacilityWeb = function(){
            $cookies.remove(appConstants.sessionTokenCookieID);
            $location.path('/core/login');
        };
        return factoryResp;
    }]);