app.directive("number", function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.on('keypress', function (e) {
        console.log(e);
        if (!((e.charCode >= 48 && e.charCode <= 57) || e.charCode == 0)) {
          e.preventDefault();
        }
      });
    }
  }
});

app.directive("noSpace", function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.on('keypress', function (e) {
        if (e.keyCode == 32 || e.charCode == 32) {
          e.preventDefault();
        }
      });
    }
  }
});

app.directive('logoutBtn', ['$location', '$cookies', function ($location, $cookies) {
  function link(scope, element, attrs) {
    element.bind('click', function () {
      $cookies.remove("token", { path: '/' });
      $cookies.remove("token", { path: '/elika-warehouse' });
      $location.path('/core/login');
    });
  }

  return {
    link: link
  };
}]);

//..............................................................................................
app
.directive('flipHeader', function() {
  return {
    template: `<div class="card-container col-sm-4 col-md-3">
                <div class="card">
                    <a ui-sref="app.admin.device.devices">
                    <div class="noback bg-blue cardheight">                     
                        <div class="row">
                            <div class="col-xs-6 ta-r">
                                <div class="iconbx">
                                    <img src="images/device-icon.png" alt="">
                                </div>
                            </div>
                            <div class="col-xs-6">  
                                <div class="itxt">                          
                                    <p class="text-elg text-strong mt-5 mb-5">{{dashboardData.primary_device}}</p>
                                    <span class="text-lg">Devices</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    </a>
                </div>
            </div>          
            <div class="card-container col-sm-4 col-md-3">
                <div class="card">
                    <a ui-sref="app.admin.door.doors">
                    <div class="noback bg-slategray lt cardheight">                     
                        <div class="row">
                            <div class="col-xs-6 ta-r">
                                <div class="iconbx">
                                    <img src="images/doors-icon.png" alt="">
                                </div>
                            </div>
                            <div class="col-xs-6">  
                                <div class="itxt">                          
                                    <p class="text-elg text-strong mt-5 mb-5">{{dashboardData.door}}</p>
                                    <span class="text-lg">Doors</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    </a>
                </div>
            </div>          
            <div class="card-container col-sm-4 col-md-3">
                <div class="card">
                    <a ui-sref="app.admin.user.users">
                    <div class="noback bg-lightred cardheight">                     
                        <div class="row">
                            <div class="col-xs-6 ta-r">
                                <div class="iconbx">
                                    <img src="images/users-icon.png" alt="">
                                </div>
                            </div>
                            <div class="col-xs-6">
                                <div class="itxt">                              
                                    <p class="text-elg text-strong mt-5 mb-5">{{dashboardData.user}}</p>
                                    <span class="text-lg">Users</span>
                                </div>  
                            </div>
                        </div>
                    </div>
                    </a>
                </div>
            </div>`,
        restrict: 'E',
        //scope: {},
        controller: ['$scope','dashboardSvc',"appConstants",'$rootScope','utilitySvc', function flipHeaderController($scope,dashboardSvc,appConstants,$rootScope,utilitySvc) {
            dashboardSvc.getDashboardData(appConstants.userDashboard + '?facility_id=' + utilitySvc.getCurrentFacility(),appConstants.getMethod,{},{},function (succResponse) {
                if(succResponse.status){
                    $rootScope.dashboardData = succResponse.data?succResponse.data:[];
                }
            });
        }]
    };
});

//..............................................................................................
app
.directive('elikaHeader', function() {
  return {
    templateUrl:'views/header.html',
    restrict: 'E',
    controller: ['$scope','dashboardSvc',"appConstants",'$rootScope','utilitySvc','$cookies','$state','dataService', function elikaHeader($scope,dashboardSvc,appConstants,$rootScope,utilitySvc,$cookies,$state,dataService) {
            
            // dashboardSvc.getHeaderFacilityList(appConstants.facilitylist,appConstants.getMethod,{},{},function (succResponse) {
            //     if(succResponse.status){
            //         $rootScope.headerFacilityList = succResponse.data ? succResponse.data.data : [];
            //     }
            // });
            // $scope.current_facility = appConstants.allfacilities;
            // $scope.navbar_facilities_count = $cookies.get('facilityId').split(",").length;
            // if($scope.navbar_facilities_count == 1){
            //     $scope.facility_id = $cookies.get('facilityId');
            // }else{
            //     $scope.facility_id = 0;
            // }

            // $scope.goFacilityList = function(){
            //     $cookies.put('current_facility_id',0);
            //     $scope.facility_id = 0;
            //     $scope.current_facility = appConstants.allfacilities;
            //     ($state.is('app.admin.facility.facility')) ? $state.reload() : $state.go('app.admin.facility.facility');
                
            // };

            // $scope.setCurrentFacility = function(facility_name, facility_id){
            //     $cookies.put('current_facility_id',facility_id);
            //     $scope.facility_id = facility_id;
            //     ($state.is('app.admin.dashboard')) ? $state.go('app.admin.dashboard',{facility_id:facility_id}) : $state.reload();
            //     $scope.current_facility = facility_name;
            // }

            // $scope.staticcurrent_facility = appConstants.allfacilities;

            // if(utilitySvc.getCurrentFacility() == ''){
            //     $scope.current_facility = appConstants.allfacilities;
            // }else{
            //     dashboardSvc.getFacilityName(appConstants.facilityview,appConstants.getMethod,{},{},function (succResponse) {
            //         if(succResponse.status){
            //             $scope.current_facility = succResponse.data.facility_name;
            //         }else{
            //             $scope.current_facility = appConstants.allfacilities;
            //         }
            //     });
            // }
        }]
    };
});

