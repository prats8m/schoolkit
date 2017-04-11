'use strict';

app
    .factory('scheduleSvc',['toaster','utilitySvc','appConstants',function (toaster,utilitySvc,appConstants) {

        var scheduleSvcResp=this;

        scheduleSvcResp.submitSchedule=function(url,method,params,data,cb) {
            var mon = [];   var tue = [];   var wed = [];   var thr = [];   var fri = [];   var sat = [];   var sun = [];
            var myTable = $("#table");
            myTable.find( "tr" ).each(function(){
                $(this).find("td").each(function(){
                    if($(this).hasClass("selected")){
                        if($(this).hasClass("mon")){
                            mon.push($(this).parent().attr("class"));
                        }else if($(this).hasClass("tue")){
                            tue.push($(this).parent().attr("class"));
                        }else if($(this).hasClass("wed")){
                            wed.push($(this).parent().attr("class"));
                        }else if($(this).hasClass("thr")){
                            thr.push($(this).parent().attr("class"));
                        }else if($(this).hasClass("fri")){
                            fri.push($(this).parent().attr("class"));
                        }else if($(this).hasClass("sat")){
                            sat.push($(this).parent().attr("class"));
                        }else if($(this).hasClass("sun")){
                            sun.push($(this).parent().attr("class"));
                        }
                    }
                });
            });
            
            data.schedule_mon = scheduleSvcResp.timeBlock(mon);
            data.schedule_tue = scheduleSvcResp.timeBlock(tue);
            data.schedule_wed = scheduleSvcResp.timeBlock(wed);
            data.schedule_thu = scheduleSvcResp.timeBlock(thr);
            data.schedule_fri = scheduleSvcResp.timeBlock(fri);
            data.schedule_sat = scheduleSvcResp.timeBlock(sat);
            data.schedule_sun = scheduleSvcResp.timeBlock(sun);
            data.expiration = scheduleSvcResp.convert(data.expiration);









            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }else {
                    toaster.pop(appConstants.error,succResponse.msg);
                    cb(succResponse);
                }
            });
        };



        scheduleSvcResp.timeBlock = function(arr){
            var returnArr = [];
            var start = arr[0];
            var end = arr[0];
            for(var i=0; i < arr.length-1; i=i+2){
                if(arr[i] == (arr[i+2]-1)){
                    end = arr[i+2];
                }else{
                    var starttime = Number(start)+":00";
                    var endtime = Number(end)+1+":00";
                    returnArr.push({starttime: starttime, endtime: endtime});
                    start = arr[i+2];
                    end = arr[i+2];
                }
          
            }
            // returnArr.push({starttime: Number(start), endtime: Number(end)+1});
            return returnArr;
        }

        scheduleSvcResp.convert = function(str) {
            var date = new Date(str),
                mnth = ("0" + (date.getMonth()+1)).slice(-2),
                day  = ("0" + date.getDate()).slice(-2);
            return [ date.getFullYear(), mnth, day ].join("-");
        }

        scheduleSvcResp.dashboardInit = function(url,method,params,data,cb) {
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

        scheduleSvcResp.facilityInit = function(url,method,params,data,cb) {
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

        scheduleSvcResp.deleteSchedule = function(url,method,params,data,cb) {
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

        scheduleSvcResp.searchFunction = function(url,method,params,data,cb) {
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

        scheduleSvcResp.scheduleInit = function(url,method,params,data,cb) {
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


        return scheduleSvcResp;
    }]);