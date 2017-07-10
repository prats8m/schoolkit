app
    .controller('LoginCtrl', function ($scope, $state, $http, $cookies, baseURL, $rootScope, $location, appConstants, utilitySvc, loginSvc) {

        $scope.user = {};
        $scope.setCookies = function () {
            $scope.user.username = $cookies.get('username');
            $scope.user.password = $cookies.get('password');
            if ($scope.user.username != undefined) {
                $scope.rememberme = true;
            }
        };
        $scope.setCookies();


        $scope.loginFunction = function () {
            $scope.user.type = "web";
            loginSvc.loginFunction(appConstants.loginweb, appConstants.postMethod, {}, $scope.user, function (succResponse) {
                if (succResponse.status) {
                    if (succResponse.msg == 'Login_Success') {
                        $rootScope.current_user = succResponse.data;
                        $cookies.put('userId', succResponse.data.userId);
                        if ($scope.rememberme) {
                            $cookies.put('username', $scope.user.username);
                            $cookies.put('password', $scope.user.password);
                        }
                        else {
                            $cookies.remove('username');
                            $cookies.remove('password');
                        }
                        if (succResponse.data.isWizardUsed == 0) {
                            $cookies.put('isWizardUsed', succResponse.data.isWizardUsed);
                            $state.go('core.setupWizard')
                        }
                        //  console.log($rootScope.current_user);
                        else
                            $state.go('app.admin.dashboard')
                        //($cookies.get('facilityId').split(",").length == 1) ? $state.go('app.admin.dashboard',{facility_id:$cookies.get('facilityId')}) : $state.go('app.admin.dashboard',{facility_id:0})
                        // $state.go('app.admin.dashboard');
                    }
                }
                else {
                    $scope.message = succResponse.msg;
                }

            });
        };

        $scope.checkIfUserLoggedIn = function () {
            if ($cookies.get(appConstants.sessionTokenCookieID)) {
                $state.go('app.admin.dashboard');
            }
        };

        $scope.checkIfUserLoggedIn();

        $scope.logout = function () {
            utilitySvc.logoutfacilityWeb();
        }
    });