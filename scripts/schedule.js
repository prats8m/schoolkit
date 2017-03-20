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
		
	}

	table.find("td").mousedown(function (e) {
		isMouseDown = true;
		var cell = $(this);

		table.find(".selected").removeClass("selected"); // deselect everything
		
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
		
		data.schedule_mon = mon[0]+"-"+mon[mon.length-1];
		data.schedule_tue = tue[0]+"-"+tue[tue.length-1];
		data.schedule_wed = wed[0]+"-"+wed[wed.length-1];
		data.schedule_thu = thr[0]+"-"+thr[thr.length-1];
		data.schedule_fri = fri[0]+"-"+fri[fri.length-1];
		data.schedule_sat = sat[0]+"-"+sat[sat.length-1];
		data.schedule_sun = sun[0]+"-"+sun[sun.length-1];
		data.expiration;
		data.expiration = convert(data.expiration);
		console.log(data);
		
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
	
	$scope.imagePath = 'http://elikastaging.ml/images';	
	
});