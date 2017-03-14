'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:FacilityCtrl
 * @description
 * # FacilityCtrl
 * Controller of the minovateApp
 */
app
	.controller('FacilityCtrl', function ($scope, $mdDialog, $http, $rootScope, $cookies, fileUpload, baseURL, toaster, $timeout, $uibModal) {

		$scope.page = {
			title: 'Facility',
			subtitle: ''
		};

		$rootScope.facility = {};
		$rootScope.facility.status = 1;
		$scope.addFacility = function () {
			$scope.addFacilityModal = $uibModal.open({
				templateUrl: 'myModalContent.html',
				size: 'md',
				scope: $scope,
				resolve: {
					items: function () {
						return $scope.items;
					}
				}
			});
		};

		$rootScope.save = function (facility, addFacility) {
			if (!addFacility.validate()) {
				return false;
			}
			//(facility.status == 'Active') ? facility.status = 1 : facility.status = 0
			// $scope.fileupload = fileUpload.uploadFileToUrl(facility.profile_pic, "")
			$http({
					url: baseURL + 'facility/add',
					method: 'POST',
					data: facility,
					dataType: 'JSON',
					headers: {
						"Authorization": $cookies.get("token"),
						"Content-type": "application/json"
					}
				})
				.success(function (response) {
					var n = [];
					var arr = response.error;
					if (response.error != null) {
						$.each(arr, function (index, value) {
							n[index] = value.property.split("request.body.")[1].replace(/_/g, ' ')[0].toUpperCase() + value.property.split("request.body.")[1].replace(/_/g, ' ').slice(1);
							$.each(value.messages, function (ind, value) {
								n[index] += " " + value
							})
						});
						$rootScope.fac_error = n.join(", ");
					} else {
						if (response.status == true) {
							toaster.pop('success', 'Facility added successfully.');
							$scope.addFacilityModal.dismiss('cancel');
							$scope.facilityInit();
						}
						$rootScope.fac_error = response.msg.replace(/_/g, " ");
					}

				})
				.error(function (data, status, headers, config) {
					console.log(data);
				});
		}

		$scope.result = '';
		$scope.showConfirm = function (ev) {
			var confirm = $mdDialog.confirm()
				.title('Would you like to delete Facility?')
				.content('')
				.ok('Delete')
				.cancel('Cancel')
				.targetEvent(ev);
			$mdDialog.show(confirm).then(function () {
				$scope.result = 'Your Facility has been deleted successfully.';
				$scope.statusclass = 'alert alert-danger alert-dismissable';
			}, function () {
				$scope.result = 'You decided to keep Facility.';
				$scope.statusclass = 'alert alert-success alert-dismissable';
			});
		};

		$scope.layout = 'grid';
		$scope.class = 'gridview';
		$scope.changeClass = function () {
			if ($scope.class === 'gridview')
				$scope.class = 'listview';
			$scope.layout = 'list';
		};
		$scope.facilityZipCode = "asdad";
		$scope.changeaClass = function () {
			if ($scope.class === 'listview')
				$scope.class = 'gridview';
			$scope.layout = 'grid';
		};

		$rootScope.search_facility = function () {
			//$scope.search;
			$http({
				url: baseURL + 'facility/list',
				headers: {
					'Content-type': 'application/json',
					'Authorization': $cookies.get("token")
				},
				params: {
					limit: 20,
					page_no: 1,
					search_val: $scope.search
				},
				method: 'GET',
				dataType: 'JSON'
			}).success(function (response) {
				if (response.status == true) {
					$scope.facilities = response["data"]["data"];
				} else {
					$scope.facilities = [];
				}
			});
		};
		$scope.facilityInit = function () {
			$http({
				url: baseURL + 'facility/list',
				params: {
					limit: 8,
					page_no: 1
				},
				method: 'GET',
				dataType: 'JSON',
				headers: {
					'Content-type': 'application/json',
					'Authorization': $cookies.get("token")
				}
			}).success(function (response) {
				$scope.facilities = response["data"]["data"];
				$scope.totalDisplayed = 8;

				if (response.data.count > $scope.totalDisplayed) {
					$scope.lmbtn = {
						"display": "block"
					};
				} else {
					$scope.lmbtn = {
						"display": "none"
					};
				}

			});
		}
		$scope.facilityInit();
		$scope.LoadMoreLimit = 8;
		$scope.LoadMorePage = 2;
		$scope.totalDisplayed = 8;
		$scope.loadMore = function () {
			$http({
				url: baseURL + 'facility/list',
				params: {
					limit: 8,
					pageNo: $scope.LoadMorePage,
				},
				method: 'GET',
				dataType: 'JSON',
				headers: {
					'Content-type': 'application/json',
					'Authorization': $cookies.get("token")
				}
			}).success(function (response) {
				$scope.facilities = $scope.facilities.concat(response.data.data);
				// $scope.facilities.push(response.data.data);
				console.log($scope.facilities)
				$scope.totalDisplayed += 8;
				$scope.LoadMorePage++;
				if (response.data.count > $scope.totalDisplayed) {
					$scope.lmbtn = {
						"display": "block"
					};
				} else {
					$scope.lmbtn = {
						"display": "none"
					};
				}

			});
		};

		$scope.orderByMe = function (x) {
			$scope.myOrderBy = x;
		}

		$scope.imagePath = 'http://localhost:8080/elika/images/';

		$scope.dashboardInit = function () {
			$http({
					url: baseURL + 'user/dashboard',
					method: 'GET',
					dataType: 'JSON',
					headers: {
						"Authorization": $cookies.get("token"),
						"Content-type": "application/json"
					}
				})
				.success(function (response) {
					if (response.status == true) {
						$scope.dashboardData = response.data[0];
					}
				})
				.error(function (data, status, headers, config) {

				});
		}
		if (!$rootScope.hasOwnProperty('dashboardData')) {
			$scope.dashboardInit();
		}

	});


