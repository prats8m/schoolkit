'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:DoorGroupsCtrl
 * @description
 * # DoorGroupsCtrl
 * Controller of the minovateApp
 */
app
    .controller('DoorGroupsCtrl', function ($scope, $mdDialog, DTOptionsBuilder, DTColumnDefBuilder, $http, $timeout, $rootScope, $cookies, arrayPushService, toaster, baseURL, $location, errorHandler, appConstants, doorsSvc,utilitySvc) {
        $scope.page = {
            title: appConstants.doorsgroupUiTitle,
            subtitle: appConstants.dashboardSubTitle
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
                toaster.pop('success', appConstants._messageoncanceltodeletedoorGroup);
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
        $rootScope.createDoorGroup = function (doorGrp, isValid) {
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
        $scope.alphabateList = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        $scope.searchText = '';
        $scope.pageNo = 1;
        $scope.searchAlphabet = '';
        $scope.searchByAlphabet = function (alphabet) {
            $scope.searchText = '';
            // $(".f-wm:contains(" + appConstants.nomoredataavailable + ")").text('Load More').css("opacity", 1);
            $scope.pageNo = 1;
            if (alphabet == 'All') {
                $scope.searchAlphabet = '';
                $scope.getDoorGroupList();
                return;
            }
            $scope.searchAlphabet = alphabet;
            $scope.getDoorGroupList();
        }
        $scope.refreshList = function () {
            $scope.searchAlphabet = '';
            $scope.pageNo = 1;
            $scope.getDoorGroupList();
        }
        $scope.searchFunction = function () {
            $scope.searchAlphabet = '';
            $scope.pageNo = 1;
            $scope.getDoorGroupList();
        }
        $scope.doorgroups = [];
        $scope.getDoorGroupList = function () {
            doorsSvc.getDoorGroupList(appConstants.doorgrouplist + '?limits='+ appConstants.pageLimit +'&pageNo=' + $scope.pageNo +"&facility_id="+ utilitySvc.getCurrentFacility()+ "&searchVal=" + $scope.searchText + '&albhabet=' + $scope.searchAlphabet, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    if ($scope.pageNo <= 1) {
                        $scope.doorgroups = [];
                    }
                    angular.forEach(succResponse.data.data, function (data, index) {
                        $scope.doorgroups.push(data);
                    })
                    $scope.count = succResponse.data.count;
                    $scope.pageNo = $scope.pageNo + 1;
                } else if (succResponse.msg == 'No_Records_Found') {
                    $scope.doorgroups = [];
                }
            });
        };
        $scope.getDoorGroupList();

        $scope.getDoorsList = function () {
            doorsSvc.getDoorsList(appConstants.doorlist + '?limits=1000&pageNo=1', appConstants.getMethod, {}, {}, function (succResponse) {
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

        $scope.facilityInit = function () {
            doorsSvc.facilityInit(appConstants.facilitylist, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.facilityList = succResponse.data.data;

                }
            });
        };
        $scope.facilityInit();
    });


'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:ViewDoorGroupsCtrl
 * @description
 * # ViewDoorGroupsCtrl
 * Controller of the minovateApp
 */
app
  .controller('ViewDoorGroupsCtrl', function ($scope, $mdDialog, $state, $http,$stateParams,appConstants,doorsSvc) {
    $scope.page = {
      title: 'Door Group Details',
    };    
    $scope.doorgroup_id = $stateParams.doorgroup_id;
  $scope.doorGrpInit = function () {    
            doorsSvc.doorInit(appConstants.doorgroupview + '?doorgroup_id=' + $stateParams.doorgroup_id, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.doorGrpData = succResponse.data;                 
                }
            });
        };
        $scope.doorGrpInit();
    $scope.result = '';
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
            toaster.pop('success', appConstants._messageoncanceltodeletedoorGroup);
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

    $scope.imagePath = 'http://localhost/elikastaging/images';

  });

'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:EditDoorGroupsCtrl
 * @description
 * # EditDoorGroupsCtrl
 * Controller of the minovateApp
 */
app
  .controller('EditDoorGroupsCtrl', function ($scope, $mdDialog, $state,toaster, $rootScope,$http,doorsSvc,appConstants,$stateParams) {
    $scope.page = {
      title: 'Edit Door Group',
    };
    $scope.doorgroup_id = $stateParams.doorgroup_id;
     $scope.getDoorsList = function () {
            doorsSvc.getDoorsList(appConstants.doorlist + '?limits=100&pageNo=1', appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.doorList = succResponse.data.data;
                   
                }
            });
        };
    $scope.getDoorsList();
    $scope.facilityInit = function () {
            doorsSvc.facilityInit(appConstants.facilitylist, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.facilityList = succResponse.data.data;           
                    
                }
            });
        };
        $scope.facilityInit();
    $scope.doorGrpInit = function () {    
            doorsSvc.doorInit(appConstants.doorgroupview + '?doorgroup_id=' + $stateParams.doorgroup_id, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.doorGrpData = succResponse.data;
                    var doors = succResponse.data.door_name;
                    $scope.doorGrpData.door_id = [];
                    for(var i = 0; i < doors.length; i++){
                        $scope.doorGrpData.door_id.push(doors[i].door_id);
                    }                         
                }
            });
        };
        $scope.doorGrpInit();

    $scope.editDoorGrpdata=function(doorGrpData, doorGrp_data){
      if (!doorGrp_data.validate()) {
                return false;
            }
     
      var editDoorGrpData={
        doorgroup_id:parseInt($stateParams.doorgroup_id) ,
        name:doorGrpData.doorgroup_name,
        status:doorGrpData.doorgroup_status,
        door_id:doorGrpData.door_id,
        facility_id:0
      };
        angular.forEach($rootScope.facilityList, function(value, key) {
            if(value.facility_name==doorGrpData.facility_name)
            {
                editDoorGrpData.facility_id=value.facility_id;
            };
        });
        // angular.forEach($rootScope.doorList, function(value1, key) {
        //     angular.forEach(doorGrpData.door_name, function(value2, key) {
        //         if(value1.door_name==value2)
        //         {
        //             editDoorGrpData.door_id.push(value1.door_id);
        //         };
        //     });
        // });
    
        doorsSvc.editDoorGrpdata(appConstants.doorgroupedit, appConstants.putMethod, {}, editDoorGrpData, function (succResponse) {
            if (succResponse.status) {          
                toaster.pop(appConstants.success, succResponse.msg);
                $location.path('/app/admin/door/doors');
            }
        });
    };
    $scope.result = '';
    $scope.showConfirm = function (ev, id) {
        var confirm = $mdDialog.confirm()
            .title(appConstants.doorGroupdeleteconfirmationmessage)
            .content(appConstants.content)
            .ok(appConstants.delete)
            .cancel(appConstants.cancel)
            .targetEvent(ev);
        $mdDialog.show(confirm).then(function () {
            $scope.doorGroupDelete(id);
        }, function () {
            toaster.pop('success', appConstants._messageoncanceltodeletedoorGroup);
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

    $scope.imagePath = 'http://localhost/elikastaging/images';

  });