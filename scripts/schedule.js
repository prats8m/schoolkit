'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:AddScheduleCtrl
 * @description
 * # AddScheduleCtrl
 * Controller of the minovateApp
 */
app
  .controller('AddScheduleCtrl', function ($scope,appConstants, scheduleSvc, $mdDialog, $http, $rootScope, $cookies, arrayPushService,toaster,baseURL,$location,errorHandler,$timeout,utilitySvc) {
    $scope.page = {
      title: 'Add Schedule',
    };

	$scope.minDate = new Date();

	$scope.schedule = {};
	$scope.schedule.schedule_start_date = new Date();
	
	var table = $("#table");
	var isMouseDown = false;
	var startRowIndex = null;
	var startCellIndex = null;
	
	var weekDay = [];

	$scope.modSchedHeight = function(){
			var headHeight = 100;
			var sch = document.getElementById("scheduler_here");
			sch.style.height = (parseInt(document.body.offsetHeight)-headHeight)+"px";
			var contbox = document.getElementById("contbox");
			contbox.style.width = (parseInt(document.body.offsetWidth)-300)+"px";
		}

	$scope.init = function() {
		scheduler.config.multi_day = true;
		scheduler.config.lightbox.sections = [
			
			{name:"time", height:72, type:"time", map_to:"auto"}
		];
	
		window.resizeTo(950,700);
		scheduler.config.day_date = "%D, %F%d";
		scheduler.config.first_hour = 0;
		scheduler.config.multi_day = true;
		scheduler.config.date_step = "5";
		scheduler.config.show_loading = true;
		scheduler.init('scheduler_here',new Date(),"week");
		scheduler.templates.event_class=function(s,e,ev){ return ev.custom?"custom":""; };
	}


	$scope.repetive_schedular = function(){
		angular.forEach($(".dhx_scale_bar"), function(value, key) {
  			value.innerHTML = value.innerHTML.split(",")[0];
		});
		$(".dhx_cal_prev_button").hide();
		$(".dhx_cal_next_button").hide();
		$(".dhx_cal_today_button").hide();
		
	}
	 
	$scope.custom_schedular = function(){
		$(".dhx_scale_bar")[0].innerHTML =  $(".dhx_scale_bar:eq(0)").attr("aria-label");
		$(".dhx_scale_bar")[1].innerHTML =  $(".dhx_scale_bar:eq(1)").attr("aria-label");
		$(".dhx_scale_bar")[2].innerHTML =  $(".dhx_scale_bar:eq(2)").attr("aria-label");
		$(".dhx_scale_bar")[3].innerHTML =  $(".dhx_scale_bar:eq(3)").attr("aria-label");
		$(".dhx_scale_bar")[4].innerHTML =  $(".dhx_scale_bar:eq(4)").attr("aria-label");
		$(".dhx_scale_bar")[5].innerHTML =  $(".dhx_scale_bar:eq(5)").attr("aria-label");
		$(".dhx_scale_bar")[6].innerHTML =  $(".dhx_scale_bar:eq(6)").attr("aria-label");
		$(".dhx_cal_prev_button").show();
		$(".dhx_cal_next_button").show();
		$(".dhx_cal_today_button").show();
		
	} 
	// $scope.set_scheduler = function(){
	// 	scheduler.init('scheduler_here',$scope.schedule.schedulestart_date,"week");
		
	// }

	$scope.clearAllSchedule = function(){
		var eventId = new Array();
		angular.forEach($(".dhx_cal_event"), function(value, key) {
		  eventId.push(value.getAttribute("event_id"));
		});
		angular.forEach(eventId, function(value, key) {
			scheduler.deleteEvent(value);
		});
	}

	$scope.copyMonFri = function(){
		JSON.parse(scheduler.toJSON()).forEach(function(v){
			var date = new Date(v.start_date);
			if(date.getDay() == 1){
				var start = new Date(v.start_date);
				var end = new Date(v.end_date);
				scheduler.parse([
					{start_date: new Date(start.setDate(start.getDate() + 1)), end_date: new Date(end.setDate(end.getDate() + 1))},
					{start_date: new Date(start.setDate(start.getDate() + 1)), end_date: new Date(end.setDate(end.getDate() + 1))},
					{start_date: new Date(start.setDate(start.getDate() + 1)), end_date: new Date(end.setDate(end.getDate() + 1))},
					{start_date: new Date(start.setDate(start.getDate() + 1)), end_date: new Date(end.setDate(end.getDate() + 1))}		
				],"json");
			}
		});
	}

	$scope.copyMonSun = function(){
		JSON.parse(scheduler.toJSON()).forEach(function(v){
			var date = new Date(v.start_date);
			if(date.getDay() == 1){
				var start = new Date(v.start_date);
				var end = new Date(v.end_date);
				scheduler.parse([
					{start_date: new Date(start.setDate(start.getDate() + 1)), end_date: new Date(end.setDate(end.getDate() + 1))},
					{start_date: new Date(start.setDate(start.getDate() + 1)), end_date: new Date(end.setDate(end.getDate() + 1))},
					{start_date: new Date(start.setDate(start.getDate() + 1)), end_date: new Date(end.setDate(end.getDate() + 1))},
					{start_date: new Date(start.setDate(start.getDate() + 1)), end_date: new Date(end.setDate(end.getDate() + 1))},
					{start_date: new Date(start.setDate(start.getDate() + 1)), end_date: new Date(end.setDate(end.getDate() + 1))},
					{start_date: new Date(start.setDate(start.getDate() + 1)), end_date: new Date(end.setDate(end.getDate() + 1))}				
				],"json");
			}
		});
	}

	$scope.show_minical = function(){
		if (scheduler.isCalendarVisible())
			scheduler.destroyCalendar();
		else
			scheduler.renderCalendar({
				position:"dhx_minical_icon",
				date:scheduler._date,
				navigation:true,
				handler:function(date,calendar){
					scheduler.setCurrentView(date);
					scheduler.destroyCalendar();
				}
			});
	}

	function selectTo(cell) {
		
		var row = cell.parent();    
		var cellIndex = cell.index();
		var rowIndex = row.index();
		
		var rowStart, rowEnd, cellStart, cellEnd;
		
		if (rowIndex < startRowIndex) {
			rowStart = rowIndex;
			rowEnd = startRowIndex;
		} else {
			rowStart = startRowIndex;
			rowEnd = rowIndex;
		}
		
		if (cellIndex < startCellIndex) {
			cellStart = cellIndex;
			cellEnd = startCellIndex;
		} else {
			$scope.blocks = [];
			cellStart = startCellIndex;
			cellEnd = cellIndex;
		}
		
		for (var i = rowStart; i <= rowEnd; i++) {
			var rowCells = table.find("tr").eq(i).find("td");
			for (var j = cellStart; j <= cellEnd; j++) {
				
				rowCells.eq(j).addClass("selected");
			}
		}
		//table.find("td").eq(cellStart).attr("value");
		var day = table.find("td").eq(cellEnd).attr("value");
		if($.inArray(day,weekDay) == -1){
			weekDay.push(day);
		}
		// console.log(rowStart + "-" + rowEnd);
		// $scope.schedule.block = [];
		
		$scope.schedule.schedule_start_time = Number(table.find("tr").eq(rowStart).attr("class"))+':00';
		$scope.schedule.schedule_end_time = Number(table.find("tr").eq(rowEnd).attr("class"))+1+':00';
		$scope.schedule.schedule_weekday = weekDay.join("-");
		var block = $scope.schedule.schedule_start_time + " - " + $scope.schedule.schedule_end_time + " " + $scope.schedule.schedule_weekday;
		if($.inArray(block,$scope.blocks) == -1){
			if($(".block_sch td:last").html() != undefined){
				if($scope.schedule.schedule_start_time != $(".block_sch td:last").html().split(" ")[0]){
					$(".block_sch td:last").append("<td>"+block+"</td>");
				}
				else{
					$(".block_sch td:last").html("<td>"+block+"</td>");
				}
				$scope.blocks.push(block);
			}
			else{
				$(".block_sch").html("<td>"+block+"</td>");
			}
		}

		// $scope.schedule.block.push($scope.schedule.schedule_weekday);
		//console.log(table.find("tr").eq(rowEnd).attr("value"));
		$scope.$digest();
	}

	table.find("td").mousedown(function (e) {
		isMouseDown = true;
		var cell = $(this);

		//table.find(".selected").removeClass("selected"); // deselect everything

		if (e.shiftKey) {
			selectTo(cell);                
		} else {
			cell.addClass("selected");
			startCellIndex = cell.index();
			startRowIndex = cell.parent().index();
		}
		
		return false; // prevent text selection
	})
	
	.mouseover(function () {
		if (!isMouseDown) return;
		table.find(".selected").removeClass("selected");
		selectTo($(this));
	})
	
	.bind("selectstart", function () {
		return false;
	});

	$(document).mouseup(function () {
		weekDay = [];
		isMouseDown = false;
		//setTimeout($scope.updateBlock());
	});
	
	$scope.timedropdown = appConstants.timedropdown2;

	$scope.submitSchedule = function(data,form){
		if(!form.validate()){
			return false;
		}
		var weekday = new Array(7);
		weekday[0] = "Sunday";
		weekday[1] = "Monday";
		weekday[2] = "Tuesday";
		weekday[3] = "Wednesday";
		weekday[4] = "Thursday";
		weekday[5] = "Friday";
		weekday[6] = "Saturday";

		var ind = new Array();
		JSON.parse(scheduler.toJSON()).forEach(function(v){ 
			delete v.id; 
			delete v.text; 
			v.day = weekday[new Date(v.start_date).getDay()]; 
			v.starttime = v.start_date.split(" ")[1]; 
			v.endtime = v.end_date.split(" ")[1]; 
			if($scope.schedule.schedule_type == 1)
				v.date = v.start_date.split(" ")[0];
			delete v.start_date;
			delete v.end_date;
			ind.push(v)
		});
		data.schedule = ind;
		
		data.block = "";
		data.schedule_exception_array = angular.copy($scope.exceptions);
		data.holiday_schedule_array = scheduleSvc.getHolidayIds($rootScope.holidaySchedules);
		// data.schedule_start_date = utilitySvc.convertDateToMilliecondTimeStamp(new Date(data.schedule_start_date))/1000;

		var start_date = data.schedulestart_date;
		var date = new Date(data.schedulestart_date)  
		data.schedule_start_date = date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();

		var expiration_date = data.expiration;
		var exp_date = new Date(data.expiration)  
		data.expiration = exp_date.getDate()+"-"+(exp_date.getMonth()+1)+"-"+exp_date.getFullYear();

		// data.expiration = utilitySvc.convertDateToMilliecondTimeStamp(new Date(data.expiration))/1000;
		
		scheduleSvc.submitSchedule(appConstants.scheduleadd, appConstants.postMethod,{},data,function (succResponse) {
			data.schedulestart_date = start_date;
			data.expiration = expiration_date;
        	if(succResponse.status){
                toaster.pop(appConstants.success, appConstants.submitSuccessfully);
				$location.path('/app/admin/schedule/schedule-groups');
            }
        });
	}

	
	$scope.facilityInit = function(){
		scheduleSvc.facilityInit(appConstants.facilitylist, appConstants.getMethod,{},{},function (succResponse) {
        	if(succResponse.status){
                $rootScope.facilityList = succResponse.data.data;
            }
        });
	}
	$scope.facilityInit();
	
	// $scope.copyMonFri = function(){
	// 	$("#table").find("tr").each(function(){
	// 		if($(this).find("td:first-child").hasClass("selected")){
	// 			$(this).find("td:lt(5)").addClass("selected");
	// 		}
	// 	});
	// }
	
	// $scope.copyMonSun = function(){
	// 	$("#table").find("tr").each(function(){
	// 		if($(this).find("td:first-child").hasClass("selected")){
	// 			$(this).find("td:lt(7)").addClass("selected");
	// 		}
	// 	});
	// }
	
	// $scope.clearAll = function(){
	// 	$("#table tr td").removeClass("selected");
	// 	$scope.schedule.schedule_start_time = '';
	// 	$scope.schedule.schedule_end_time = '';
	// 	$scope.schedule.schedule_weekday = '';
	// 	$scope.blocks = [];
	// }
	
	$scope.dashboardInit = function(){
        scheduleSvc.dashboardInit(appConstants.userDashboard,appConstants.getMethod,{},{},function (succResponse) {
            if(succResponse.status){
                $rootScope.dashboardData = succResponse.data;
            }
        });
	};
	$scope.dashboardInit();

	$scope.blocks = [];
	
	$scope.updateBlock = function(){
		if(!($scope.schedule.schedule_start_time && $scope.schedule.schedule_end_time && $scope.schedule.schedule_weekday))
			return false;
		var block = $scope.schedule.schedule_start_time + " - " + $scope.schedule.schedule_end_time + " " + $scope.schedule.schedule_weekday;
		if($.inArray(block,$scope.blocks) == -1){
			$scope.blocks.push(block);
		}
	}
	$scope.deleteBlock = function(){
		if(!$scope.schedule.block) return false;
		var splitData = $scope.schedule.block.split(" ");
		var startTime = splitData[0];
		var endTime = splitData[2];
		var days = splitData[3].split("-");
		
		var startTimeIndex = $("tr[value='"+startTime+"']").index();
		var endTimeIndex = $("tr[value='"+endTime+"']").index();
		$("#table").find("tr").each(function(i){
			if(i >= startTimeIndex && i <= endTimeIndex){
				for(var i=0; i < days.length; i++){
					$(this).find("td[value='"+days[i]+"']").removeClass('selected');
				}
			}
		});
		var tmp = [];
		for(var i=0;i<$scope.blocks.length;i++){
			if($scope.schedule.block != $scope.blocks[i]){
				tmp.push($scope.blocks[i]);
			}
		}
		$scope.blocks = tmp;
	}

	$scope.imagePath = 'http://elikastaging.ml/images';	
	
	/***************************************************************************************/
	/***************************        Schdule Exceptions        **************************/
	/***************************************************************************************/
	
	
	$scope.exceptions = [];
	$scope.exception ={
		date:new Date()
	};
	
	$scope.addException = function(exception){
		var key = angular.copy($scope.exceptions.length + 1);
		var obj = angular.copy(exception);
		obj.key = key;
		$scope.exceptions.push(obj);
		$scope.exception = {};
	}
	
	$rootScope.holidaySchedules = [];
	$scope.holidayScheduleList = function(data){
		scheduleSvc.holidayScheduleList(appConstants.holidayschedulelist, appConstants.getMethod,{},{},function (succResponse) {
        	if(succResponse.status){
				$rootScope.holidaySchedules = succResponse.data;
            }
        });
	}
	
	$scope.holidayScheduleList();
	$scope.hsArray = [];
	
	
	$rootScope.submitHS = function (id){
		console.log($rootScope.holidaySchedules);
	}
	
	$scope.removeHolidaySchdule = function(key){
		var tmpExceptions = [];
		var exceptions = $scope.exceptions;
		for(var i=0; i < exceptions.length; i++){
			if(exceptions[i].key != key){
				tmpExceptions.push(exceptions[i]);
			}
		}
		$scope.exceptions = tmpExceptions;
	}
	
	
	$scope.validateExpiration = function(exception){
		if(exception.type == 'ONETIME'){
			if(!exception.date){
				return true;
			}
			if(!exception.start_time){
				return true;
			}
			if(!exception.end_time){
				return true;
			}
			if(!exception.status){
				return true;
			}
			return false;
		}
		if(exception.type == 'REPEATING'){
			if(!exception.week){
				return true;
			}
			if(!exception.day){
				return true;
			}
			if(!exception.start_time){
				return true;
			}
			if(!exception.end_time){
				return true;
			}
			if(!exception.status){
				return true;
			}
			return false;
		}
		return true;
	}
});


