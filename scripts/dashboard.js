'use strict';

app
    .controller('DashboardCtrl', function ($scope, $rootScope, appConstants, dashboardSvc, $uibModal, $log, toaster, $stateParams, $cookies, utilitySvc, $state) {
        $scope.page = {
            title: appConstants.dashboardTitle,
            subtitle: appConstants.dashboardSubTitle
        };
       
        $scope.dashboardInit = function () {
            dashboardSvc.getDashboardData(appConstants.userDashboard + "?facility_id=" + utilitySvc.getCurrentFacility(), appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.dashboardData = succResponse.data ? succResponse.data : [];
                    $scope.getShortCutList();
                }
            });
        };

        $scope.getShortCutList = function () {
            dashboardSvc.getShortCutList(appConstants.shortcutslist, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.shortcutsForLoggedInUser = [];
                    $scope.shortcutsForLoggedInUser = succResponse.data ? succResponse.data : [];
                }
            });
        };

        $scope.openShortCutPopup = function () {
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
                dashboardSvc.addOrUpdateShortcuts(appConstants.shortcutadd, appConstants.postMethod, {}, { shortcut_data: selectedItem }, function (succResponse) {
                    if (succResponse.status) {
                        toaster.pop(appConstants.success, succResponse.msg.replace(/_/g, ' '));
                        $scope.getShortCutList();
                    }
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        //($stateParams.facility_id) ? $cookies.put('current_facility_id',$stateParams.facility_id) : $cookies.put('current_facility_id',0);

        $scope.dashboardInit();
        $scope.dashboard_facility_photo_constant = appConstants.dashboard_facility_photo;
        $scope.getFacilityName = function(){
            dashboardSvc.getFacilityName(appConstants.facilityview, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.dashboard_facility_name = succResponse.data.facility_name;
                    $scope.dashboard_facility_quote = succResponse.data.facility_location;
                    $scope.dashboard_facility_photo = succResponse.data.facility_photo;
                } else {
                    $scope.dashboard_facility_name = appConstants.dashboard_facility_name;
                    $scope.dashboard_facility_quote = appConstants.dashboard_facility_quote;
                    $scope.dashboard_facility_photo = appConstants.dashboard_facility_photo;
                }
            });
        }
        $scope.getFacilityName();

    });





    //...................Add Short Cuts Popup Modal.................................................
app
    .controller('addshortcutondashboardModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

        $scope.lstDashboardShortCuts = angular.copy(items);
        for (var key in $scope.lstDashboardShortCuts) {
            $scope.lstDashboardShortCuts[key].shortcutStatus = $scope.lstDashboardShortCuts[key].shortcutStatus == 0 ? false : true;
        }
        $scope.ok = function () {
            for (var key in $scope.lstDashboardShortCuts) {
                $scope.lstDashboardShortCuts[key].shortcutStatus = !$scope.lstDashboardShortCuts[key].shortcutStatus ? 0 : 1;
            }
            $uibModalInstance.close($scope.lstDashboardShortCuts);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
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
    .controller('SignupCtrl', function ($scope, $state, $rootScope, appConstants, dashboardSvc, $uibModal, $log, toaster, profileSettingsSvc) {

        $scope.submitSignUpForm = function (user, signup_form) {
            if (!signup_form.validate()) { return false; }

            if (!user.tnc) {
                toaster.pop('error', appConstants._chktnc);
                return false;
            }
            user.zipcode = parseInt(user.zipcode);

            user.secret_question = parseInt(user.secret_question);
            dashboardSvc.submitSignUpForm(appConstants.addmasteradmin, appConstants.postMethod, {}, user, function (succResponse) {
                if (succResponse.status) {
                    if (succResponse.msg == 'Success'){
                        toaster.pop('success', appConstants._successsignup);
                        toaster.pop('info', appConstants._emailverification);
                    }
                    $state.go('core.login');
                }
            });
        }

        $scope.getSecurityQuestion = function () {
            $scope.lstSecurityQuestions = [];
            profileSettingsSvc.getSecurityQuestion(appConstants.listsecretquestions, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.lstSecurityQuestions = succResponse.data ? succResponse.data : [];
                }
            });
        };
        $scope.getSecurityQuestion();

    });