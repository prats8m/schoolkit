'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the minovateApp
 */
app
	.controller('MainCtrl', function ($scope, $http, $translate, dataService, toaster) {

		$scope.main = {
			title: 'Dashboard',
			settings: {
				navbarHeaderColor: 'scheme-default',
				sidebarColor: 'scheme-default',
				brandingColor: 'scheme-default',
				activeColor: 'default-scheme-color',
				headerFixed: true,
				asideFixed: true,
				rightbarShow: false
			}
		};



		$scope.changeLanguage = function (langKey) {
			$translate.use(langKey);
			$scope.currentLanguage = langKey;
		};
		$scope.currentLanguage = $translate.proposedLanguage() || $translate.use();
	});

'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the minovateApp
 */
app
	.controller('LoginCtrl', function ($scope, $state, toaster, dataService, $cookies, $rootScope) {
		if ($cookies.get('Token', { path: '/elika-warehouse' }) != null && $cookies.get('Token', { path: '/elika-warehouse' }) != '') {
			$state.go('app.inventory.devices');
			return null;
		}
		$scope.user = {};
		$scope.setCookies = function(){
            $scope.user.username = $cookies.get('elikausername');
            $scope.user.password = $cookies.get('elikapassword');
         	if($scope.user.username != undefined){
                $scope.rememberme = true;
            }
        };
        $scope.setCookies();
		$scope.login = function () {
			dataService.login($scope.user, baseUrl + 'login-warehouse')
				.success(function (response) {
					if (response.status == true) {
						if (response.msg == 'Login_Success') {

							$cookies.put('Token', response.data[0].token, { path: '/elika-warehouse' });
							$rootScope.current_user = response.data[0];
							if (response.data[0].userType == 'warehouseAdmin') {
								$cookies.put('facilityId', response.data[0].facilityId);
								$cookies.put('userFirstName', response.data[0].adminFirstName);
								$cookies.put('userLastName', response.data[0].adminLastName);
								$state.go('app.inventory.devices');
							}
							if($scope.rememberme){
	                            $cookies.put('elikausername', $scope.user.username);
	                            $cookies.put('elikapassword', $scope.user.password);                          
	                        }
	                        else{
                            	$cookies.remove('elikausername');
                            	$cookies.remove('elikapassword');
                        	}
						}
					} else {
						if (response.msg == 'Invalid_Credentials') {
							$scope.message = 'Please enter correct email id and password.';
						}
					}
				});
		}
	});


app
    .directive('elikaHeader', function () {
        return {
            templateUrl: 'views/header.html',
            restrict: 'E',
            controller: ['$scope','$rootScope','$cookies','$state', function elikaHeader($scope,$rootScope,$cookies,$state) {
                $scope.userFirstName = $cookies.get('userFirstName');
                $scope.userLastName = $cookies.get('userLastName');
				$scope.userPhoto = $cookies.get('userPhoto');
				var stateArr = $state.$current.name.split('.');
                $scope.active = stateArr[1];

                $rootScope.$on('$stateChangeStart', 
                function(event, toState, toParams, fromState, fromParams){
                    var stateArr = toState.name.split('.');
                    $scope.active = stateArr[1];
                })
            }]
        };
    });