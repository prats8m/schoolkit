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
        controller: ['$scope','dashboardSvc',"appConstants",'$rootScope', function flipHeaderController($scope,dashboardSvc,appConstants,$rootScope) {
            dashboardSvc.getDashboardData(appConstants.userDashboard,appConstants.getMethod,{},{},function (succResponse) {
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
    controller: ['$scope','dashboardSvc',"appConstants",'$rootScope', function elikaHeader($scope,dashboardSvc,appConstants,$rootScope) {
            dashboardSvc.getHeaderFacilityList(appConstants.facilitylist,appConstants.getMethod,{},{},function (succResponse) {
                if(succResponse.status){
                    $rootScope.headerFacilityList = succResponse.data ? succResponse.data.data : [];
                    console.log($rootScope.headerFacilityList);
                }
            });
        }]
    };
});