'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:FacilityDetailsCtrl
 * @description
 * # FacilityDetailsCtrl
 * Controller of the minovateApp
 */
app
	.controller('FacilityDetailsCtrl', function ($scope, $mdDialog, $http, $stateParams, $cookies, $uibModal, baseURL, toaster, $rootScope) {

		$scope.page = {
			title: 'Facility Details',
			subtitle: ''
		};
		$scope.timezones = {
			model: null,
			availableOptions: [{
					id: 'AKST',
					name: 'USA (Alaska)'
				},
				{
					id: 'UTC-11',
					name: 'USA (Samoa)'
				},
				{
					id: 'PST',
					name: 'USA (Pacific)'
				},
				{
					id: 'EST',
					name: 'USA (Eastern)'
				},
				{
					id: 'HST',
					name: 'USA (Hawaii-Aleutian)'
				},
				{
					id: 'MST',
					name: 'USA (Mountain)'
				},
				{
					id: 'AST',
					name: 'USA (Atlantic)'
				},
				{
					id: 'CST',
					name: 'USA (Central)'
				},
				{
					id: 'UTC+10',
					name: 'USA (Chamorro)'
				}
			]
		};
		//Code to default select device type
		$rootScope.facility_device = {};
		$rootScope.facility_device.device_type = 'Primary';
		//Code ends to default select device type

		$scope.result = '';
		$scope.showConfirm = function (ev) {
			var confirm = $mdDialog.confirm()
				.title('Would you like to delete device?')
				.content('The standard chunk of Lorem Ipsum used.')
				.ok('Delete')
				.cancel('ok')
				.targetEvent(ev);
			$mdDialog.show(confirm).then(function () {
				$scope.result = 'Your device has been deleted successfully.';
				$scope.statusclass = 'alert alert-danger alert-dismissable';
			}, function () {
				$scope.result = 'You decided to keep device.';
				$scope.statusclass = 'alert alert-success alert-dismissable';
			});
		};

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

		// if(typeof $stateParams == "undefined" || $stateParams.facility_id == undefined)
		// {
		// 	$stateParams = {};
		// 	$stateParams.facility_id = $stateParams.id;
		// }
		$http({
				url: baseURL + 'facility/view/' + $stateParams.facility_id,
				method: 'GET',
				dataType: 'JSON',
				headers: {
					"Content-type": "application/json",
					"Authorization": $cookies.get("token"),
				}
			})
			.success(function (response) {
				// var arr = {};
				// $.each(response.data, function(index, value){
				// 	arr[index] = value;
				// });
				// $cookies.put("facility", JSON.stringify(arr));
				$scope.facility = response.data;
				// $scope.facility.timeZone = response.data.facility_timezone;
				//$scope.facility.facility_status = response.data.facility_status ? 'Active' : 'Inactive';

			})
			.error(function (response) {
				console.log(response);
			});
		// $rootScope.facilityName = jQuery.parseJSON($cookies.get("facility")).facility_name;

		// Code starts for facility master device

		$http({
				url: baseURL + 'device/list-master-device',
				method: 'GET',
				dataType: 'JSON',
				params: {
					limit: 20,
					pageNo: 1,
					facilityId: $stateParams.facility_id
				},
				headers: {
					"Content-type": "application/json",
					"Authorization": $cookies.get("token"),
				}
			})
			.success(function (response) {
				if (response.status == true) {
					$scope.devices = response.data.data;
					$scope.totalDisplayed = 6;
				} else {
					$scope.result = response.msg.replace(/_/g, ' ');
				}

				if ($scope.devices.length > $scope.totalDisplayed) {
					$scope.lmbtn = {
						"display": "block"
					};
				} else {
					$scope.lmbtn = {
						"display": "none"
					};
				}

				// $scope.loadMore = function () {
				// 	$scope.totalDisplayed += 6;
				// 	if ($scope.totalDisplayed > $scope.devices.length) {
				// 		$scope.lmbtn = {
				// 			"display": "none"
				// 		};
				// 	}
				// };
			});

		//Code ends for facility master device 


		//Code starts to search facility device by text
		$scope.search_facility_device = function (facility) {
			$http({
					url: baseURL + 'device/list-master-device',
					method: 'GET',
					dataType: 'JSON',
					params: {
						limit: 20,
						pageNo: 1,
						facilityId: $stateParams.facility_id,
						searchVal: facility.search_val
					},
					headers: {
						"Content-type": "application/json",
						"Authorization": $cookies.get("token"),
					}
				})
				.success(function (response) {
					if (response.status == true) {
						$scope.devices = response.data.data;
						$scope.totalDisplayed = 6;
						$scope.result = "";
					} else {
						$scope.result = response.msg.replace(/_/g, ' ');
					}

					if ($scope.devices.length > $scope.totalDisplayed) {
						$scope.lmbtn = {
							"display": "block"
						};
					} else {
						$scope.lmbtn = {
							"display": "none"
						};
					}

					// $scope.loadMore = function () {
					// 	$scope.totalDisplayed += 6;
					// 	if ($scope.totalDisplayed > $scope.devices.length) {
					// 		$scope.lmbtn = {
					// 			"display": "none"
					// 		};
					// 	}
					// };
				});
		}

		//Code ends to search facility device by text





		//Code starts to save facility device
		$rootScope.saveFacilityDevice = function (facility_device) {
			facility_device.facility_id = jQuery.parseJSON($cookies.get("facility")).facility_id;
			facility_device.serial_no = parseInt(facility_device.serial_no);
			facility_device.technician_id = parseInt(facility_device.technician_id);
			facility_device.registration_code = "1234";
			$http({
					url: baseURL + 'device/add',
					method: 'POST',
					data: facility_device,
					dataType: 'JSON',
					headers: {
						"Authorization": $cookies.get("token"),
						"Content-type": "application/json"
					}
				})
				.success(function (response) {
					if (response.status == true) {
						toaster.pop('success', 'Facility Added Successfully');
					} else {
						toaster.pop('error', response.msg.replace(/_/g, ' '));
					}
				})
				.error(function (response) {
					console.log(response);
				});

		}
		//Code ends to save facility device

		$scope.imagePath = baseURL + 'elika/images/';

	});