'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:ScheduleGroupsCtrl
 * @description
 * # ScheduleGroupsCtrl
 * Controller of the minovateApp
 */
app
  .controller('ScheduleGroupsCtrl', function ($scope,appConstants, scheduleSvc, $mdDialog, $http, $rootScope, $cookies, arrayPushService,toaster,baseURL,$location,errorHandler,$timeout,dataService) {
     $scope.page = {
      title: 'Schedule Groups',
      subtitle: 'So much more to see at a glance.'
    };
    
	
    $scope.deleteSchedule = function(id){
    	scheduleSvc.deleteSchedule(appConstants.scheduleDelete,appConstants.deleteMethod,{schedule_id:id},{},function (succResponse) {
            if(succResponse.status){
                toaster.pop('success',appConstants.deleteSchedule);
    			$scope.scheduleInit();
            }
        });
    };
	
	$scope.status = '  ';
    $scope.showConfirm = function(ev,id) {
		var confirm = $mdDialog.confirm()		
		.title(appConstants._deleteScheduleGroupMessage)
		.content(appConstants.empty)
		.ok(appConstants.delete)
		.cancel(appConstants.cancel)
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			$scope.deleteSchedule(id);
		}, function() {
			toaster.pop(appConstants.info,appConstants._canceltoDeleteScheduleGroup);
		});
    };
	
	$scope.layout = 'grid';
	$scope.class = 'gridview';
	$scope.changeClass = function(){
		if ($scope.class === 'gridview')
		$scope.class = 'listview';
		$scope.layout = 'list';
	};
	
	$scope.changeaClass = function(){
		if ($scope.class === 'listview')
		$scope.class = 'gridview';
		$scope.layout = 'grid';
	};
	
	

	$scope.scheduleInit = function(){
		if(!$scope.searchText){
			$scope.searchText = '';
		}
		var params = {limit:1000,pageNo:1,search_val:$scope.searchText};
		scheduleSvc.scheduleInit(appConstants.scheduleList, appConstants.getMethod,params,{},function (succResponse) {
            if(succResponse.status){
				$scope.schedules = [];
				angular.forEach(succResponse.data.data, function (schedule, index) {
					$scope.schedules.push(schedule);
				});
				$scope.totalDisplayed = 8;
				
				if($scope.schedules.length > $scope.totalDisplayed) {
					$scope.lmbtn = {
						"display" : "block"
					};			
				} else {
					$scope.lmbtn = {
						"display" : "none"
					};
				}
				
				$scope.loadMore = function () {
					$scope.totalDisplayed += 8;
					if($scope.totalDisplayed > $scope.schedules.length) {				
						$scope.lmbtn = {
							"display" : "none"
						};	
					}			
				};
            }else if(!succResponse.status){
				$scope.schedules = [];
			} 
        });
	}
	$scope.scheduleInit();

	$scope.searchFunction = function(e){
		if(e)
		if(e.keyCode!=13){return false;}
		if(!$scope.searchText){
			$scope.searchText = '';
		}
		$scope.pageNo = 1;
		var params = {limit:1000,pageNo:1,search_val:$scope.searchText};
		scheduleSvc.scheduleInit(appConstants.scheduleList, appConstants.getMethod,params,{},function (succResponse) {
            if(succResponse.status){
                $scope.schedules = succResponse.data.data;
				$scope.totalDisplayed = 8;
				
				if($scope.schedules.length > $scope.totalDisplayed) {
					$scope.lmbtn = {
						"display" : "block"
					};			
				} else {
					$scope.lmbtn = {
						"display" : "none"
					};
				}
				
				$scope.loadMore = function () {
					$scope.totalDisplayed += 8;
					if($scope.totalDisplayed > $scope.schedules.length) {				
						$scope.lmbtn = {
							"display" : "none"
						};	
					}			
				};
            }
        });
	}
	
	$scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }

	$scope.dashboardInit = function(){

        scheduleSvc.dashboardInit(appConstants.userDashboard,appConstants.getMethod,{},{},function (succResponse) {
            if(succResponse.status){
                $rootScope.dashboardData = succResponse.data;
            }
        });
	};
	$scope.dashboardInit();
	
	$scope.imagePath = 'http://localhost:8080/elika/images';
		
});


