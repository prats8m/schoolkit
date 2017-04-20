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
	$scope.schedule = {};
	
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
	});


	$scope.submitSchedule = function(data){
		data.block = "";
		data.schedule_exception_array = angular.copy($scope.exceptions);
		data.holiday_schedule_array = scheduleSvc.getHolidayIds($rootScope.holidaySchedules);
		data.schedule_start_date = utilitySvc.convertDateToMilliecondTimeStamp(data.schedule_start_date);
		scheduleSvc.submitSchedule(appConstants.scheduleadd, appConstants.postMethod,{},data,function (succResponse) {
        	if(succResponse.status){
                toaster.pop(appConstants.success, appConstants.submitSuccessfully);
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
	}
	
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
		
		var startTimeIndex = $("tr[time='"+startTime+"']").index();
		var endTimeIndex = $("tr[time='"+endTime+"']").index();
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
	
	/***********************        Schdule Exceptions        ******************************/
	
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
	
	$scope.removeHolidaySchdule = function(id){
		
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
		/*
		$http(
		{
			method: 'GET', 
			url: baseURL+'schedule/list?search_val='+$scope.searchText,
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$scope.schedules =  response.data.data;
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
			}else{
				if(response.msg == 'Invalid_Token'){
                    $rootScope.logoutSessionExpiredMassageCount++;
                    if($rootScope.logoutSessionExpiredMassageCount==1){
                        toaster.pop('error','Session Expired');
                        $cookies.remove("token");
                        $location.path('/core/login');
                    }
				}else if(response.msg=='No_Record_Found'){
					$scope.schedules =  [];
				}
			}
		}).error(function(){

		});	
		*/
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
    		$scope.ViewSchedule = response.data[0];
    		console.log($scope.ViewSchedule);
    	}else{

    	}
    });

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


app.filter('scheduleFilter',function(){
	return function(input){
		if(input == 1){
			return 'Active';
		}else{
			return 'In Active';
		}
	}
});