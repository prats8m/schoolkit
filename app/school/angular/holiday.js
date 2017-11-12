app.controller('holidayCtrl', function ($scope, $http, $rootScope, toastr, $location, $window) {


    //0:variable decalration
    var baseURL = "http://www.merikitab.in/school_kit/index.php/";
    $scope.loginData = {}; //info of school data
    $rootScope.isLoggedIn = 0;
    $scope.holiday = {};
    //end of 0

    console.log('holiday ctrl loaded');

    //1:command set ajax calling function
    var commonSetHTTPService = function (method, data, url, callback) {
        $http({
            method: method,
            url: baseURL + url,
            dataType: 'JSON',
            data: data,
            headers: {
                "Content-type": undefined
            }
        }).then(function (response) {
            console.log(response);
            if (response.data.status == true) {
                toastr.success(response.data.message, 'Success');
                callback(1);
            }
            if (response.data.status == false) {
                showError(response.data);
            }
            $('#loader').hide();
        }, function (error) {
            $('#loader').hide();
            toastr.error(error, 'Error');
        });
    };
    //end of 1; 

    //1:command get ajax calling function
    var commonGetHTTPService = function (method, data, url, callback) {
        $http({
            method: method,
            url: baseURL + url,
            dataType: 'JSON',
            data: data,
            headers: {
                "Content-type": undefined
            }
        }).then(function (response) {
            console.log(response);
            if (response.data.status == true) {
                callback(response.data.data);
            }
            if (response.data.status == false) {
                showError(response.data);
            }
            $('#loader').hide();
        }, function (error) {
            $('#loader').hide();
            toastr.error(error.data.message, 'Error');
        });
    };
    //end of 1; 

    var showError = function (data) {
        if (data.errors.length) {
            toastr.error('Error', data.errors);
        } else {
            toastr.error('Error', data.msg.replace(/_/g, " "));
        }

    }


    $scope.initialseVariables = function () {
        $scope.holiday = {}
        $scope.holiday.session = "2017";
    }

    $scope.addHoliday = function () {
        var fd = new FormData();
        console.log($scope.holiday);
        var startDate = $scope.holiday.start;
        var splitStartDate = startDate.split("/");
        var endDate = $scope.holiday.end;
        var splitEndDate = endDate.split("/");
        fd.append('start_month',splitStartDate[1]);
        fd.append('end_month',splitStartDate[1]);
        fd.append('start_session', splitStartDate[2]);
        fd.append('end_session', splitEndDate[2]);
        fd.append('name', $scope.holiday.name);
        fd.append('start_date',splitStartDate[0]);
        fd.append('end_date', splitEndDate[0]);
        commonSetHTTPService('Post', fd, 'attendence/add_holidays', function (result) {
            $scope.holiday = {};
            $scope.initialseVariables();
            $scope.listholiday();
        });
    }
    $scope.initialseVariables();

    $scope.listholiday = function () {
        commonGetHTTPService('Post', '', 'attendence/list_holidays', function (result) {
            $scope.listholidayData = result;
            
            for (var idx in $scope.listholidayData)
                if ($scope.listholidayData[idx].status == '1') {
                    $scope.listholidayData[idx].status = 'Active';
                }
            else {
                $scope.listholidayData[idx].status = 'In Active';
            }

            
        });
    }



    $scope.listholiday();

 
    $scope.deleteholiday = function (holidayId) {
        var fd = new FormData();
        fd.append('id', holidayId);
        commonSetHTTPService('Post', fd, 'attendence/delete_holidays', function (result) {
            $scope.holiday = {};
            $scope.initialseVariables();
            $scope.listholiday();
        });
    }


    $scope.viewholiday = function (holidayId) {
        // alert('hi');
        var fd = new FormData();
        fd.append('id', holidayId);
        commonGetHTTPService('Post', fd, 'attendence/view_holidays', function (result) {
            $scope.holiday = result;
            // $scope.initialseVariables();
            // $scope.listholiday();
        });
    }


    $scope.editHoliday = function (holidayId) {
        var fd = new FormData();
        console.log($scope.holiday);
        fd.append('id', holidayId);
        fd.append('name', $scope.holiday.holiday_name);
        fd.append('start', $scope.holiday.holiday_start_date);
        fd.append('end', $scope.holiday.holiday_end_date);
        fd.append('session', $scope.holiday.holiday_session);
        commonSetHTTPService('Post', fd, 'attendence/edit_holidays', function (result) {
            $scope.holiday = {};
            $scope.initialseVariables();
            $scope.listholiday();
            angular.element('#editHolidayModal').modal('hide');
        });
    }








});