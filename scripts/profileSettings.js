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
          },
            changeSecurityQuestions:{
                sq_id:null,
                answer:null,
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
            $scope.getSecurityQuestion();
        };

        $scope.getSecurityQuestion=function () {
            $scope.lstSecurityQuestions=[];
            profileSettingsSvc.getSecurityQuestion(appConstants.listsecretquestions,appConstants.getMethod,{},{},function (succResponse) {
                if(succResponse.status){
                    $scope.lstSecurityQuestions = succResponse.data?succResponse.data:[];
                }
            });
        };

        $scope.updateLoggedInUserProfile=function () {
            profileSettingsSvc.updateLoggedInUserProfile(appConstants.manageaccount,appConstants.postMethod,{},$scope.profileSettings.manageAccount,function (succResponse) {
                if(succResponse.status){
                    $scope.profileSettings.manageAccount={};
                    toaster.pop(appConstants.success,succResponse.msg.replace(/_/g,' '));
                    alert(appConstants._successemailIDchangesconfirmationmessage);
                    utilitySvc.logoutfacilityWeb()
                }
            });
        };

        $scope.changeSecurityQuestion=function () {
            profileSettingsSvc.changeSecurityQuestion(appConstants.updatesecretquestions,appConstants.postMethod,{},$scope.profileSettings.changeSecurityQuestions,function (succResponse) {
                if(succResponse.status){
                    $scope.profileSettings.changeSecurityQuestions={};
                    toaster.pop(appConstants.success,succResponse.msg.replace(/_/g,' '));
                }
            });
        };

        //.....Init
        $scope.dashboardInit();
    });
