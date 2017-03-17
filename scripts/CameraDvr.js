'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:CameraDVRCtrl
 * @description
 * # CameraDVRCtrl
 * Controller of the minovateApp
 */
app
  .controller('CameraDVRCtrl', function ($scope, $mdDialog, $http, baseURL, $cookies, $rootScope,$filter,toaster) {
     $scope.page = {
      title: 'Camera DVR',
    };
		$scope.camgroup = {
		name: 'Add Camera group'
		};

  $scope.dashboardInit = function(){ 
	$http({
		url: baseURL + 'user/dashboard',   
		method: 'GET',   
		dataType : 'JSON',   
		headers: {    "Authorization": $cookies.get("token"),    
									"Content-type": "application/json"   
								}  
		})  
	.success(function(response) {   
		if(response.status == true){   
		 $rootScope.dashboardData = response.data;     
		 console.log($rootScope.dashboardData);   }  
		if(response.msg == 'Invalid_Token'){
		toaster.pop('error','Session Expired');
		$cookies.remove("token");
		$location.path('/core/login');return false;
		} 
	})  
	.error(function (data, status, headers, config) {     }); 
	} 
	$scope.dashboardInit();

	$scope.showcamadd = function(){
		$("#camform").css("display", "inline-block");
		
	}

	$scope.hidecamadd = function(){
		$("#camform").css("display", "none");
		
	}


	$scope.result = '';
    $scope.showConfirm = function(ev) {
		var confirm = $mdDialog.confirm()		
		.title('Would you like to delete camera group?')
		.content('')
		.ok('Yes')
		.cancel('Cancel')
		.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
			$scope.result = 'Camera group has been deleted successfully.';
			$scope.statusclass = 'alert alert-danger alert-dismissable';
		}, function() {
			$scope.result = 'You decided to keep camera group.';
			$scope.statusclass = 'alert alert-success alert-dismissable';
		});
    };
	
	$scope.layout = 'onecam';
	$scope.class = 'onegrid';
	$scope.isaddCameraGroup=true;
	$scope.changeaClass = function(){
		if ($scope.class === 'fourgrid' || $scope.class === 'twogrid' || $scope.class === 'onegrid')
		$scope.class = 'sixgrid';
		$scope.layout = 'sixcam';

        $scope.isaddCameraGroup=false;
	};
	
	$scope.changebClass = function(){
		if ($scope.class === 'twogrid' || $scope.class === 'onegrid' || $scope.class === 'sixgrid')
		$scope.class = 'fourgrid';
		$scope.layout = 'fourcam';

        $scope.isaddCameraGroup=false;
	};
	
	$scope.changecClass = function(){
		if ($scope.class === 'onegrid' || $scope.class === 'sixgrid' || $scope.class === 'fourgrid')
		$scope.class = 'twogrid';
		$scope.layout = 'twocam';

        $scope.isaddCameraGroup=false;
	};
	
	$scope.changedClass = function(){
		if ($scope.class === 'sixgrid' || $scope.class === 'fourgrid' || $scope.class === 'twogrid')
		$scope.class = 'onegrid';
		$scope.layout = 'onecam';

        $scope.isaddCameraGroup=true;
	};

      $scope.totalNoOfCameras=0;
	$scope.cameraInit = function(filteredBy,filteringItem){
		if(filteredBy){
            switch (filteredBy){
                case 'Facility Name':
                    $scope.selectedCameraGroup='';
                    $scope.selectedFacility=filteringItem?filteringItem:'';
                    break;
                case 'Camera Group':
                    $scope.selectedFacility='';
                    $scope.selectedCameraGroup=filteringItem?filteringItem:'';
                    break;
            }
		}
		else {
			$scope.selectedFacility='';
            $scope.selectedCameraGroup='';
		}
		$http({
			url: baseURL + 'camera/list?facility_id='+$scope.selectedFacility+'&cameragroup_id='+$scope.selectedCameraGroup,
			method: 'GET',   
			dataType : 'JSON',   
			headers: {    
									"Authorization": $cookies.get("token"),    
									"Content-type": "application/json"   
								}  
			})  
		.success(function(response) {   
			if(response.status == true){  
			// switch (1) {
			// 	  case 1:
			// 				$scope.changedClass();
			// 	      break;
			// 	  case 2:
			// 	      $scope.changecClass();
			// 	      break;
			// 	  case 4:
			// 	      $scope.changebClass();
			// 	      break;
			// 	  case 6:
			// 	      $scope.changeaClass();
			// 	      break;
			// 	  default:
            //
			// 	}

                $scope.changedClass();
				$scope.totalNoOfCameras=response.data.count;
			 $scope.cameras = response.data.data;
                $scope.generateLayoutForCamDisplay();
			}
			if(response.msg==='No_Record_Found'){
                toaster.pop('Oops','No camera found for this filter');

                $scope.changedClass();
                $scope.totalNoOfCameras=0;
                $scope.cameras=[];
                $scope.generateLayoutForCamDisplay();
			}
			else if(response.msg == 'Invalid_Token'){
				toaster.pop('error','Session Expired');
				$cookies.remove("token");
				$location.path('/core/login');return false;
			} 
		})  
		.error(function (data, status, headers, config) {     }); 
	} 

	$scope.cameraInit();


	$scope.UpdateCamerasBasedOnCameraGroup=function (selectedCameraGroup) {
		if(selectedCameraGroup){
			$scope.selectedCameraGroup=selectedCameraGroup;
            var camerasForSelectedGroup=[];
			camerasForSelectedGroup=$scope.cameraGroupList.filter(function (obj) {
				return (obj.cg_id==$scope.selectedCameraGroup)
            })
			if(camerasForSelectedGroup.length>0){
				var camerasID=camerasForSelectedGroup[0].cg_camera_id.split(',');
				if(camerasID && camerasID.length>0){
					var filteredCams=[];
					for(var i=0;i<camerasID.length;i++){
						var flag=false;
						for(var j=0;j<$scope.cameras.length;j++){
							if(camerasID[i]==$scope.cameras[j].camera_id){
								filteredCams.push($scope.cameras[j]);
								break;
							}
						}
					}

                    $scope.filteredCamerasToShow=[];
                    $rootScope.cameraidsToCreateGroup=[];
                    var sortedCamArr=$filter('orderBy')(filteredCams, 'camera_id');
                    if(sortedCamArr && sortedCamArr.length>0){
                        for(var i=0;i<sortedCamArr.length;i++){
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

                    setTimeout(function () {
                        for(var camInd=0;camInd<$scope.filteredCamerasToShow.length;camInd++){
                            callPlayer($scope.filteredCamerasToShow[camInd].camera_id,$scope.filteredCamerasToShow[camInd].vedio_url);
                        }
                    },2000);
				}
			}
		}
		else {
            $scope.changedClass();
            $scope.setTotalVideosToWatch(1,1,1);
		}
    }


	$scope.setTotalVideosToWatch=function (camLayoutType,startIndex,endIndex) {
        $scope.filteredCamerasToShow=[];
        $rootScope.cameraidsToCreateGroup=[];
        $scope.selectedCameraGroup='';
		var sortedCamArr=$filter('orderBy')($scope.cameras, 'camera_id');
		if(sortedCamArr && sortedCamArr.length>0){
                    for(var i=startIndex;i<=endIndex;i++){
                        $scope.filteredCamerasToShow.push(sortedCamArr[i-1]);
                        $rootScope.cameraidsToCreateGroup.push(sortedCamArr[i-1].camera_id);
                    }

		}

        setTimeout(function () {
            for(var camInd=0;camInd<$scope.filteredCamerasToShow.length;camInd++){
                callPlayer($scope.filteredCamerasToShow[camInd].camera_id,$scope.filteredCamerasToShow[camInd].vedio_url);
            }
		},2000);


		};

      $scope.updatedIndexForCameraDropDownForFourCam=0;
	$scope.updateLatestIndexForFourCam=function (index) {
		$scope.updatedIndexForCameraDropDownForFourCam=index;
    }

      $scope.updatedIndexForCameraDropDownForSixCam=0;
      $scope.updateLatestIndexForSixCam=function (index) {
          $scope.updatedIndexForCameraDropDownForSixCam=index;
      }
      $scope.generateLayoutForCamDisplay = function() {
      	var layoutIcons=[1,2,4,6];

      	for(var layoutIc=0;layoutIc<layoutIcons.length;layoutIc++){
            switch (layoutIcons[layoutIc]){
                case 1:
                    $scope.camDisplayGroup_1=[];
                    angular.forEach($scope.cameras, function(value, key){
                        $scope.camDisplayGroup_1.push(key+1);
                    });
                case 2:
                    $scope.camDisplayGroup_2=[];
                    var count=0;
                    for(var i=0;i<$scope.cameras.length;i++){
                        count++;
                        if(count%2==0){
                            $scope.camDisplayGroup_2.push({startInd:count-1,endInd:count});
                        }
                        else if(count==$scope.cameras.length){
                            $scope.camDisplayGroup_2.push({startInd:$scope.camDisplayGroup_2.length>0?$scope.camDisplayGroup_2[$scope.camDisplayGroup_2.length-1].endInd+1:1,endInd:count});
                        }
                    }
                case 4:
                    $scope.camDisplayGroup_4=[];
                    var count=0;
                    for(var i=0;i<$scope.cameras.length;i++){
                        count++;
                        if(count%4==0){
                            $scope.camDisplayGroup_4.push({startInd:count-3,endInd:count});
                        }
                        else if(count==$scope.cameras.length){
                            $scope.camDisplayGroup_4.push({startInd:$scope.camDisplayGroup_4.length>0?$scope.camDisplayGroup_4[$scope.camDisplayGroup_4.length-1].endInd+1:1,endInd:count});
                        }
                    }
                case 6:
                    $scope.camDisplayGroup_6=[];
                    var count=0;
                    for(var i=0;i<$scope.cameras.length;i++){
                        count++;
                        if(count%6==0){
                            $scope.camDisplayGroup_6.push({startInd:count-5,endInd:count});
                        }
                        else if(count==$scope.cameras.length){
                            $scope.camDisplayGroup_6.push({startInd:$scope.camDisplayGroup_6.length>0?$scope.camDisplayGroup_6[$scope.camDisplayGroup_6.length-1].endInd+1:1,endInd:count});
                        }
                    }
                    //break;
            }
		  }



              $scope.setTotalVideosToWatch(1,1,1);


      }
      $scope.selectedCameraGroup=null;
      $scope.getCameraGroups=function () {
          $scope.cameraGroupList=[];
          $http.get(baseURL+'cameragroup/list',
              {headers: {
                  "Authorization": $cookies.get("token"),
                  "Content-type": "application/json"
              }})
              .success(function (resp) {
                  if(resp.msg == 'Invalid_Token'){
                      toaster.pop('error','Session Expired');
                      $cookies.remove("token");
                      $location.path('/core/login');return false;
                  }
                  else if(resp.status==true && resp.data){
                      $scope.cameraGroupList=resp.data;

                  }

              })
              .error(function (error) {

              })
      };

	$scope.selectedFacility=null;
	$scope.getfacilites=function (srchitem,limit,pageNo) {
        $scope.facilityList=[];
		$http.get(baseURL+'facility/list?search_val='+srchitem+'&limit='+limit+'&pageNo='+pageNo,
			{headers: {
            "Authorization": $cookies.get("token"),
                "Content-type": "application/json"
        }})
			.success(function (resp) {
                if(resp.msg == 'Invalid_Token'){
                    toaster.pop('error','Session Expired');
                    $cookies.remove("token");
                    $location.path('/core/login');return false;
                }
				else if(resp.status==true && resp.data){
                    $scope.facilityList=resp.data.data;
                    $scope.getCameraGroups();
				}

            })
			.error(function (error) {
                $scope.getCameraGroups();
            })
    };

	$scope.swapCameraWithExisting=function (existingCamID,toBeReplaceID) {

        var selectedCam=[];
		selectedCam=$scope.cameras.filter(function (obj) {
			return(obj.camera_id==toBeReplaceID);
        })
		if(selectedCam.length>0){
			for(var i=0;i<$scope.filteredCamerasToShow.length;i++){
				if($scope.filteredCamerasToShow[i].camera_id==existingCamID){
                    $scope.filteredCamerasToShow.splice(i,1,selectedCam[0]);
                    setTimeout(function () {
                        callPlayer(selectedCam[0].camera_id,selectedCam[0].vedio_url);
                    },2000);
                    break;
				}
			}


		}
    }

	$scope.getfacilites('','','');

	$scope.imagePath = 'http://localhost/elika/images';
})
  


