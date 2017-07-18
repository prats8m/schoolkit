'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:MasterAdminCtrl
 * @description
 * # MasterAdminCtrl
 * Controller of the minovateApp
 */
app
	.controller('MasterAdminCtrl', function ($scope, $mdDialog, $http, $rootScope, dataService, toaster, $timeout) {
		$scope.page = {
			title: 'Master Admin',
		};

		$scope.result = '  ';
		$scope.showConfirm = function (ev, id) {
			var confirm = $mdDialog.confirm()
				.title('Would you like to delete master admin?')
				.content('')
				.ok('Yes')
				.cancel('No')
				.targetEvent(ev);
			$mdDialog.show(confirm).then(function () {
				$scope.deleteMasterAdmin(id)
				// $scope.result = 'Your master admin has been deleted successfully.';
				// $scope.statusclass = 'alert alert-danger alert-dismissable';
			}, function () {
				// $scope.result = 'You decided to keep master admin.';
				// $scope.statusclass = 'alert alert-success alert-dismissable';
			});
		};

		$scope.deleteMasterAdmin = function (id) {
			dataService.deleteData({}, baseUrl + 'warehouse/delete-master-admin?master_id=' + id)
				.success(function (response) {
					if (response.status == true) {
						toaster.pop('success', 'Your master admin has been deleted successfully.');
						$scope.listMasterAdmin();
					} else {
						toaster.pop('error', response.msg.replace('/_/g', " "));
					}
				});
		}

		$scope.layout = 'grid';
		$scope.class = 'gridview';
		$scope.changeClass = function () {
			if ($scope.class === 'gridview')
				$scope.class = 'listview';
			$scope.layout = 'list';
		};

		$scope.changeaClass = function () {
			if ($scope.class === 'listview')
				$scope.class = 'gridview';
			$scope.layout = 'grid';
		};


		$scope.orderByMe = function (x) {
			$scope.myOrderBy = x;
		}

		$.validator.addMethod("regx", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter a valid phone number.");

		$.validator.addMethod("emailregx", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter a valid phone email.");

		$rootScope.submitAddMasterAdmin = function (master, add_master_admin) {
			if (!add_master_admin.validate({
				rules: {
					first_name: {
						maxlength: 15
					},
					last_name: {
						maxlength: 15
					},
					email: {
						minlength: 6,
						maxlength: 35,
						emailregx: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
					},
					password: {
						minlength: 8
					},
					phone: {
						regx: /^[0-9+-]+$/,
						maxlength: 15
					}
				},
				messages: {
					first_name: {
						maxlength: "First Name can't be more than 15 characters"
					},
					last_name: {
						maxlength: "Last Name can't be more than 15 characters"
					},
					email: {
						minlength: "Email can't be more than 6 characters",
						maxlength: "Email can't be more than 35 characters",
						emailregx: "Please enter a valid email1"
					},
					password: {
						minlength: "Password can't be less than 8 characters"
					},
					phone: {
						regx: "Please enter a valid phone number",
						maxlength: "Phone number can't be more than 15 characters"
					}
				}
			})) {
				return false;
			}
			$rootScope.errorMessage = '';
			master.zipcode = parseInt(master.zipcode);

			dataService.postData(master, baseUrl + 'warehouse/add-master-admin')
				.success(function (response) {
					if (response.status == true) {
						toaster.pop('success', 'Master Admin successfully added.');
						$timeout(function () { $("#close").click(); });
						$scope.listMasterAdmin();

					} else {
						var n = [];
						var arr = response.error;
						if (Array.isArray(arr) && arr != null) {
							$.each(arr, function (index, value) {
								n[index] = value.property.split("request.body.")[1].replace(/_/g, ' ')[0].toUpperCase() + value.property.split("request.body.")[1].replace(/_/g, ' ').slice(1);
								$.each(value.messages, function (ind, value) { n[index] += " " + value })
							});
							$rootScope.errorMessage = n.join(", ");
						}
						if (response.msg == 'Invalid_Token') {
							$timeout(function () { $("#close").click(); });
						}
						dataService.responseError(response);
					}
				});
		}

		$scope.listMasterAdmin = function () {
			dataService.getData({}, baseUrl + 'warehouse/list-master-admin')
				.success(function (response) {
					if (response.status == true) {
						$scope.listData = response.data.data;
						$scope.totalDisplayed = 8;

						if ($scope.listData.length > $scope.totalDisplayed) {
							$scope.lmbtn = {
								"display": "block"
							};
						} else {
							$scope.lmbtn = {
								"display": "none"
							};
						}

						$scope.loadMore = function () {
							$scope.totalDisplayed += 8;
							if ($scope.totalDisplayed > $scope.listData.length) {
								$scope.lmbtn = {
									"display": "none"
								};
							}
						};
					} else {
						var n = [];
						var arr = response.error;
						if (Array.isArray(arr) && arr != null) {
							$.each(arr, function (index, value) {
								n[index] = value.property.split("request.body.")[1].replace(/_/g, ' ')[0].toUpperCase() + value.property.split("request.body.")[1].replace(/_/g, ' ').slice(1);
								$.each(value.messages, function (ind, value) { n[index] += " " + value })
							});
							$rootScope.errorMessage = n.join(", ");
						}
						if (response.msg == 'Invalid_Token') {
							$timeout(function () { $("#close").click(); });
						}
						dataService.responseError(response);
					}
				});
		}
		$scope.listMasterAdmin();


	});


'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:MasterAdminProfileCtrl
 * @description
 * # MasterAdminProfileCtrl
 * Controller of the minovateApp
 */
app
	.controller('MasterAdminProfileCtrl', function ($scope, $mdDialog, $http, $rootScope, dataService, toaster, $timeout, $state, $stateParams) {
		$scope.page = {
			title: 'Master Admin Profile',
		};
		$scope.user_id = $stateParams.user_id;
		$scope.result = '  ';
		$scope.showConfirm = function (ev, id) {
			var confirm = $mdDialog.confirm()
				.title('Would you like to delete master admin?')
				.content('')
				.ok('Yes')
				.cancel('No')
				.targetEvent(ev);
			$mdDialog.show(confirm).then(function () {
				$scope.deleteMasterAdmin(id);
			}, function () {
				$scope.result = 'You decided to keep master admin.';
				$scope.statusclass = 'alert alert-success alert-dismissable';
			});
		};

		$scope.deleteMasterAdmin = function (id) {
			dataService.deleteData({}, baseUrl + 'warehouse/delete-master-admin?master_id=' + id)
				.success(function (response) {
					if (response.status == true) {
						toaster.pop('success', 'Your master admin has been deleted successfully.');
						$state.go('app.administrator.master-admin');
					} else {
						toaster.pop('error', response.msg.replace('/_/g', " "));
					}
				});
		}

		$scope.imagePath = 'http://localhost/elika-warehouse/images';

		$scope.viewUserDetails = function () {
			dataService.getData({}, baseUrl + 'user/view-user-details?user_id=' + $stateParams.user_id)
				.success(function (response) {
					if (response.status == true) {
						$scope.userData = response.data;
						$scope.userData.user_status = response.data.user_status;
					} else {
						dataService.responseError(response);
					}
				});
		}
		$scope.viewUserDetails();

		$scope.submitEditProfile = function (data) {
			console.log(data);
			var submitData = {
				user_id: parseInt($stateParams.user_id),
				first_name: data.user_first_name,
				last_name: data.user_last_name,
				phone: data.user_phone_no,
				//	 	password:data.user_first_name,
				//	 	confirm_password:data.user_first_name,
				zipcode: parseInt(data.user_zipcode),
				user_status: data.user_status,
				status: data.user_status,
				address: ' '
			}
			console.log(submitData);
			dataService.putData(submitData, baseUrl + 'warehouse/edit-master-admin')
				.success(function (response) {
					if (response.status == true) {
						$scope.userData = response.data;

						$state.go('app.administrator.master-admin');
					} else {
						dataService.responseError(response);
					}
				});
		}

	});

