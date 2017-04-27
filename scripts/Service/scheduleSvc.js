'use strict';

app.factory('scheduleSvc',['toaster','utilitySvc','appConstants','$rootScope',function (toaster,utilitySvc,appConstants,$rootScope) {

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
			//console.log(data.schedule_mon);
            data.schedule_tue = scheduleSvcResp.timeBlock(tue);
            data.schedule_wed = scheduleSvcResp.timeBlock(wed);
            data.schedule_thu = scheduleSvcResp.timeBlock(thr);
            data.schedule_fri = scheduleSvcResp.timeBlock(fri);
            data.schedule_sat = scheduleSvcResp.timeBlock(sat);
            data.schedule_sun = scheduleSvcResp.timeBlock(sun);
            //data.expiration = scheduleSvcResp.convert(data.expiration);



            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }else {
                    toaster.pop(appConstants.error, succResponse.msg.replace(/_/g,' '));
                    cb(succResponse);
                }
            });
        };



        scheduleSvcResp.timeBlock = function(arr){
            //console.log(arr);
            var returnArr = [];
			
			var arr1 = arr.map(function (x) { 
				return parseInt(x, 10); 
			});
			arr = arr1;
			
            var start = arr[0];
            var end = arr[0];
            for(var i=0; i <= arr.length-1; i=i+2){
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
                     toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
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
                     toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
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
                     toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
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
                     toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
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
                     toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
                    cb(succResponse);
                }
            });
        };
		
		scheduleSvcResp.holidayScheduleList=function(url,method,params,data,cb) {
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
		
		scheduleSvcResp.getHolidayIds = function(hsArray){
			var tmpArray = [];
			for(var i=0; i < hsArray.length; i++){
				if(hsArray[i].isScheduleSelected){
					tmpArray.push(hsArray[i].hs_id);
				}
			}
			return tmpArray;
		};
		
		scheduleSvcResp.viewSchedule = function(url,method,params,data,cb){
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
		
		
		
		scheduleSvcResp.facilityInit = function(url,method,params,data,cb) {
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

        scheduleSvcResp.getSelectedBlocks = function(x,classname) {
            var table = $("#table");
            for(var i=0;i<x.length;i++){
                var startindex = $("#table tr[value='"+x[i].starttime+"']").index();
                var endindex = $("#table tr[value='"+x[i].endtime+"']").index();
                for(var j=startindex;j<endindex;j++){
                    var row = table.find("tr").eq(j).find("."+classname);
                    row.addClass('selected');
                }
            }
        };
        
        scheduleSvcResp.setExceptions = function(x) {
            var exceptions = [];
            for(var i=0;i<x.length;i++){
                var exception = {
                    type:x[i].se_schedule_exception.frequency,
                    status:x[i].se_schedule_exception.type,
                    date:x[i].se_schedule_exception.start_date_time,
                    start_time:x[i].se_schedule_exception.start_time,
                    end_time:x[i].se_schedule_exception.end_time,
                };
                exceptions.push(exception);
            }
            return exceptions;
        };

        scheduleSvcResp.submitEditSchedule=function(url,method,params,data,cb) {
            var mon = [];   var tue = [];   var wed = [];   var thr = [];   var fri = [];   var sat = [];   var sun = [];
            var myTable = $("#table");
            myTable.find( "tr" ).each(function(){
                $(this).find("td").each(function(){
                    if($(this).hasClass("selected")){
                        if($(this).hasClass("mon")){
                            mon.push($(this).parent().attr("value"));
                        }else if($(this).hasClass("tue")){
                            tue.push($(this).parent().attr("value"));
                        }else if($(this).hasClass("wed")){
                            wed.push($(this).parent().attr("value"));
                        }else if($(this).hasClass("thr")){
                            thr.push($(this).parent().attr("value"));
                        }else if($(this).hasClass("fri")){
                            fri.push($(this).parent().attr("value"));
                        }else if($(this).hasClass("sat")){
                            sat.push($(this).parent().attr("value"));
                        }else if($(this).hasClass("sun")){
                            sun.push($(this).parent().attr("value"));
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
            // data.expiration = scheduleSvcResp.convert(data.expiration);
            data.block = "  ";
            data.facility_id = data.schedule_facility_id;
            data.schedule_start_date = data.schedule_start_date.toString();
            data.schedule_end_date = data.expiration.toString();
            data.expiration = data.expiration.toString();



            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }else {
                        toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
                    cb(succResponse);
                }
            });
        };
		
		scheduleSvcResp.autoPopulateBlocks=function() {
			
		};
        
        return scheduleSvcResp;
    }]);