'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:ViewScheduleCtrl
 * @description
 * # ViewScheduleCtrl
 * Controller of the minovateApp
 */
app
  .controller('ViewScheduleCtrl', function ($scope,appConstants, scheduleSvc, $mdDialog, $http, $rootScope, $cookies, arrayPushService,toaster,baseURL,$location,errorHandler,$timeout,dataService,$stateParams) {
     $scope.page = {
      title: 'Schedule',
      subtitle: 'So much more to see at a glance.'
    };

    dataService.getData(null,baseURL + "schedule/view?schedule_id="+$stateParams.schedule_id)
    .success(function(response){
    	if(response.status){
    		$scope.ViewSchedule = response.data;
    	   	scheduleSvc.facilityInit(appConstants.facilitylist, appConstants.getMethod,{},{},function (succResponse) {
        		if(succResponse.status){
                	$scope.ViewSchedule["facilityList"] = succResponse.data.data;
                	
            	}
       		 });
    	}else{

    	}
    });

    $scope.dashboardInit = function(){
        scheduleSvc.dashboardInit(appConstants.userDashboard, appConstants.getMethod,{},{},function (succResponse) {
            if(succResponse.status){
                $rootScope.dashboardData = succResponse.data;
            }
        });
	};
	$scope.dashboardInit();
	
	$scope.imagePath = 'http://localhost:8080/elika/images';	
	
});

