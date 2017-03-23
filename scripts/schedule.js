'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:AddScheduleCtrl
 * @description
 * # AddScheduleCtrl
 * Controller of the minovateApp
 */
app
  .controller('AddScheduleCtrl', function ($scope, $mdDialog, $http, $rootScope, $cookies, arrayPushService,toaster,baseURL,$location,errorHandler,$timeout) {
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
		
		var mon = [];	var tue = [];	var wed = [];	var thr = [];	var fri = [];	var sat = [];	var sun = [];
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
		
		data.schedule_mon = timeBlock(mon);
		data.schedule_tue = timeBlock(tue);
		data.schedule_wed = timeBlock(wed);
		data.schedule_thu = timeBlock(thr);
		data.schedule_fri = timeBlock(fri);
		data.schedule_sat = timeBlock(sat);
		data.schedule_sun = timeBlock(sun);
		data.expiration = convert(data.expiration);
		
		$http(
		{
			method: 'POST', 
			url: baseURL+'schedule/add',
			dataType : 'JSON',
			data: data,
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				toaster.pop('success','Submit Successfully');
			}else{
				if(response.msg == 'Invalid_Token'){
					
				}else{
					
				}
			}
		}).error(function(){

		});	
		
	}
	
	function timeBlock(arr){
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
	
	function convert(str) {
		var date = new Date(str),
			mnth = ("0" + (date.getMonth()+1)).slice(-2),
			day  = ("0" + date.getDate()).slice(-2);
		return [ date.getFullYear(), mnth, day ].join("-");
	}
	
	$scope.facilityInit = function(){
		$http(
		{
			method: 'GET', 
			url: baseURL+'facility/list',
			dataType : 'JSON', 
			headers: {
				"Content-type": "application/json",
				"Authorization": $cookies.get("token")
			}
		})
		.success(function(response){
			if(response.status == true){
				$rootScope.facilityList = response.data.data;	
			}else{
				
			}
		}).error(function(){

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
	
	$scope.imagePath = 'http://elikastaging.ml/images';	
	
});