'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:ViewFacilityCtrl
 * @description
 * # ViewFacilityCtrl
 * Controller of the minovateApp
 */
app
  .controller('ViewFacilityCtrl', function ($scope, $mdDialog, $http, $stateParams, $cookies, $uibModal, baseURL, toaster, $rootScope) {

    $scope.page = {
		title: 'Facility Details',
		subtitle: ''
    };
	
	$scope.imagePath = baseURL+'elika/images/';
	
	$http({
		url: baseURL+'facility/view/'+$stateParams.facility_id,
		method: 'GET',
		dataType : 'JSON',
		headers: {
			"Content-type": "application/json",
			"Authorization": $cookies.get("token"),
		}
	})
	.success(function(response) {
		$scope.facility = response.data;
	})
	.error(function(response){
		console.log(response);
	});
	
	$scope.dashboardInit = function(){
		$http({
			url: baseURL + 'user/dashboard',
			method: 'GET',
			dataType : 'JSON',
			headers: {
				"Authorization": $cookies.get("token"),
				"Content-type": "application/json"
			}
		})
		.success(function(response) {
			if(response.status == true){
				$rootScope.dashboardData = response.data;
			}
		})
		.error(function (data, status, headers, config) {
			
		});
	}
	if(!$rootScope.hasOwnProperty('dashboardData')){
		$scope.dashboardInit();
	}
	
  });
  
  

