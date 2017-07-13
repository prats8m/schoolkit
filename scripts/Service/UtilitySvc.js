'use strict';

app
    .factory('utilitySvc',['$http','baseURL','$cookies','toaster','$rootScope','$location','appConstants','$modalStack','$timeout','$interval',function ($http,baseURL,$cookies,toaster,$rootScope,$location,appConstants,$modalStack,$timeout,$interval) {

        var factoryResp=this;

        var respStructure={
            status:false,
            data:null,
            msg:'',
            error:null
        };



        factoryResp.callHttpService=function (url,method,params,data,cb) {

            $timeout(function(){
                $http({
                    url: baseURL + url,
                    method: method,
                    data:data,
                    dataType : appConstants.dataType,
                    //timeout : 30000,
                    headers: {
                        Authorization: $cookies.get(appConstants.sessionTokenCookieID),
                        "Content-type": url.indexOf('pic-upload') < 0 ? appConstants.contentType:undefined
                    },
                    params:params
                })
                    .success(function(response, status, headers, config) {
                        if(status==404){
                            cb(respStructure={
                                status:false,
                                data:null,
                                msg:'Error Code '+status+': '+appConstants.apiNotFound,
                                error:null
                            });
                        }
                        else if(!response && status==-1){
                            cb(respStructure={
                                status:false,
                                data:null,
                                msg:appConstants.timeout+': '+appConstants.responsenotfound,
                                error:null
                            });
                        }
                        else {
                            if(response.token || (response.data && response.data.token)) {
                                //     $cookies.put(appConstants.sessionTokenCookieID,response.token);
                                var tkn=response.token || response.data.token;
                                var now = new Date();
                                var time = now.getTime();
                                var expireTime = time + 1000 * 60;
                                now.setTime(expireTime);
                                $cookies.put(appConstants.sessionTokenCookieID, tkn, {expiry: now});
                            }
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
                                    toaster.pop(appConstants.error,appConstants.sessionExp);
                                    factoryResp.logoutfacilityWeb();

                                    // $rootScope.logoutSessionExpiredMassageCount++;
                                    // if($rootScope.logoutSessionExpiredMassageCount==1){
                                    //     toaster.pop(appConstants.error,appConstants.sessionExp);
                                    //     $modalStack.dismissAll('LoggedOut'); // close all opened modals................
                                    //     factoryResp.logoutfacilityWeb();
                                    // }
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
            },500);

        };

        factoryResp.logoutfacilityWeb = function(){
            $timeout(function () {
                $modalStack.dismissAll('LoggedOut'); // close all opened modals................
                toaster.clear();  //clears all toast messages
                $cookies.remove(appConstants.sessionTokenCookieID);
                $cookies.remove('current_facility_id');
                $location.path('/core/login');
            },1500);
        };

        factoryResp.convertDateToMilliecondTimeStamp = function(dateObj,timeObj){
            var convertableString='';
            if(dateObj){
                convertableString=dateObj.getFullYear()+"/"+(dateObj.getMonth()+1)+"/"+dateObj.getDate();
            }
            if(timeObj){
                convertableString+=' '+timeObj;
            }
            return new Date(convertableString).getTime();
        };

        factoryResp.getDateTimeFromTimeStamp=function(date) {
            var dateTimeObj={
                date:null,
                time:null
            };

            var d = new Date(date);

            var yyyy=d.getFullYear();
            var mm=appConstants.monthNames[d.getMonth()];
            var dt=d.getDate();
            var dom=dt<10?'0'+dt:dt;
            var hh = d.getHours();
            var m = d.getMinutes();
            var s = d.getSeconds();
			var h=hh;
            /* var dd = "AM";
            var h = hh;
            if (h >= 12) {
                h = hh - 12;
                dd = "PM";
            }
            if (h == 0) {
                h = 12;
            } */
            m = m < 10 ? "0" + m : m;

            s = s < 10 ? "0" + s : s;

            h = h<10?"0"+h:h;

            var pattern = new RegExp("0?" + hh + ":" + m + ":" + s);

            var time = h + ":" + m;
            /* if you want to add seconds
             time += ":"+s;  */
            //time += " " + dd;

            dateTimeObj.date=mm+' '+dom+', '+yyyy;
            dateTimeObj.time=time;
            return dateTimeObj;
        };

        factoryResp.dateToString = function(expiration_date){
            var date = new Date(expiration_date)  
            return date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
        };

        factoryResp.getCurrentFacility = function(){
            var current_facility_id = $cookies.get('current_facility_id');
            return (!(current_facility_id == 0 || current_facility_id == '0')) ? current_facility_id : '' ;
            
        };

        return factoryResp;
    }]);


//.........Interceptor For all HTTP Calls.....................................................

function setCustomConfigsToHTTPCalls() {
    return {
        request: function(config) {
            config.timeout = 30000;
            return config;
        },

        requestError: function(config) {
            return config;
        },

        response: function(res) {
            return res;
        },

        responseError: function(res) {
            return res;
        }
    }
};
app.factory('setCustomConfigsToHTTPCalls', setCustomConfigsToHTTPCalls);



//............................................................................................