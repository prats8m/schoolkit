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
		if ($cookies.get('token') != null && $cookies.get('token') != '') {
			$state.go('app.inventory.devices');
			return null;
		}
		$scope.login = function () {
			dataService.login($scope.user, baseUrl + 'login-warehouse')
				.success(function (response) {
					if (response.status == true) {
						if (response.msg == 'Login_Success') {

							$cookies.put('token', response.data[0].token);
							$rootScope.current_user = response.data[0];
							if (response.data[0].userType == 'warehouseAdmin') {
								$cookies.put('facilityId', response.data[0].facilityId);
								$cookies.put('userFirstName', response.data[0].adminFirstName);
								$cookies.put('userLastName', response.data[0].adminLastName);
								$state.go('app.inventory.devices');
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