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

		$scope.getTechnicians = function () {
			technicianSvc.getTechnicians(appConstants.technicianlist, appConstants.getMethod, {}, {}, function (succResponse) {
				if (succResponse.status) {
					$scope.technicianList = succResponse.data;
				}
			});
		};
		$scope.getTechnicians();

		$scope.orderByMe = function (x) {
			$scope.myOrderBy = x;
		};

		$rootScope.addTechnicianSubmit = function (data, form) {
			console.log(data);
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
					//console.log($scope.addTechnician.expiration_date);
					//var date = angular.copy(new Date($scope.addTechnician.technician_expiration_date * 1000));
					$scope.addTechnician.expirationdate = angular.copy(new Date($scope.addTechnician.technician_expiration_date * 1000))
					//$scope.addTechnician.expiration_date * 1000;
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
			var ex_date = Data.expirationdate;
			var date = Data.expirationdate;
			Data.expiration_date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
			delete Data["expirationdate"];
			technicianSvc.submitTechProfile(appConstants.edittechnician, appConstants.putMethod, {}, Data, function (succResponse) {
				Data.expirationdate = ex_date;
				if (succResponse.status) {
					toaster.pop(appConstants.success, appConstants._successfullyuserupdatemessage);
					$location.path("/app/admin/support/technician");
				}
			});
		}

		$scope.imagePath = baseURL + appConstants.imagePath;

	});