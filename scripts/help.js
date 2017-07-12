'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:FaqsCtrl
 * @description
 * # FaqsCtrl
 * Controller of the minovateApp
 */
app
  .controller('FaqsCtrl', function ($scope, $http,baseURL,$stateParams,siteURL) {
     $scope.page = {
      title: 'Faqs',
    };

    $scope.isOpen = false;
    $scope.oneAtATime = true;
    
    // Data 
    $scope.groups = [];
    $scope.module_name = $stateParams.module_name;
    // console.log($scope.module_name);

  $http.get( siteURL + 'json/admin/faqs.json')
  .then(function(response) {
    if(response.data[$scope.module_name]){
      $scope.groups = response.data[$scope.module_name];
    }
    else{
      $scope.groups = response.data['others'];
      $scope.module_name = '';
    }
  });

  //log
  $scope.$watch('isOpen', function(){
        console.log(" watch isOpen:" +$scope.isOpen);
   }, true);
  
  $scope.imagePath = 'http://elikastaging.ml/images'; 
  
});


'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:HistoryReportsCtrl
 * @description
 * # HistoryReportsCtrl
 * Controller of the minovateApp
 */
app
  .controller('HistoryReportsCtrl', function ($scope, $http, baseURL, $stateParams, helpSvc, appConstants, $rootScope, $state) {
     $scope.page = {
      title: 'History & Reports',
    };

    $scope.limit = 10;
    $scope.count= 0;
    $scope.maxSize = 5;
    $scope.bigTotalItems = 0;
    $scope.bigCurrentPage = 1;

    $scope.historyList = function(){
        $scope.bigCurrentPage = ($scope.bigCurrentPage < 1) ? 1 : $scope.bigCurrentPage ;
      	helpSvc.historyList(appConstants.historylist,appConstants.getMethod,{'limit':10,pageNo:$scope.bigCurrentPage},{},function (succResponse) {
            if(succResponse.status){
               $scope.histories= succResponse.data.rows;
               $scope.count= succResponse.data.count;
               $scope.bigTotalItems = succResponse.data.count;

            }else{
            	$scope.histories= [];
               $scope.count= 0;
            }
        });
    }


    $scope.historyList();

    $scope.next = function(){
    	$scope.pageNo++;
    	$scope.historyList();
    }
    $scope.prev = function(){
    	$scope.pageNo--;
    	$scope.historyList();
    }

    $scope.pageChanged = function(bigCurrentPage) {
      $scope.bigCurrentPage = bigCurrentPage;
      $scope.historyList();
    };

    $scope.resetHistory = function(){
      // $scope.bigCurrentPage = 1;
      // $scope.historyList();
      // $scope.setPage($scope.bigCurrentPage);
      $state.reload();
    }

    


  $scope.imagePath = 'http://elikastaging.ml/images'; 
  
}); 

app.filter('historyTypeColor', function () {
  return function (input) {
    if (input == 'add') {
      return "bg-primary";
    } else if(input == 'delete'){
      return "bg-danger";
    } else if(input == 'update'){
    	return "bg-info";
    }
  }
});

app.filter('historyTypeIcon', function () {
  return function (input) {
    if (input == 'add') {
      return "fa fa-plus-circle";
    } else if(input == 'delete'){
      return "fa fa-minus-circle";
    } else if(input == 'update'){
    	return "fa fa-pencil-square";
    }
  }
});