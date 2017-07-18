'use strict';

app
    .factory('loginSvc',['toaster','utilitySvc','appConstants','$rootScope','$cookies',function (toaster,utilitySvc,appConstants,$rootScope,$cookies ) {

        var loginSvcResp=this;

        loginSvcResp.loginFunction=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    if(succResponse.msg == 'Login_Success'){
                        var now = new Date();
                        var time = now.getTime();
                        var expireTime = time + 1000 * 60;
                        now.setTime(expireTime);
                        //	if(response.data.userType == 'admin'){
                        $cookies.put('facilityId', succResponse.data.facilityId,{expiry:now});
                        $cookies.put('userFirstName', succResponse.data.userFirstName,{expiry:now});
                        $cookies.put('userLastName', succResponse.data.userLastName,{expiry:now});
                        if(succResponse.data.facilityId.length == 1){
                            $cookies.put('current_facility_id', succResponse.data.facilityId,{expiry:now});
                        }else{
                            $cookies.put('current_facility_id', "");
                        }
                        //	}
                    }

                    cb(succResponse);
                }
                else {
                    if(succResponse.msg == 'Invalid_Credentials'){
                        succResponse.msg = appConstants.invalidcredentials;
                    }
                    else{
                        succResponse.msg=succResponse.msg.replace(/_/g,' ');
                        //toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
                    }
                    cb(succResponse);
                }
            });
        };
        return loginSvcResp;
    }]);