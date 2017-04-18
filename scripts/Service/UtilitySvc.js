'use strict';

app
    .factory('utilitySvc',['$http','baseURL','$cookies','toaster','$rootScope','$location','appConstants','$modalStack','$timeout',function ($http,baseURL,$cookies,toaster,$rootScope,$location,appConstants,$modalStack,$timeout) {

        var factoryResp=this;

        var respStructure={
            status:false,
            data:null,
            msg:'',
            error:null
        };

        factoryResp.callHttpService=function (url,method,params,data,cb) {
           // toaster.clear();  //clears all toast messages
            //$timeout(function () {
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
                        if(response.token){
                            $cookies.put(appConstants.sessionTokenCookieID,response.token);
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
                                $rootScope.logoutSessionExpiredMassageCount++;
                                if($rootScope.logoutSessionExpiredMassageCount==1){
                                    toaster.pop(appConstants.error,appConstants.sessionExp);
                                    $modalStack.dismissAll('LoggedOut'); // close all opened modals................
                                    factoryResp.logoutfacilityWeb();
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
           // },500);
        };

        factoryResp.logoutfacilityWeb = function(){
            $timeout(function () {
                toaster.clear();  //clears all toast messages
                $cookies.remove(appConstants.sessionTokenCookieID);
                $location.path('/core/login');
            },1500);
        };

        factoryResp.convertDateToMilliecondTimeStamp = function(dateObj,timeObj){
            var convertableString='';
            if(dateObj){
                convertableString=dateObj.getFullYear()+"-"+(dateObj.getMonth()+1)+"-"+dateObj.getDate();
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
            var dd = "AM";
            var h = hh;
            if (h >= 12) {
                h = hh - 12;
                dd = "PM";
            }
            if (h == 0) {
                h = 12;
            }
            m = m < 10 ? "0" + m : m;

            s = s < 10 ? "0" + s : s;

            h = h<10?"0"+h:h;

            var pattern = new RegExp("0?" + hh + ":" + m + ":" + s);

            var time = h + ":" + m;
            /* if you want to add seconds
             time += ":"+s;  */
            time += " " + dd;

            dateTimeObj.date=mm+' '+dom+', '+yyyy;
            dateTimeObj.time=time;
            return dateTimeObj;
        };



        return factoryResp;
    }]);