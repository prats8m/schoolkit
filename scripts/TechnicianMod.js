'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:TechnicianCtrl
 * @description
 * # TechnicianCtrl
 * Controller of the minovateApp
 */
app
	.controller('TechnicianCtrl', function ($scope, $mdDialog, $http, $rootScope, $cookies, arrayPushService, toaster, baseURL, $location, errorHandler, appConstants, technicianSvc) {

		$scope.page = {
			title: appConstants.technicianUiTitle,
			subtitle: appConstants.dashboardSubTitle
		};
		$scope.status = '  ';
		$scope.showConfirm = function (ev, id) {
			var confirm = $mdDialog.confirm()
				.title(appConstants.deleteuserconfirmationmessage)
				.content(appConstants.content)
				.ok(appConstants.delete)
				.cancel(appConstants.cancel)
				.targetEvent(ev);
			$mdDialog.show(confirm).then(function () {
				$scope.deleteTechnician(id);
			}, function () {
				toaster.pop(appConstants.success, appConstants._canceluserfromdelete);
			});
		};

		$scope.layout = appConstants.gridLayout;
		$scope.class = appConstants.gridviewClass;
		$scope.changeClass = function () {
			if ($scope.class === appConstants.gridviewClass)
				$scope.class = appConstants.listviewClass;
			$scope.layout = appConstants.listLayout;
		};

		$scope.changeaClass = function () {
			if ($scope.class === appConstants.listviewClass)
				$scope.class = appConstants.gridviewClass;
			$scope.layout = appConstants.gridLayout;
		};
		$scope.pageNo = 1;
		$scope.alphabateList = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
		$scope.searchByAlphabet = function (alphabet) {
			//	$scope.searchText = '';
			//	$(".f-wm:contains(" + appConstants.nomoredataavailable + ")").text('Load More').css("opacity", 1);
			$scope.pageNo = 1;
			if (alphabet == 'All') {
				$scope.searchAlphabet = '';
				$scope.getTechnicians();
				return;
			}
			$scope.searchAlphabet = alphabet;
			$scope.getTechnicians();

		}
		$scope.technicianList = [];
		$scope.getTechnicians = function () {
			technicianSvc.getTechnicians(appConstants.technicianlist + '?searchVal=' + '' + '&limits=20&pageNo=' + $scope.pageNo + '&albhabet' + $scope.searchAlphabet, appConstants.getMethod, {}, {}, function (succResponse) {
				if (succResponse.status) {
					if ($scope.pageNo <= 1) {
						$scope.technicianList = []
					}
					angular.forEach(succResponse.data.data, function (tech, index) {
						$scope.technicianList.push(tech);
					})
					$scope.pageNo = $scope.pageNo + 1;
				}
			});
		};
		$scope.getTechnicians();

		$scope.orderByMe = function (x) {
			$scope.myOrderBy = x;
		};

		$rootScope.addTechnicianSubmit = function (data, form) {

			if (!form.validate()) {
				return false;
			}
			var ex_date = data.expirationdate;
			var date = new Date(data.expirationdate);
			data.expiration_date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
			delete data["expirationdate"];

			technicianSvc.addTechnicianSubmit(appConstants.addtechnician, appConstants.postMethod, {}, data, function (succResponse) {
				data.expirationdate = ex_date;
				if (succResponse.status) {
					toaster.pop(appConstants.success, appConstants.submitSuccessfully);
					setTimeout(function () { $("#close").click(); }, 10);
					$scope.getTechnicians();
				}
			});
		}

		$scope.deleteTechnician = function (technician_id) {
			technicianSvc.deleteTechnician(appConstants.deletetechnician + "?technician_id=" + technician_id, appConstants.deleteMethod, {}, {}, function (succResponse) {
				if (succResponse.status) {
					toaster.pop(appConstants.success, appConstants._successfullyuserdeletedmessage);
					$scope.getTechnicians();
				}
			});
		}

		$scope.imagePath = baseURL + appConstants.imagePath;

	});

'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:TechnicianProfileCtrl
 * @description
 * # TechnicianProfileCtrl
 * Controller of the minovateApp
 */
app
	.controller('TechnicianProfileCtrl', function ($scope, $mdDialog, $http, $rootScope, $cookies, arrayPushService, toaster, baseURL, $location, errorHandler, appConstants, technicianSvc, $stateParams, utilitySvc) {
		$scope.page = {
			title: appConstants.technicianProfileUiTitle,
			subtitle: appConstants.dashboardSubTitle
		};

		$scope.getTechnician = function () {
			technicianSvc.getTechnician(appConstants.viewtechnician, appConstants.getMethod, { technician_id: $stateParams.technician_id }, {}, function (succResponse) {
				if (succResponse.status) {
					$scope.technician = succResponse.data;
					$scope.addTechnician = angular.copy($scope.technician);
					var date = angular.copy(new Date($scope.addTechnician.technician_expiration_date * 1000));
					$scope.addTechnician.expiration_date = (date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCFullYear());

					// $scope.addTechnician.expiration_date = angular.copy(new Date($scope.addTechnician.technician_expiration_date * 1000));
				}
			});
		};
		$scope.getTechnician();

		$scope.showConfirm = function (ev, id) {
			var confirm = $mdDialog.confirm()
				.title(appConstants.deleteuserconfirmationmessage)
				.content(appConstants.content)
				.ok(appConstants.delete)
				.cancel(appConstants.cancel)
				.targetEvent(ev);
			$mdDialog.show(confirm).then(function () {
				//$scope.status = appConstants._successfullyuserdeletedmessage;
				//$scope.statusclass = appConstants.dangerstatusClass;
				$scope.deleteTechnician(id);
			}, function () {
				toaster.pop(appConstants.success, appConstants._canceluserfromdelete);
				//$scope.status = appConstants._canceluserfromdelete;
				//$scope.statusclass = appConstants.successstatusClass;
			});
		};

		$scope.deleteTechnician = function (technician_id) {
			technicianSvc.deleteTechnician(appConstants.deletetechnician + "?technician_id=" + technician_id, appConstants.deleteMethod, {}, {}, function (succResponse) {
				if (succResponse.status) {
					toaster.pop(appConstants.success, appConstants._successfullyuserdeletedmessage);
					$location.path("/app/admin/support/technician");
				}
			});
		}

		$scope.submitTechProfile = function (Data, form) {
			if (!form.validate()) {
				return false;
			}
			var ex_date = Data.expiration_date;


			if (isNaN(Data.expiration_date)) {
				var d = Data.expiration_date.split("/");
				var date = new Date(d[2] + "/" + d[1] + "/" + d[0]);
			}
			else {
				var date = Data.expiration_date;
			}


			Data.expiration_date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
			//delete Data["expiration_date"];
			technicianSvc.submitTechProfile(appConstants.edittechnician, appConstants.putMethod, {}, Data, function (succResponse) {
				Data.expiration_date = ex_date;
				if (succResponse.status) {
					toaster.pop(appConstants.success, appConstants._successfullyuserupdatemessage);
					$location.path("/app/admin/support/technician");
				}
			});
		}

		$scope.imagePath = baseURL + appConstants.imagePath;

	});