app
    .controller('profileSettingCtrl', function ($scope, $mdDialog,$rootScope, toaster,appConstants,profileSettingsSvc,utilitySvc) {
        $scope.page = {
            title: appConstants.titileProfileSettings
        };

        //..Model......................................

        $scope.profileSettings={
          manageAccount:{
              new_email:null,
              confirm_email:null,
              current_password:null
          }
        };

        //..............................................

        $scope.dashboardInit = function(){
            profileSettingsSvc.dashboardInit(appConstants.userDashboard,appConstants.getMethod,{},{},function (succResponse) {
                if(succResponse.status){
                    $rootScope.dashboardData = succResponse.data?succResponse.data:[];
                }
            });
        } ;

        $scope.updateLoggedInUserProfile=function () {
            profileSettingsSvc.updateLoggedInUserProfile(appConstants.manageaccount,appConstants.postMethod,{},$scope.profileSettings.manageAccount,function (succResponse) {
                if(succResponse.status){
                    toaster.pop(appConstants.success,succResponse.msg.replace(/_/g,' '));
                    //utilitySvc.logoutfacilityWeb()
                }
            });
        };

        //.....Init
        $scope.dashboardInit();
    });