//........Add Camera Group Controllers Modal.....................

.controller('addCameraGroupCTRL', function ($scope, $uibModal, $log, $rootScope,baseURL,$http,$cookies,toaster) {

    $scope.cam1group={
        group_name:'',
        camera_id:[]
    };


    $scope.addCameraGroup = function(){

        $http({
            url: baseURL + 'cameragroup/add',
            method: 'POST',
            dataType : 'JSON',
            data : $scope.cam1group,//{group_name: 'abc', camera_id: $scope.camera_id.split(",")},
            headers: {
                "Authorization": $cookies.get("token"),
                "Content-type": "application/json"
            }
        })
            .success(function(response) {
                if(response.status == true){
                    toaster.pop('success','Camera Group Created');
                }
                if(response.msg == 'Invalid_Token'){
                    toaster.pop('error','Session Expired');
                    $cookies.remove("token");
                    $location.path('/core/login');return false;
                    $location.path('/core/login');return false;
                }
                $scope.cam1group={
                    group_name:'',
                    camera_id:[]
                };
                $scope.getfacilites('','','');
                if($scope.cam1group){
                    switch ($scope.cam1group.length){
                        case 1:
                        	$scope.changedClass();
                            break;
                        case 2:
                            $scope.changecClass();
                            break;
                        case 4:
                            $scope.changebClass();
                            break;
                        case 6:
                            $scope.changeaClass();
                            break;
                        default:
                            break;
                    }
				}

            })
            .error(function (data, status, headers, config) {
                $scope.getfacilites('','','');
			});
    }

    $scope.open = function(size) {

        $scope.cam1group.camera_id=angular.copy($rootScope.cameraidsToCreateGroup);
        $rootScope.cameraidsToCreateGroup=[];
        var modalInstance = $uibModal.open({
            templateUrl: 'addCameraGroupUI.html',
            controller: 'addCameraGroupCTRLInstance',
            size: size,
            resolve: {
                items: function () {
                    return $scope.cam1group ;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {

            $scope.cam1group= selectedItem;
            $scope.addCameraGroup();

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };





})

    .controller('addCameraGroupCTRLInstance', function ($scope, $uibModalInstance, items) {

        $scope.cameraGroupName = '';


        $scope.ok = function () {
            items.group_name=$scope.cameraGroupName;
            $uibModalInstance.close(items);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.next = function(){

        }

    })



//.........................................................


/*-----------------------------------------------------------------
			End code for controller
-----------------------------------------------------------------*/