//..............................................................................................
app
.directive('elikaFacilityName', function() {
  return {
    template:`<ul class="nav-right list-inline headmenu" ng-if="navbar_facilities_count > 1"><li class="dropdown" uib-dropdown>
                    <span class="dropdown-toggle" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false">{{current_facility}} &nbsp;<i class="fa fa-angle-down" name="angle-down"></i></span>
                    <ul class="dropdown-menu panel panel-default animated littleFadeInDown" role="menu" style="">
                        <li ><a ng-click="setCurrentFacility(staticcurrent_facility,0)"">All Facilities</a></li>
                        <li ng-repeat="facility in headerFacilityList"><a ng-click="setCurrentFacility(facility.facility_name,facility.facility_id)">{{ facility.facility_name }}</a></li>
                    </ul>
                </li></ul>`,
    restrict: 'C',
    controller: ['$scope','dashboardSvc',"appConstants",'$rootScope','utilitySvc','$cookies','$state','dataService', function elikaHeader($scope,dashboardSvc,appConstants,$rootScope,utilitySvc,$cookies,$state,dataService) {
            dashboardSvc.getHeaderFacilityList(appConstants.facilitylist,appConstants.getMethod,{},{},function (succResponse) {
                if(succResponse.status){
                    $rootScope.headerFacilityList = succResponse.data ? succResponse.data.data : [];
                }
            });
            $scope.current_facility = appConstants.allfacilities;
            $scope.navbar_facilities_count = $cookies.get('facilityId').split(",").length;
            if($scope.navbar_facilities_count == 1){
                $scope.facility_id = $cookies.get('facilityId');
            }else{
                $scope.facility_id = 0;
            }

            $scope.goFacilityList = function(){
                $cookies.put('current_facility_id',0);
                $scope.facility_id = 0;
                $scope.current_facility = appConstants.allfacilities;
                $state.reload();
                //($state.is('app.admin.facility.facility')) ? $state.reload() : $state.go('app.admin.facility.facility');
            };

            $scope.setCurrentFacility = function(facility_name, facility_id){
                $cookies.put('current_facility_id',facility_id);
               $scope.facility_id = facility_id;
                //($state.is('app.admin.dashboard')) ? $state.go('app.admin.dashboard',{facility_id:facility_id}) : $state.reload();
                $state.reload();
                $scope.current_facility = facility_name;
            }

            $scope.staticcurrent_facility = appConstants.allfacilities;

            if(utilitySvc.getCurrentFacility() == ''){
                $scope.current_facility = appConstants.allfacilities;
            }else{
                dashboardSvc.getFacilityName(appConstants.facilityview,appConstants.getMethod,{},{},function (succResponse) {
                    if(succResponse.status){
                        $scope.current_facility = succResponse.data.facility_name;
                    }else{
                        $scope.current_facility = appConstants.allfacilities;
                    }
                });
            }
        }]
    };
});

app
.directive('elikaFacilityDashboard', function() {
  return {
    template:`<span><strong>{{dashboard_facility_name}}</strong> {{dashboard_facility_quote}}</span>`,
    restrict: 'C',
    controller: ['$scope','dashboardSvc',"appConstants",'$rootScope','$cookies', function elikaFacility($scope,dashboardSvc,appConstants,$rootScope,$cookies) {
            dashboardSvc.getFacilityName(appConstants.facilityview,appConstants.getMethod,{},{},function (succResponse) {
                if(succResponse.status){
                    $scope.dashboard_facility_name = succResponse.data.facility_name;
                    $scope.dashboard_facility_quote = succResponse.data.facility_location;
                }else{
                    $scope.dashboard_facility_name = appConstants.dashboard_facility_name;
                    $scope.dashboard_facility_quote = appConstants.dashboard_facility_quote;
                }
            });
        }]
    };
});

// app
// .directive('elikaFacilityName', function() {
//   return {
//     template:`<span ng-show="vinnerpage_facility_name"> Facility name :</span> {{innerpage_facility_name}}`,
//     restrict: 'C',
//     controller: ['$scope','dashboardSvc',"appConstants",'$rootScope','$cookies', function elikaFacility($scope,dashboardSvc,appConstants,$rootScope,$cookies) {
//             dashboardSvc.getFacilityName(appConstants.facilityview,appConstants.getMethod,{},{},function (succResponse) {
//                 if(succResponse.status){
//                     $scope.innerpage_facility_name = succResponse.data.facility_name;
//                     $scope.vinnerpage_facility_name = true;
//                 }else{
//                     $scope.innerpage_facility_name = "";
//                     $scope.vinnerpage_facility_name = false;
//                 }
//             });
//         }]
//     };
// });

app.directive('elikaFaqs', ['$location', '$cookies', function ($location, $cookies) {
  function link(scope, element, attrs) {
    element.bind('click', function () {
      var url = $location.path();
      var moduleArr = url.split("/");
      var module_name = moduleArr[3];
      $location.path('/app/admin/help/faqs/' + module_name);
      // $state.go('app.admin.help.faqs({module_name:module_name})');
    });
  }

  return {
    restrict: 'A',
    link: link
  };
}]);

app.factory('dataService', [function(){
    var facility_id = 0;
  return facility_id;
}]);