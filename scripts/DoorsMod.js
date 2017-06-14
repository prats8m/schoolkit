'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:DoorCtrl
 * @description
 * # DoorCtrl
 * Controller of the minovateApp
 */
app
	.controller('DoorCtrl', function ($scope, $mdDialog, $http, $rootScope, baseURL, $cookies, toaster, arrayPushService, $timeout, $location, appConstants, doorsSvc) {
		$scope.page = {
			title: appConstants.doorsUITitle,
			subtitle: appConstants.dashboardSubTitle
		};
		$rootScope.addDoors = {};
		$scope.hideLoadMore = false;
		$rootScope.facilityId = $cookies.get('facilityId');

		$scope.result = appConstants.empty;
		$scope.showConfirm = function (ev, door_id) {
			var confirm = $mdDialog.confirm()
				.title(appConstants.doorsdeleteconfirmationmessage)
				.content(appConstants.empty)
				.ok(appConstants.delete)
				.cancel(appConstants.cancel)
				.targetEvent(ev);
			$mdDialog.show(confirm).then(function () {
				//Code to delete door
				doorsSvc.deletedoors(appConstants.doordelete + door_id, appConstants.delete, {}, {}, function (succResponse) {
					if (succResponse.status) {
						toaster.pop(appConstants.success, appConstants._successfuldoorsdelete);
						var adoor = $scope.adoors;
						var tempUser = [];
						for (var i = 0; i < adoor.length; i++) {
							if (door_id != adoor[i].door_id) {
								tempUser.push(adoor[i]);
							}
						}
						$scope.adoors = tempUser;
						$rootScope.dashboardData.door--;
					}
				});
				//Code end to delete door
			}, function () {
				toaster.pop(appConstants.info, appConstants._messageoncanceltodeletedoors);
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
		$scope.searchText = appConstants.empty;

		$scope.facilityInit = function () {
			doorsSvc.facilityInit(appConstants.facilitylist, appConstants.getMethod, {}, {}, function (succResponse) {
				if (succResponse.status) {
					$rootScope.facilityList = succResponse.data.data;
					$rootScope.addDoors.facility_id = parseInt($cookies.get('facilityId'));
				}
			});
		};
		$scope.facilityInit();

		$rootScope.submitAddDoor = function (submitData) {
			doorsSvc.submitAddDoor(appConstants.dooradd, appConstants.postMethod, {}, submitData, function (succResponse) {
				if (succResponse.status) {
					toaster.pop(appConstants.success, appConstants._successfulldoorsadded);
					$scope.pageNo = 1;
					$scope.listDoors();
					$rootScope.dashboardData.door++;
				}
			});
		};

		$scope.orderByMe = function (x) {
			$scope.myOrderBy = x;
		};

		$scope.dashboardInit = function () {
			doorsSvc.dashboardInit(appConstants.userDashboard, appConstants.getMethod, {}, {}, function (succResponse) {
				if (succResponse.status) {
					$rootScope.dashboardData = succResponse.data;
				}
			});
		};
		$scope.dashboardInit();


		//Create Doors
		$rootScope.doormsg = appConstants.empty;
		$rootScope.createDoor = function (door, create_door) {
			if (!create_door.validate()) {
				return false;
			}
			//door.facility_id = parseInt($cookies.get("facilityId"));
			door.description = " ";
			doorsSvc.createDoor(appConstants.dooradd, appConstants.postMethod, {}, door, function (succResponse) {
				if (succResponse.status) {
					toaster.pop(appConstants.success, appConstants._successfulldoorsadded);
					$scope.pageNo = 1;
					$scope.listDoors();
					$rootScope.dashboardData.door++;
					$timeout(function () {
						$("#close").click();
					});
				}
			});
		};
		//End of create door

		//Search Door
		$scope.searchFunction = function (e) {
			if (e)
				if (e.keyCode != 13) { return false; }
			if (!$scope.searchText) {
				$scope.searchText = appConstants.empty;
			}
			$scope.pageNo = 1;
			$scope.users = [];
			doorsSvc.searchFunction(appConstants.doorlist + '?limit=8&pageNo=' + $scope.pageNo + '&searchVal=' + $scope.searchText, appConstants.getMethod, {}, {}, function (succResponse) {
				$scope.adoors = [];
				if (succResponse.status) {
					$scope.adoors = succResponse.data.data;
					$scope.pageNo = $scope.pageNo + 1;
				}
			});
		};

		//End of search door

		//List Doors
		$scope.pageNo = 1;
		$scope.searchText = appConstants.empty;
		$scope.adoors = [];
		$scope.listDoors = function () {
			doorsSvc.listDoors(appConstants.doorlist + '?limit=8&pageNo=' + $scope.pageNo, appConstants.getMethod, {}, {}, function (succResponse) {
				if (succResponse.status) {
					if ($scope.pageNo != 1) {
						for (var i in succResponse.data.data) {
							var temp = false;
							for (var j in $scope.adoors) {
								if ($scope.adoors[j].door_id == succResponse.data.data[i].door_id) {
									temp == true;
								}
							}
							if (!temp) {
								$scope.adoors.push(succResponse.data.data[i]);
							}
						}
					} else {
						$scope.adoors = [];
						for (var i in succResponse.data.data) {
							$scope.adoors.push(succResponse.data.data[i]);
						}
					}
					if (succResponse.data.data.length < 8) { $scope.hideLoadMore = true; } else { $scope.hideLoadMore = false; }
					$scope.pageNo = $scope.pageNo + 1;
				} else if (succResponse.msg == 'No_Record_Found') {

					$scope.adoors = [];
					$scope.status = succResponse.msg.replace(/_/g, ' ');;
					$scope.statusclass = appConstants.error;
				}
				else {
					$rootScope.doormsg = succResponse.msg;
				}
			});
		};
		$scope.listDoors();
		//End of list doors
		$scope.facilityInit = function () {
			doorsSvc.facilityInit(appConstants.facilitylist, appConstants.getMethod, {}, {}, function (succResponse) {
				if (succResponse.status) {
					$rootScope.facilityList = succResponse.data.data;
				}
				else {
					$rootScope.facilityList = {};
				}
				console.log("facilitylist" + JSON.stringify($rootScope.facilityList));
			});
		};
		$scope.facilityInit();

		$scope.imagePath = baseURL + appConstants.imagePath;

	});

'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:ViewDoorCtrl
 * @description
 * # ViewDoorCtrl
 * Controller of the minovateApp
 */
app
	.controller('ViewDoorCtrl', function ($scope, $http, $cookies, $stateParams, baseURL, $rootScope, $location, toaster, $timeout, $mdDialog, appConstants, doorsSvc) {
		$scope.page = {
			title: appConstants.viewdoordetailsUITitle,
			subtitle: appConstants.dashboardSubTitle
		};

		$scope.imagePath = baseURL + appConstants.imagePath;
		// $scope.doorData = {};
		// $scope.doorData.door_status = 1;
		$scope.doorInit = function () {
			doorsSvc.doorInit(appConstants.doorview + '?doorId=' + $stateParams.door_id, appConstants.getMethod, {}, {}, function (succResponse) {
				if (succResponse.status) {
					$scope.doorData = succResponse.data;
					$scope.facilityInit();
				}
			});
		};

		$scope.doorInit();

		$scope.facilityInit = function () {
			doorsSvc.facilityInit(appConstants.facilitylist, appConstants.getMethod, {}, {}, function (succResponse) {
				if (succResponse.status) {
					$scope.facilityList = succResponse.data.data;
					$scope.doorData.facility_id = parseInt($cookies.get('facilityId'));
				}
				else {
					$scope.facilityList = {};
				}
				console.log("scope of facility list" + $scope.facilityList);
			});
		};

		$scope.editDoordata = function (doorData, door_data) {
			doorData.facility_id = doorData.facility.facility_id;
			delete doorData.facility;
			doorsSvc.editDoordata(appConstants.dooredit, appConstants.putMethod, {}, doorData, function (succResponse) {
				if (succResponse.status) {
					toaster.pop(appConstants.success, succResponse.msg);
					$location.path('/app/admin/door/doors');
				}
			});
		};

		$scope.result = appConstants.empty;
		$scope.showConfirm = function (ev, door_id) {
			var confirm = $mdDialog.confirm()
				.title(appConstants.doorsdeleteconfirmationmessage)
				.content(appConstants.empty)
				.ok(appConstants.delete)
				.cancel(appConstants.cancel)
				.targetEvent(ev);
			$mdDialog.show(confirm).then(function () {
				//Code to delete door
				doorsSvc.deletedoors(appConstants.doordelete + door_id, appConstants.deleteMethod, {}, {}, function (succResponse) {
					if (succResponse.status) {
						$rootScope.dashboardData.door--;
						$location.path('/app/admin/door/doors');
					}
				});
				//Code end to delete door
			}, function () {
				toaster.pop('info', appConstants._messageoncanceltodeletedoors);
			});
		};
		if ($stateParams.type == "edit") {
			$timeout(function () {
				$("a:contains('Edit Door')").click();
			});
		}

		$scope.dashboardInit = function () {
			doorsSvc.dashboardInit(appConstants.userDashboard, appConstants.getMethod, {}, {}, function (succResponse) {
				if (succResponse.status) {
					$rootScope.dashboardData = succResponse.data;
				}
			});
		};
		$scope.dashboardInit();

	});

app
	.controller('EditDoorCtrl', function ($scope, $http, $cookies, $stateParams, baseURL, $rootScope, $location, toaster, $timeout, $mdDialog, appConstants, doorsSvc) {
		$scope.page = {
			title: appConstants.editdoorUiTitle
		};

		$scope.imagePath = baseURL + appConstants.imagePath;

		$scope.facilityInit = function () {
			doorsSvc.facilityInit(appConstants.facilitylist, appConstants.getMethod, {}, {}, function (succResponse) {
				if (succResponse.status) {
					$rootScope.facilityList = succResponse.data.data;
					$scope.doorInit();
				}
			});
		};

		$scope.showConfirm = function (ev, door_id) {
			var confirm = $mdDialog.confirm()
				.title(appConstants.doorsdeleteconfirmationmessage)
				.content(appConstants.empty)
				.ok(appConstants.delete)
				.cancel(appConstants.cancel)
				.targetEvent(ev);
			$mdDialog.show(confirm).then(function () {
				//Code to delete door
				doorsSvc.deletedoors(appConstants.doordelete + door_id, appConstants.deleteMethod, {}, {}, function (succResponse) {
					if (succResponse.status) {
						$rootScope.dashboardData.door--;
						$location.path('/app/admin/door/doors');
					}
				});
				//Code end to delete door
			}, function () {
				toaster.pop('info', appConstants._messageoncanceltodeletedoors);
			});
		};

		$scope.doorInit = function () {
			$scope.field = {
				facility: ''
			};
			doorsSvc.doorInit(appConstants.doorview + '?doorId=' + $stateParams.door_id, appConstants.getMethod, {}, {}, function (succResponse) {
				if (succResponse.status) {
					$scope.doorData = succResponse.data;
					$scope.field.facility = $scope.doorData;
					console.log($scope.field.facility);
				}
			});
		};

		$scope.facilityInit();

		$scope.editDoordata = function (doorData, door_data) {
			if (!door_data.validate()) {
				return false;
			}
			doorData.facility_id = parseInt(doorData.facility_id);
			delete doorData.facility;

			doorsSvc.editDoordata(appConstants.dooredit, appConstants.putMethod, {}, doorData, function (succResponse) {
				if (succResponse.status) {
					toaster.pop(appConstants.success, succResponse.msg);
				}
			});
		};

		$scope.dashboardInit = function () {
			doorsSvc.dashboardInit(appConstants.userDashboard, appConstants.getMethod, {}, {}, function (succResponse) {
				if (succResponse.status) {
					$rootScope.dashboardData = succResponse.data;
				}
			});
		};
		$scope.dashboardInit();
	});

