'use strict';

app
    .controller('DashboardCtrl', function($scope,$rootScope,appConstants,dashboardSvc,$uibModal,$log,toaster){
        $scope.page = {
            title: appConstants.dashboardTitle,
            subtitle: appConstants.dashboardSubTitle
        };

        $scope.dashboardInit = function(){
            dashboardSvc.getDashboardData(appConstants.userDashboard,appConstants.getMethod,{},{},function (succResponse) {
                if(succResponse.status){
                    $rootScope.dashboardData = succResponse.data?succResponse.data:[];
                    console.log($rootScope.dashboardData);
                    $scope.getShortCutList();
                }
            });
        };

        $scope.getShortCutList=function(){
            dashboardSvc.getShortCutList(appConstants.shortcutslist,appConstants.getMethod,{},{},function (succResponse) {
                if(succResponse.status){
                    $scope.shortcutsForLoggedInUser=[];
                    $scope.shortcutsForLoggedInUser=succResponse.data?succResponse.data:[];
                }
            });
        };

        $scope.openShortCutPopup=function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'addshortcutondashboardModal.html',
                    controller: 'addshortcutondashboardModalInstanceCtrl',
                    resolve: {
                        items: function () {
                            return $scope.shortcutsForLoggedInUser;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    dashboardSvc.addOrUpdateShortcuts(appConstants.shortcutadd,appConstants.postMethod,{},{shortcut_data:selectedItem},function (succResponse) {
                        if(succResponse.status){
                            toaster.pop(appConstants.success,succResponse.msg.replace(/_/g,' '));
                            $scope.getShortCutList();
                        }
                    });
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
        };

       $scope.dashboardInit();
    })





//...................Add Short Cuts Popup Modal.................................................

.controller('addshortcutondashboardModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

    $scope.lstDashboardShortCuts=angular.copy(items);
    for(var key in $scope.lstDashboardShortCuts){
        $scope.lstDashboardShortCuts[key].shortcutStatus=$scope.lstDashboardShortCuts[key].shortcutStatus==0?false:true;
    }
    $scope.ok = function () {
        for(var key in $scope.lstDashboardShortCuts){
            $scope.lstDashboardShortCuts[key].shortcutStatus=!$scope.lstDashboardShortCuts[key].shortcutStatus?0:1;
        }
        $uibModalInstance.close($scope.lstDashboardShortCuts);
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

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


'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the minovateApp
 */
app
  .controller('SignupCtrl', function ($scope, $state,$rootScope,appConstants,dashboardSvc,$uibModal,$log,toaster) {

    $scope.submitSignUpForm = function(user){
        if(!user.tnc) { toaster.pop('error',appConstants._chktnc);
         return false; }
        user.secret_question = parseInt(user.secret_question);
        dashboardSvc.submitSignUpForm(appConstants.addmasteradmin,appConstants.postMethod,{},user,function (succResponse) {
            if(succResponse.status){
                if(succResponse.msg == 'Success')
                toaster.pop('success',appConstants._successsignup);
                $state.go('core.login');
            }
        });
    }

  });