'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:ViewScheduleCtrl
 * @description
 * # ViewScheduleCtrl
 * Controller of the minovateApp
 */
app.controller('EditScheduleCtrl',function ($scope, appConstants, scheduleSvc, $mdDialog, $stateParams, $rootScope, $cookies, arrayPushService,toaster,baseURL,$location,errorHandler,$timeout,dataService,utilitySvc){
	
	$scope.page = {
      title: 'Schedule',
      subtitle: 'So much more to see at a glance.'
    };
	
	var table = $("#table");
	var isMouseDown = false;
	var startRowIndex = null;
	var startCellIndex = null;
	
	var weekDay = [];

	function selectTo(cell) {
		
		var row = cell.parent();    
		var cellIndex = cell.index();
		var rowIndex = row.index();
		
		var rowStart, rowEnd, cellStart, cellEnd;
		
		if (rowIndex < startRowIndex) {
			rowStart = rowIndex;
			rowEnd = startRowIndex;
		} else {
			rowStart = startRowIndex;
			rowEnd = rowIndex;
		}
		
		if (cellIndex < startCellIndex) {
			cellStart = cellIndex;
			cellEnd = startCellIndex;
		} else {
			cellStart = startCellIndex;
			cellEnd = cellIndex;
		}
		
		for (var i = rowStart; i <= rowEnd; i++) {
			var rowCells = table.find("tr").eq(i).find("td");
			for (var j = cellStart; j <= cellEnd; j++) {
				rowCells.eq(j).addClass("selected");
			}
		}
		//table.find("td").eq(cellStart).attr("value");
		var day = table.find("td").eq(cellEnd).attr("value");
		if($.inArray(day,weekDay) == -1){
			weekDay.push(day);
		}
		//console.log(rowStart + "-" + rowEnd);
		$scope.schedule.schedule_start_time = table.find("tr").eq(rowStart).attr("value");
		$scope.schedule.schedule_end_time = table.find("tr").eq(rowEnd).attr("value");
		$scope.schedule.schedule_weekday = weekDay.join("-");
		//console.log(table.find("tr").eq(rowEnd).attr("value"));
		$scope.$digest();
	}

	table.find("td").mousedown(function (e) {
		isMouseDown = true;
		var cell = $(this);

		// table.find(".selected").removeClass("selected"); // deselect everything

		if (e.shiftKey) {
			selectTo(cell);                
		} else {
			cell.addClass("selected");
			startCellIndex = cell.index();
			startRowIndex = cell.parent().index();
		}
		
		return false; // prevent text selection
	})
	
	.mouseover(function () {
		if (!isMouseDown) return;
		//table.find(".selected").removeClass("selected");
		selectTo($(this));
	})
	
	.bind("selectstart", function () {
		return false;
	});

	$(document).mouseup(function () {
		weekDay = [];
		isMouseDown = false;
		// $scope.updateBlock();
	});
	
	$scope.blocks = [];
	
	$scope.timedropdown = appConstants.timedropdown2;
	
	$scope.updateBlock = function(){
		if(!($scope.schedule.schedule_start_time && $scope.schedule.schedule_end_time && $scope.schedule.schedule_weekday))
			return false;
		var block = $scope.schedule.schedule_start_time + " - " + $scope.schedule.schedule_end_time + " " + $scope.schedule.schedule_weekday;
		if($.inArray(block,$scope.blocks) == -1){
			$scope.blocks.push(block);
		}
	}
	$scope.deleteBlock = function(){
		if(!$scope.schedule.block) return false;
		var splitData = $scope.schedule.block.split(" ");
		var startTime = splitData[0];
		var endTime = splitData[2];
		var days = splitData[3].split("-");
		
		var startTimeIndex = $("tr[value='"+startTime+"']").index();
		var endTimeIndex = $("tr[value='"+endTime+"']").index();
		$("#table").find("tr").each(function(i){
			if(i >= startTimeIndex && i <= endTimeIndex){
				for(var i=0; i < days.length; i++){
					$(this).find("td[value='"+days[i]+"']").removeClass('selected');
				}
			}
		});
		var tmp = [];
		for(var i=0;i<$scope.blocks.length;i++){
			if($scope.schedule.block != $scope.blocks[i]){
				tmp.push($scope.blocks[i]);
			}
		}
		$scope.blocks = tmp;
	}
	
	$scope.viewSchedule = function(){
		scheduleSvc.viewSchedule(appConstants.scheduleView, appConstants.getMethod,{schedule_id:$stateParams.schedule_id},{},function (succResponse) {
        	if(succResponse.status){
				$scope.schedule = succResponse.data;

				$scope.holidayScheduleList();
				var mon = $scope.schedule.schedule_mon;
				var tue = $scope.schedule.schedule_tue;
				var wed = $scope.schedule.schedule_wed;
				var thu = $scope.schedule.schedule_thu;
				var fri = $scope.schedule.schedule_fri;
				var sat = $scope.schedule.schedule_sat;
				var sun = $scope.schedule.schedule_sun;
				scheduleSvc.getSelectedBlocks(mon,'mon');
				scheduleSvc.getSelectedBlocks(tue,'tue');
				scheduleSvc.getSelectedBlocks(wed,'wed');
				scheduleSvc.getSelectedBlocks(thu,'thr');
				scheduleSvc.getSelectedBlocks(fri,'fri');
				scheduleSvc.getSelectedBlocks(sat,'sat');
				scheduleSvc.getSelectedBlocks(sun,'sun');
				
				$rootScope.exceptions = scheduleSvc.setExceptions($scope.schedule.schedule_exceptions);
				$scope.schedule.selected_schedule_start_date = new Date($scope.schedule.schedule_start_date * 1000);
				$scope.minDate = angular.copy($scope.schedule.selected_schedule_start_date);
				var newDate = new Date();
				if(newDate < $scope.minDate){
					$scope.minStartDate = new Date();
				}else{
					$scope.minStartDate = angular.copy($scope.minDate);
				}

				($scope.schedule.no_expirations == 1) ? $scope.schedule.selected_schedule_expiration_date = "" :$scope.schedule.selected_schedule_expiration_date = new Date($scope.schedule.schedule_expiration_date * 1000);;
				$scope.blocks = scheduleSvc.autoPopulateBlocks();
            }
        });
	};
	$scope.viewSchedule();
	
	$scope.facilityInit = function(){
		scheduleSvc.facilityInit(appConstants.facilitylist, appConstants.getMethod,{},{},function (succResponse) {
        	if(succResponse.status){
                $rootScope.facilityList = succResponse.data.data;
            }
        });
	}
	$scope.facilityInit();
	
	$rootScope.holidaySchedules = [];
	$scope.holidayScheduleList = function(data){
		scheduleSvc.holidayScheduleList(appConstants.holidayschedulelist, appConstants.getMethod,{},{},function (succResponse) {
        	if(succResponse.status){
				$rootScope.holidaySchedules = succResponse.data;
				$scope.setHolidays();
            }
        });
	}
	
	$scope.setHolidays = function(){
		var arr = [];
		var ho = $scope.schedule.holiday_observed;
		var hs = $rootScope.holidaySchedules;
		for(var i=0; i < ho.length; i++){
			arr.push(ho[i].hs_id);
		}
		for(var i=0; i < hs.length; i++){
			if(arr.indexOf( hs[i].hs_id ) != -1){
				hs[i].isScheduleSelected = true;
			}
		}
		$rootScope.holidaySchedules = hs;
	}

	$scope.addException = function(exception){
		var key = angular.copy($scope.exceptions.length + 1);
		var obj = angular.copy(exception);
		obj.key = key;
		$scope.exceptions.push(obj);
	}

	$scope.submitEditSchedule = function(data,form){
		if(!form.validate()){
			return false;
		}
		data.block = "";
		data.schedule_exception_array = angular.copy($rootScope.exceptions);
		data.holiday_schedule_array = scheduleSvc.getHolidayIds($rootScope.holidaySchedules);
		// data.schedule_start_date = utilitySvc.convertDateToMilliecondTimeStamp(data.selected_schedule_start_date)/1000;
		// data.expiration = utilitySvc.convertDateToMilliecondTimeStamp(data.selected_schedule_expiration_date)/1000;
		var start_date = data.selected_schedule_start_date;
		var date = new Date(data.selected_schedule_start_date)  
		data.schedule_start_date = date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();

		var expiration_date = data.selected_schedule_expiration_date;
		var exp_date = new Date(data.selected_schedule_expiration_date)  
		data.expiration = exp_date.getDate()+"-"+(exp_date.getMonth()+1)+"-"+exp_date.getFullYear();


		scheduleSvc.submitEditSchedule(appConstants.scheduleEdit, appConstants.putMethod,{},$scope.schedule,function (succResponse) {
        	if(succResponse.status){
				data.schedulestart_date = start_date;
				data.expiration = expiration_date;
				toaster.pop(appConstants.success,appConstants.submitSuccessfully);
				$location.path('/app/admin/schedule/schedule-groups');
            }
        });
	}

	$scope.dashboardInit = function(){
        scheduleSvc.dashboardInit(appConstants.userDashboard,appConstants.getMethod,{},{},function (succResponse) {
            if(succResponse.status){
                $rootScope.dashboardData = succResponse.data;
            }
        });
	};
	$scope.dashboardInit();
	
	$scope.copyMonFri = function(){
		$("#table").find("tr").each(function(){
			if($(this).find("td:first-child").hasClass("selected")){
				$(this).find("td:lt(5)").addClass("selected");
			}
		});
	}
	
	$scope.copyMonSun = function(){
		$("#table").find("tr").each(function(){
			if($(this).find("td:first-child").hasClass("selected")){
				$(this).find("td:lt(7)").addClass("selected");
			}
		});
	}
	
	$scope.clearAll = function(){
		$("#table tr td").removeClass("selected");
		$scope.schedule.schedule_start_time = '';
		$scope.schedule.schedule_end_time = '';
		$scope.schedule.schedule_weekday = '';
		$scope.blocks = [];
	}
	
	$scope.removeHolidaySchdule = function(key){
		var tmpExceptions = [];
		var exceptions = $rootScope.exceptions;
		for(var i=0; i < exceptions.length; i++){
			if(exceptions[i].key != key){
				tmpExceptions.push(exceptions[i]);
			}
		}
		$rootScope.exceptions = tmpExceptions;
	}
	
	$scope.validateExpiration = function(exception){
		if(exception.type == 'ONETIME'){
			if(!exception.date){
				return true;
			}
			if(!exception.start_time){
				return true;
			}
			if(!exception.end_time){
				return true;
			}
			if(!exception.status){
				return true;
			}
			return false;
		}
		if(exception.type == 'REPEATING'){
			if(!exception.week){
				return true;
			}
			if(!exception.day){
				return true;
			}
			if(!exception.start_time){
				return true;
			}
			if(!exception.end_time){
				return true;
			}
			if(!exception.status){
				return true;
			}
			return false;
		}
		return true;
	}
		
});

app.filter('scheduleFilter',function(){
	return function(input){
		if(input == 1){
			return 'Active';
		}else{
			return 'In Active';
		}
	}
});