'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:EditFacilityCtrl
 * @description
 * # EditFacilityCtrl
 * Controller of the minovateApp
 */
app
  .controller('EditFacilityCtrl', function ($scope, $mdDialog, $http, $stateParams, $cookies, $uibModal, baseURL, toaster, $rootScope) {

    $scope.page = {
		title: 'Facility Details',
		subtitle: ''
    };
	
	$scope.imagePath = baseURL+'elika/images/';
	
	$http({
		url: baseURL+'facility/view/'+$stateParams.facility_id,
		method: 'GET',
		dataType : 'JSON',
		headers: {
			"Content-type": "application/json",
			"Authorization": $cookies.get("token"),
		}
	})
	.success(function(response) {
		$scope.facility = response.data;
	})
	.error(function(response){
	});
	
	$scope.edit_facility = function(facility, editfacility){
		if(!editfacility.validate()){
			return false;
		}
		facility.timeZone = facility.facility_timezone;
		facility.zip_code = ""+facility.facility_zipcode;
		facility.status = facility.facility_status == 'Active' ? 1 : 0
		$http({
			url: baseURL+'facility/edit',
			method: 'PUT',
			data: facility,
			dataType : 'JSON',
			headers: {
				"Authorization": $cookies.get("token"),
				"Content-type": "application/json"
			}
		})
		.success(function(response) {

			if(response.status == true){
				toaster.pop('success','Facility Edited Successfully');
			}else{
				var n = [];
				var arr = response.error;
				if(arr != null){
				$.each(arr, function(index, value){ n[index] = value.property.split("request.body.")[1].replace(/_/g,' ')[0].toUpperCase()  + value.property.split("request.body.")[1].replace(/_/g,' ').slice(1) ; $.each(value.messages, function(ind, value){ n[index] += " "+value })});
				$scope.facility_edit_error = n.join(", ");
				}		
			}
		})
		.error(function(response){
		});
	};	
	$scope.facility.timezone = "";
	$scope.edit_facility = function(facility, editfacility){
			if (!editfacility.validate()) {
				return false;
			}
			facility.timeZone = facility.facility_timezone;
			facility.zip_code = "" + facility.facility_zipcode;
			facility.status = facility.facility_status == 'Active' ? 1 : 0
			$http({
					url: baseURL + 'facility/edit',
					method: 'PUT',
					data: facility,
					dataType: 'JSON',
					headers: {
						"Authorization": $cookies.get("token"),
						"Content-type": "application/json"
					}
				})
				.success(function (response) {

					if (response.status == true) {
						toaster.pop('success', 'Facility Edited Successfully');
					} else {
						var n = [];
						var arr = response.error;
						if (arr != null) {
							$.each(arr, function (index, value) {
								n[index] = value.property.split("request.body.")[1].replace(/_/g, ' ')[0].toUpperCase() + value.property.split("request.body.")[1].replace(/_/g, ' ').slice(1);
								$.each(value.messages, function (ind, value) {
									n[index] += " " + value
								})
							});
							$scope.facility_edit_error = n.join(", ");
						}
					}
				})
				.error(function (response) {
					
				});
		};
  });

app
  .filter('facilityStatus', function() {
    return function(x) {
        if(x == 0){return "In-Active";}else{ return "Active";}
	}
   });