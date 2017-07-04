'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:CameraDVRCtrl
 * @description
 * # CameraDVRCtrl
 * Controller of the minovateApp
 */
app
    .controller('CameraDVRCtrl', function ($scope, $mdDialog, $http, baseURL, $cookies, $rootScope, $filter, toaster, $sce, $timeout, appConstants, cameraDVRSvc,utilitySvc) {
        $scope.page = {
            title: appConstants.cameraDVRtitle
        };
        $scope.camgroup = {
            name: appConstants.cameraGroupButtonTitle
        };

        $scope.recordedFeedsSearchObj = {}

        $rootScope.cameraidsToCreateGroup = [];
        /*$scope.dashboardInit = function () {
            cameraDVRSvc.dashboardInit(appConstants.userDashboard, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.dashboardData = succResponse.data ? succResponse.data : [];
                }
            });
        };
        $scope.dashboardInit();*/

        $scope.showcamadd = function () {
            $("#camform").css("display", appConstants.inlineblock);

        };
        $scope.hidecamadd = function () {
            $("#camform").css("display", appConstants.none);

        };

        $scope.checkIfDeleteCameraGroupValidAnchor = function (ev) {
            if (!$scope.isaddCameraGroup && $scope.selectedCameraGroup) {
                $scope.showConfirm(ev);
                return true;
            }
            else {
                return false;
            }
        };
        $scope.doorlist = [];
        $scope.getDoorList = function (id) {
            cameraDVRSvc.getCameraDoorList(appConstants.getCameraDoorList + '?camera_id=' + id, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    if (succResponse.data.length > 0) {
                        var list = {};
                        list.camera_id = succResponse.data[0].camera_id;
                        list.doorlist = [];
                        angular.forEach(succResponse.data, function (doorlist, index) {
                            var lst = {};
                            lst.door_id = doorlist.door_id;
                            lst.door_name = doorlist.door_name;
                            list.doorlist.push(lst);
                        });
                        $scope.doorlist.push(list);
                    }
                }
            })
        }
        $scope.getCameraDoor = function (id) {
            var list = [];
            angular.forEach($scope.doorlist, function (doorlist, index) {
                if (doorlist.camera_id == id) {
                    list = doorlist.doorlist;
                }
            })
            return list;
        }
        $scope.openDoor = function (door_id) {
            cameraDVRSvc.openCameraDoor(appConstants.openDoorCommand + door_id, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    toaster.pop(appConstants.success, "Door Opened Successfully");
                }
            });
        }
        $scope.result = appConstants.empty;
        $scope.showConfirm = function (ev) {

            var confirm = $mdDialog.confirm()
                .title(appConstants._deleteCameraGroupMessage)
                .content(appConstants.empty)
                .ok(appConstants.yes)
                .cancel(appConstants.cancel)
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                $scope.deleteCameraGroup($scope.selectedCameraGroup, function (isDeleted) {
                    if (isDeleted) {
                        $scope.getCameraGroups(function (lstCameraGroup) {
                            $scope.selectedCameraGroup = null;
                            setTimeout(function () {
                                $('#cameraGroupDD').val('')
                            }, 1000);
                            toaster.pop('info', appConstants._successfullCameraGroupDeleted);
                        });
                    }
                    else {
                        toaster.pop('info', appConstants._failedTodeleteCameraGroup);
                    }
                })

            }, function () {
                toaster.pop('info', appConstants._canceltoDeleteCameraGroup);
            });
        };

        $scope.layout = appConstants.onecamlayout;
        $scope.class = appConstants.onecamgrid;
        $scope.isaddCameraGroup = true;
        $scope.changeaClass = function () {
            if ($scope.class === appConstants.fourcamgrid || $scope.class === appConstants.twocamgrid || $scope.class === appConstants.onecamgrid)
                $scope.class = appConstants.sixcamgrid;
            $scope.layout = appConstants.sixcamlayout;
            $scope.isaddCameraGroup = false;
        };

        $scope.changebClass = function () {
            if ($scope.class === appConstants.twocamgrid || $scope.class === appConstants.onecamgrid || $scope.class === appConstants.sixcamgrid)
                $scope.class = appConstants.fourcamgrid;
            $scope.layout = appConstants.fourcamlayout;
            $scope.isaddCameraGroup = false;
        };

        $scope.changecClass = function () {
            if ($scope.class === appConstants.onecamgrid || $scope.class === appConstants.sixcamgrid || $scope.class === appConstants.fourcamgrid)
                $scope.class = appConstants.twocamgrid;
            $scope.layout = appConstants.twocamlayout;
            $scope.isaddCameraGroup = false;
        };

        $scope.changedClass = function () {
            if ($scope.class === appConstants.sixcamgrid || $scope.class === appConstants.fourcamgrid || $scope.class === appConstants.twocamgrid)
                $scope.class = appConstants.onecamgrid;
            $scope.layout = appConstants.onecamlayout;
            $scope.isaddCameraGroup = true;
        };

        $scope.totalNoOfCameras = 0;
        $scope.cameraInit = function (filteredBy, filteringItem) {
            if (filteredBy) {
                switch (filteredBy) {
                    case 'Facility Name':
                        $scope.selectedCameraGroup = '';
                        $scope.selectedFacility = filteringItem ? filteringItem : '';
                        break;
                    case 'Camera Group':
                        $scope.selectedFacility = '';
                        $scope.selectedCameraGroup = filteringItem ? filteringItem : '';
                        break;
                }
            }
            else {
                $scope.selectedFacility = appConstants.empty;
                $scope.selectedCameraGroup = appConstants.empty;
            }
            cameraDVRSvc.cameraInit(appConstants.cameralist + '?facility_id=' + $scope.selectedFacility + '&cameragroup_id=' + $scope.selectedCameraGroup, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.changedClass();
                    if (succResponse.msg === 'No_Record_Found') {
                        toaster.pop(appConstants.error, appConstants.nocamerafoundonfilter);
                        $scope.totalNoOfCameras = 0;
                        $scope.cameras = [];
                    }
                    else {
                        $scope.totalNoOfCameras = succResponse.data ? succResponse.data.count : 0;
                        $scope.cameras = succResponse.data ? succResponse.data.data : [];
                    }
                    $scope.generateLayoutForCamDisplay();
                }
            });
        };

        $scope.cameraInit();


        $scope.UpdateCamerasBasedOnCameraGroup = function (selectedCameraGroup) {
            if (selectedCameraGroup) {
                $scope.result = appConstants.empty;
                $scope.statusclass = appConstants.empty;
                $scope.selectedCameraGroup = selectedCameraGroup;
                var camerasForSelectedGroup = [];
                camerasForSelectedGroup = $scope.cameraGroupList.filter(function (obj) {
                    return (obj.cg_id == $scope.selectedCameraGroup)
                });
                if (camerasForSelectedGroup.length > 0) {
                    var camerasID = camerasForSelectedGroup[0].cg_camera_id.split(',');
                    if (camerasID && camerasID.length > 0) {
                        var filteredCams = [];
                        for (var i = 0; i < camerasID.length; i++) {
                            var flag = false;
                            for (var j = 0; j < $scope.cameras.length; j++) {
                                if (camerasID[i] == $scope.cameras[j].camera_id) {
                                    filteredCams.push($scope.cameras[j]);
                                    break;
                                }
                            }
                        }
                        $scope.filteredCamerasToShow = [];
                        $rootScope.cameraidsToCreateGroup = [];
                        var sortedCamArr = $filter('orderBy')(filteredCams, 'camera_id');
                        if (sortedCamArr && sortedCamArr.length > 0) {
                            for (var i = 0; i < sortedCamArr.length; i++) {
                                $scope.filteredCamerasToShow.push(sortedCamArr[i]);
                                $rootScope.cameraidsToCreateGroup.push(sortedCamArr[i].camera_id);
                            }
                        }
                        switch (filteredCams.length) {
                            case 1:
                                $scope.changedClass();
                                break;
                            case 2:
                                $scope.changecClass();
                                break;
                            case 3:
                            case 4:
                                $scope.changebClass();
                                break;
                            case 5:
                            case 6:
                                $scope.changeaClass();
                                break;
                            default:

                        }
                        // $scope.resetAllMediaPlayers();
                        setTimeout(function () {
                            for (var camInd = 0; camInd < $scope.filteredCamerasToShow.length; camInd++) {
                                callPlayer($scope.filteredCamerasToShow[camInd].camera_id, $scope.filteredCamerasToShow[camInd].vedio_url, $scope.layout);
                            }
                        }, 1000);
                    }
                }
            }
            else {
                $scope.changedClass();
                // $scope.setTotalVideosToWatch(1,1,1);
            }
        }


        $scope.setTotalVideosToWatch = function (camLayoutType, startIndex, endIndex) {
            $scope.filteredCamerasToShow = [];
            $rootScope.cameraidsToCreateGroup = [];

            if ($scope.selectedCameraGroup || $('#cameraGroupDD').val() != '') {

                $scope.selectedCameraGroup = null;
                setTimeout(function () {
                    $('#cameraGroupDD').val('')
                }, 1000)
            }

            $scope.result = '';
            $scope.statusclass = '';
            var sortedCamArr = $filter('orderBy')($scope.cameras, 'camera_id');
            if (sortedCamArr && sortedCamArr.length > 0) {
                for (var i = startIndex; i <= endIndex; i++) {
                    $scope.filteredCamerasToShow.push(sortedCamArr[i - 1]);
                    $rootScope.cameraidsToCreateGroup.push(sortedCamArr[i - 1].camera_id);
                }
            }

            // $scope.resetAllMediaPlayers();
            setTimeout(function () {
                for (var camInd = 0; camInd < $scope.filteredCamerasToShow.length; camInd++) {
                    callPlayer($scope.filteredCamerasToShow[camInd].camera_id, $scope.filteredCamerasToShow[camInd].vedio_url, $scope.layout);
                }
            }, 1000);
        };


        $scope.generateLayoutForCamDisplay = function () {
            var layoutIcons = [1, 2, 4, 6];
            for (var layoutIc = 0; layoutIc < layoutIcons.length; layoutIc++) {
                switch (layoutIcons[layoutIc]) {
                    case 1:
                        $scope.camDisplayGroup_1 = [];
                        angular.forEach($scope.cameras, function (value, key) {
                            $scope.camDisplayGroup_1.push(key + 1);
                        });
                    case 2:
                        $scope.camDisplayGroup_2 = [];
                        var count = 0;
                        for (var i = 0; i < $scope.cameras.length; i++) {
                            count++;
                            if (count % 2 == 0) {
                                $scope.camDisplayGroup_2.push({ startInd: count - 1, endInd: count });
                            }
                            else if (count == $scope.cameras.length) {
                                $scope.camDisplayGroup_2.push({ startInd: $scope.camDisplayGroup_2.length > 0 ? $scope.camDisplayGroup_2[$scope.camDisplayGroup_2.length - 1].endInd + 1 : 1, endInd: count });
                            }
                        }
                    case 4:
                        $scope.camDisplayGroup_4 = [];
                        var count = 0;
                        for (var i = 0; i < $scope.cameras.length; i++) {
                            count++;
                            if (count % 4 == 0) {
                                $scope.camDisplayGroup_4.push({ startInd: count - 3, endInd: count });
                            }
                            else if (count == $scope.cameras.length) {
                                $scope.camDisplayGroup_4.push({ startInd: $scope.camDisplayGroup_4.length > 0 ? $scope.camDisplayGroup_4[$scope.camDisplayGroup_4.length - 1].endInd + 1 : 1, endInd: count });
                            }
                        }
                    case 6:
                        $scope.camDisplayGroup_6 = [];
                        var count = 0;
                        for (var i = 0; i < $scope.cameras.length; i++) {
                            count++;
                            if (count % 6 == 0) {
                                $scope.camDisplayGroup_6.push({ startInd: count - 5, endInd: count });
                            }
                            else if (count == $scope.cameras.length) {
                                $scope.camDisplayGroup_6.push({ startInd: $scope.camDisplayGroup_6.length > 0 ? $scope.camDisplayGroup_6[$scope.camDisplayGroup_6.length - 1].endInd + 1 : 1, endInd: count });
                            }
                        }
                    //break;
                }
            }
            $scope.setTotalVideosToWatch(1, 1, 1);
        };

        $scope.selectedCameraGroup = null;
        $scope.getCameraGroups = function (cb) {
            $scope.cameraGroupList = [];
            cameraDVRSvc.getCameraGroups(appConstants.cameragrouplist, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    if (succResponse.data) {
                        $scope.cameraGroupList = succResponse.data;
                        cb($scope.cameraGroupList);
                    }
                }
                else {
                    cb([]);
                }
            });
        };

        $scope.selectedFacility = appConstants.null;
        $scope.getfacilites = function (srchitem, limit, pageNo, cb) {
            $scope.facilityList = [];
            cameraDVRSvc.getfacilites(appConstants.facilitylist + '?search_val=' + srchitem + '&limit=' + limit + '&pageNo=' + pageNo, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    if (succResponse.data) {
                        $scope.facilityList = succResponse.data.data;
                    }
                    if(utilitySvc.getCurrentFacility() != ''){
                        $scope.recordedFeedsSearchObj.facility = parseInt( utilitySvc.getCurrentFacility() );
                        //$scope.facility_disable = true;
                    }
                    $scope.getCameraGroups(function (lstCameraGroup) {
                        cb($scope.facilityList, lstCameraGroup);
                    });
                }
                else {
                    $scope.getCameraGroups(function (lstCameraGroup) {
                        cb($scope.facilityList, lstCameraGroup);
                    });
                }
            });
        };



        $scope.swapCameraWithExisting = function (existingCamID, toBeReplaceID) {
            var selectedCam = [];
            selectedCam = $scope.cameras.filter(function (obj) {
                return (obj.camera_id == toBeReplaceID);
            });
            if (selectedCam.length > 0) {
                for (var i = 0; i < $scope.filteredCamerasToShow.length; i++) {
                    if ($scope.filteredCamerasToShow[i].camera_id == existingCamID) {
                        $scope.filteredCamerasToShow.splice(i, 1, selectedCam[0]);

                        for (var j = 0; j < $rootScope.cameraidsToCreateGroup.length; j++) {
                            if ($rootScope.cameraidsToCreateGroup[j] == existingCamID) {
                                $rootScope.cameraidsToCreateGroup.splice(j, 1, selectedCam[0].camera_id);
                                break;
                            }
                        }
                        setTimeout(function () {
                            callPlayer(selectedCam[0].camera_id, selectedCam[0].vedio_url, $scope.layout);
                        }, 1000);
                        break;
                    }
                }
            }
        };


        $scope.deleteCameraGroup = function (cg_id, cb) {
            cameraDVRSvc.deleteCameraGroup(appConstants.deletecameragroup + '?cameragroup_id=' + cg_id, appConstants.getMethod, {}, {}, function (succResponse) {
                cb(succResponse.status);
            });
        };


        $scope.resetAllMediaPlayers = function () {
            //.........delete existing player......................
            // search all vxgplayers
            for (var i = 0; i < $scope.filteredCamerasToShow.length; i++) {
                if ($scope.filteredCamerasToShow[i].camera_id && vxgplayer("vxg_media_player" + $scope.filteredCamerasToShow[i].camera_id)) {
                    vxgplayer("vxg_media_player" + $scope.filteredCamerasToShow[i].camera_id).dispose();
                } else {
                    //console.error("Player has not id while delete", els[i]);
                }
            }
        }


        $scope.recordedFeedsSearchObj = {
            facility: appConstants.null,
            dt: new Date(),
            mytime: new Date()
        };
        $scope.searchSection = appConstants.reset;
        $scope.getCamerasOnSearchItems = function () {
            if ($scope.recordedFeedsSearchObj.facility) {
                $scope.recordedCameraFeedsAfterSearch = [];
                $scope.searchSection = appConstants.search;

                cameraDVRSvc.getCamerasOnSearchItems(appConstants.cameralist + '?facility_id=' + $scope.recordedFeedsSearchObj.facility, appConstants.getMethod, {}, {}, function (succResponse) {
                    if (succResponse.status) {
                        $scope.recordedCameraFeedsAfterSearch = succResponse.data ? succResponse.data.data : [];
                        toaster.pop(appConstants.success, succResponse.msg);
                    }
                });
            }
        };

        $scope.resetRecordedCamSearchCriteria = function () {
            $scope.searchSection = appConstants.reset;
        };


        $scope.getRecordedFeedVideosByCameraID = function (cameraObj) {
            $scope.recordedFeedvideosUrl = [];
            $scope.currentRunningRecordedFeedVideoIndex = -1;
            $scope.isrecordedFeedCamNextVideoButtonEnable = true;
            $scope.isrecordedFeedCamPreviousVideoButtonEnable = true;
            $scope.recordedFeedCameraPlayerHeader = cameraObj.camera_username;
            $scope.recordedFeedCameraPlayerSubHeader = cameraObj.camera_subscription_model;
            //cameraObj.camera_id=25;
            cameraDVRSvc.getRecordedFeedVideosByCameraID(appConstants.s3list + '?camera_id=' + cameraObj.camera_id, appConstants.getMethod, {}, {}, function (succResponse) {
                var videoDOM = document.getElementById('recordedFeedVideoPlayer');
                videoDOM.innerHTML = appConstants.empty;
                if (succResponse.status) {
                    $scope.recordedFeedvideosUrl = succResponse.data ? succResponse.data : [];
                    if ($scope.recordedFeedvideosUrl.length > 0) {
                        $scope.changeVideo('next');
                    }
                    else {
                        $('#recordedFeedVideoPlayer').attr("poster", "./././././images/no_video.png");
                        videoDOM.innerHTML = '<source src="" type="video/mp4">';
                        $timeout(function () {
                            videoDOM.load();
                            videoDOM.play();
                        }, 1000);
                        toaster.pop(appConstants.error, appConstants.norecordedFeedfound);
                    }
                }
                else {
                    $('#recordedFeedVideoPlayer').attr("poster", "./././././images/no_video.png");
                    videoDOM.innerHTML = '<source src="" type="video/mp4">';
                    $timeout(function () {
                        videoDOM.load();
                        videoDOM.play();
                    }, 1000);
                    toaster.pop(appConstants.error, succResponse.msg);
                }
            });
        };

        $scope.changeRecordedCamFeedVideoSource = function () {
            if ($scope.currentRunningRecordedFeedVideoIndex >= 0 && $scope.currentRunningRecordedFeedVideoIndex < $scope.recordedFeedvideosUrl.length) {
                var videoDOM = document.getElementById('recordedFeedVideoPlayer');
                if (videoDOM.innerHTML != appConstants.empty) {
                    videoDOM.innerHTML = appConstants.empty;
                }
                videoDOM.innerHTML = '<source src="' + $scope.recordedFeedvideosUrl[$scope.currentRunningRecordedFeedVideoIndex] + '" type="video/mp4">';
                $('#recordedFeedVideoPlayer').attr("poster", "./././././images/loadingvideo.gif");
                $timeout(function () {
                    videoDOM.load();
                    videoDOM.play();
                }, 1000);

                if ($scope.recordedFeedvideosUrl.length > 1) {
                    if ($scope.currentRunningRecordedFeedVideoIndex == 0) {
                        $scope.isrecordedFeedCamPreviousVideoButtonEnable = true;
                        $scope.isrecordedFeedCamNextVideoButtonEnable = false;
                    }
                    else if ($scope.currentRunningRecordedFeedVideoIndex == $scope.recordedFeedvideosUrl.length - 1) {
                        $scope.isrecordedFeedCamPreviousVideoButtonEnable = false;
                        $scope.isrecordedFeedCamNextVideoButtonEnable = true;
                    }
                    else {
                        $scope.isrecordedFeedCamPreviousVideoButtonEnable = false;
                        $scope.isrecordedFeedCamNextVideoButtonEnable = false;
                    }
                }
            }
        };

        $scope.isrecordedFeedCamNextVideoButtonEnable = true;
        $scope.isrecordedFeedCamPreviousVideoButtonEnable = true;
        $scope.changeVideo = function (videoState) {
            if ($scope.recordedFeedvideosUrl.length > 0) {
                switch (videoState) {
                    case 'prev':
                        $scope.currentRunningRecordedFeedVideoIndex--;
                        $scope.changeRecordedCamFeedVideoSource();
                        break;
                    case 'next':
                        $scope.currentRunningRecordedFeedVideoIndex++;
                        $scope.changeRecordedCamFeedVideoSource();
                        break;
                    default:
                        break;
                }
            }
        };

        // This function is used to resolve video URL while binding in <video><source src='{{trustSrc(url of video)}}'/></video>

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };

        $scope.startRecording = function (cameraID) {
            toaster.pop(appConstants.error, 'Recording is not working yet for Camera ID : ' + cameraID);
        };




        $scope.getfacilites(appConstants.empty, appConstants.empty, appConstants.empty, function (lstfacilities, lstCameragroup) {

        });

        $scope.imagePath = baseURL + appConstants.imagePath;
    })



    //........Add Camera Group Controllers Modal.....................

    .controller('addCameraGroupCTRL', function ($scope, $uibModal, $log, $rootScope, baseURL, $http, $cookies, toaster, $filter, appConstants, cameraDVRSvc) {

        $scope.cam1group = {
            group_name: appConstants.empty,
            camera_id: []
        };

        $scope.addCameraGroup = function () {

            cameraDVRSvc.addCameraGroup(appConstants.cameragroupadd, appConstants.postMethod, {}, $scope.cam1group, function (succResponse) {
                if (succResponse.status) {
                    toaster.pop(appConstants.success, appConstants.cameragroupcreated);
                    $scope.getfacilites(appConstants.empty, appConstants.empty, appConstants.empty, function (lstfacilities, lstCameragroup) {
                        var newAddedCameraGroup = [];
                        newAddedCameraGroup = lstCameragroup.filter(function (obj) {
                            return (obj.cg_name === $scope.cam1group.group_name)
                        });
                        if ($scope.cam1group) {
                            $scope.selectedCameraGroup = newAddedCameraGroup[0].cg_id;
                            if ($scope.cameraGroupList) {
                                setTimeout(function () {
                                    for (var i = 0; i < $scope.cameraGroupList.length; i++) {
                                        if ($scope.cameraGroupList[i].cg_id == $scope.selectedCameraGroup) {
                                            $('#cameraGroupDD').val($scope.selectedCameraGroup);
                                            break;
                                        }
                                    }
                                }, 1000)
                            }
                            switch ($scope.cam1group.camera_id.length) {
                                case 1:
                                    $scope.changedClass();
                                    break;
                                case 2:
                                    $scope.changecClass();
                                    break;
                                case 3:
                                case 4:
                                    $scope.changebClass();
                                    break;
                                case 5:
                                case 6:
                                    $scope.changeaClass();
                                    break;
                                default:
                                    break;
                            }
                        }
                        $scope.cam1group = {
                            group_name: '',
                            camera_id: []
                        };
                    });
                }
                else {
                    $scope.cam1group = {
                        group_name: appConstants.empty,
                        camera_id: []
                    };
                }
            });
        };

        $scope.open = function (size) {
            $scope.cam1group.camera_id = angular.copy($rootScope.cameraidsToCreateGroup);
            var modalInstance = $uibModal.open({
                templateUrl: 'addCameraGroupUI.html',
                controller: 'addCameraGroupCTRLInstance',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.cam1group;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.cam1group = selectedItem;
                $scope.addCameraGroup();

            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };
    })

    .controller('addCameraGroupCTRLInstance', function ($scope, $uibModalInstance, items) {
        $scope.cameraGroupName = '';
        $scope.ok = function () {
            items.group_name = $scope.cameraGroupName;
            $uibModalInstance.close(items);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.next = function () {
        }
    });

//.........................................................


/*-----------------------------------------------------------------
 End code for controller
 -----------------------------------------------------------------*/




