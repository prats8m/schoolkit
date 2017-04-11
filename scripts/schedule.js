'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:AddScheduleCtrl
 * @description
 * # AddScheduleCtrl
 * Controller of the minovateApp
 */
app
  .controller('AddScheduleCtrl', function ($scope,appConstants, scheduleSvc, $mdDialog, $http, $rootScope, $cookies, arrayPushService,toaster,baseURL,$location,errorHandler,$timeout) {
     $scope.page = {
      title: 'Add Schedule',
    };
	$scope.schedule = {};
	
	var table = $("#table");
	var isMouseDown = false;
	var startRowIndex = null;
	var startCellIndex = null;

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
		$scope.schedule.schedule_start_date = table.find("tr").eq(rowStart).attr("value");
		$scope.schedule.schedule_end_date = table.find("tr").eq(rowEnd).attr("value");
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
		//table.find(".selected").removeClass("selected");
		selectTo($(this));
	})
	
	.bind("selectstart", function () {
		return false;
	});

	$(document).mouseup(function () {
		isMouseDown = false;
	});


	$scope.submitSchedule = function(data){
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
	}
	
	$scope.dashboardInit = function(){
        scheduleSvc.dashboardInit(appConstants.userDashboard,appConstants.getMethod,{},{},function (succResponse) {
            if(succResponse.status){
                $rootScope.dashboardData = succResponse.data;
            }
        });
	};
	$scope.dashboardInit();

	$scope.imagePath = 'http://elikastaging.ml/images';	
	
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
    /*
    $scope.deleteSchedule = function(id){
    	dataService.deleteData(null, baseURL + "schedule/delete?schedule_id="+id)
    	.success(function(response){
    		if(response.status){
    			toaster.pop('success','Your schedule groups has been deleted successfully.');
    			$scope.scheduleInit();
    		}else{
    			dataService.responseError(response);
    		}
    	});
    };
    */
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

		scheduleSvc.scheduleInit(appConstants.scheduleList,appConstants.getMethod,{},{},function (succResponse) {
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
		//$http.get('http://localhost:8080/elika/json/admin/schedules.json')
		/*
		dataService.getData(null,baseURL+'schedule/list')
		.success(function(response){
			$scope.schedules = response.data.data;
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
		});
		*/
	}
	$scope.scheduleInit();

	$scope.searchFunction = function(e){




		if(e)
		if(e.keyCode!=13){return false;}
		if(!$scope.searchText){
			$scope.searchText = '';
		}
		$scope.pageNo = 1;
		
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