'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:DoorGroupsCtrl
 * @description
 * # DoorGroupsCtrl
 * Controller of the minovateApp
 */
app
    .controller('DoorGroupsCtrl', function ($scope, $mdDialog, DTOptionsBuilder, DTColumnDefBuilder, $http, $timeout, $rootScope, $cookies, arrayPushService, toaster, baseURL, $location, errorHandler, appConstants, doorsSvc) {
        $scope.page = {
            title: appConstants.doorsgroupUiTitle,
            subtitle: appConstants.dashboardSubTitle
        };

        $scope.result = appConstants.empty;
        $scope.showConfirm = function (ev, id) {
            var confirm = $mdDialog.confirm()
                .title(appConstants.doorGroupdeleteconfirmationmessage)
                .content(appConstants.content)
                .ok(appConstants.delete)
                .cancel(appConstants.cancel)
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                //$scope.result = 'Your Doors has been deleted successfully.';
                //$scope.statusclass = 'alert alert-danger alert-dismissable';
                $scope.doorGroupDelete(id);
            }, function () {
                toaster.pop('info', appConstants._messageoncanceltodeletedoorGroup);
            });
        };



        $scope.dtOptions = DTOptionsBuilder.newOptions().withBootstrap();
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2).notSortable()
        ];



        $rootScope.submitCreateDoorGroup = function (doorGroup) {
            doorsSvc.submitCreateDoorGroup(appConstants.doorgroupadd, appConstants.postMethod, {}, { name: doorGroup.name, door_id: doorGroup.doors_id, status: 1, "facility_id": parseInt($cookies.get('facilityId')) }, function (succResponse) {
                if (succResponse.status) {
                    if (succResponse.msg == "DoorGroup_Assigned") {
                        $("#group_close").click();
                    }
                    else {
                        $rootScope.errormsg = succResponse.msg.replace(/_/g, " ");
                    }
                }
                else {
                    $rootScope.errormsg = succResponse.msg;
                }
            });
        };
        $rootScope.createDoorGroup = function (doorGrp,isValid) {
            if (!isValid.validate()) {                
                return false;
            }
        doorsSvc.createDoorGrp(appConstants.doorgroupadd, appConstants.postMethod, {}, doorGrp, function (succResponse) {
				if (succResponse.status) {
                    $scope.getDoorGroupList();
					toaster.pop(appConstants.success, appConstants._successfulldoorsadded);					
					$timeout(function () {
						$("#close").click();
					});
                    
				}
			});
        };
        $scope.getDoorGroupList = function () {
            doorsSvc.getDoorGroupList(appConstants.doorgrouplist, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    //$rootScope.doorGroupList = succResponse.data;
                    $scope.doorgroups = succResponse.data;
                }
            });
        };
        $scope.getDoorGroupList();

        $scope.getDoorsList = function () {
            doorsSvc.getDoorsList(appConstants.doorlist + '?limits=100&pageNo=1', appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.doorList = succResponse.data.data;
                   
                }
            });
        };
        $scope.getDoorsList();

        $rootScope.doorGroupSubmit = function (doorGroup) {
            
            var data = {};
            data.doorgroup_id = parseInt(doorGroup.doorgroup_id);
            data.name = doorGroup.doorgroup_name;
            data.door_id = doorGroup.door_id;
            data.status = 1;
            doorsSvc.doorGroupSubmit(appConstants.doorgroupedit, appConstants.putMethod, {}, data, function (succResponse) {
                if (succResponse.status) {
                    toaster.pop(appConstants.success, succResponse.msg);
                }
            });
        };

        $scope.doorGroupDelete = function (id) {
            doorsSvc.doorGroupDelete(appConstants.doorgroupdelete + '?doorgroup_id=' + id, appConstants.delete, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.getDoorGroupList();
                    toaster.pop('info', appConstants._successfuldoorsdelete);
                     
                }
            });
        };
$scope.facilityInit = function () {
			doorsSvc.facilityInit(appConstants.facilitylist, appConstants.getMethod, {}, {}, function (succResponse) {
				if (succResponse.status) {
					$rootScope.facilityList = succResponse.data.data;			
					
				}
			});
		};
        $scope.facilityInit();
    });