app
    .controller('LoginCtrl', function ($scope, $state,$http,$cookies,baseURL,$rootScope, $location,appConstants,utilitySvc,loginSvc) {

        $scope.user = {};
        $scope.setCookies = function(){
            $scope.user.username = $cookies.get('username');
            $scope.user.password = $cookies.get('password');
        };
        $scope.setCookies();


        $scope.loginFunction = function(){
            $scope.user.type = "web";
            loginSvc.loginFunction(appConstants.loginweb,appConstants.postMethod,{},$scope.user,function (succResponse) {
                if(succResponse.status){
                    if(succResponse.msg == 'Login_Success'){
                        $rootScope.current_user = succResponse.data;
                        $cookies.put('userId', succResponse.data.userId);
                        if($scope.rememberme){
                            $cookies.put('username', $scope.user.username);
                            $cookies.put('password', $scope.user.password);                          
                        }
                        console.log($rootScope.current_user);
                        $state.go('app.admin.dashboard');
                    }
                }
                else{
                        $scope.message = succResponse.msg;
                }

            });
        };

        $scope.checkIfUserLoggedIn=function () {
            if($cookies.get(appConstants.sessionTokenCookieID)){
                $state.go('app.admin.dashboard');
            }
        };

        $scope.checkIfUserLoggedIn();

        $scope.logout = function(){
            utilitySvc.logoutfacilityWeb();
        }
    });