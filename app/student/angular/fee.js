app.controller('feeCtrl', function ($scope, $http, $rootScope, toastr, $location, $window, DTOptionsBuilder, DTColumnBuilder) {
    var reader = new FileReader();

    //0:variable decalration
    var baseURL = "http://www.merikitab.in/school_kit/index.php/";
    $scope.loginData = {}; //info of school data
    $rootScope.isLoggedIn = 0;
    $scope.student = {};
    $scope.months = [{
            'name': 'Jan',
            'value': 1
        },
        {
            'name': 'Feb',
            'value': 2
        },
        {
            'name': 'Mar',
            'value': 3
        },
        {
            'name': 'Apr',
            'value': 4
        },
        {
            'name': 'May',
            'value': 5
        },
        {
            'name': 'June',
            'value': 6
        },
        {
            'name': 'July',
            'value': 7
        },
        {
            'name': 'Aug',
            'value': 8
        },
        {
            'name': 'Sep',
            'value': 9
        },
        {
            'name': 'Oct',
            'value': 10
        },
        {
            'name': 'Nov',
            'value': 11
        },
        {
            'name': 'Dec',
            'value': 12
        }
    ];

    $scope.type = [{
            'name': 'Tution Fee',
            'value': '1'
        },
        {
            'name': 'Exam Fee',
            'value': '2'
        },
        {
            'name': 'Admission Fee',
            'value': '3'
        },
        {
            'name': 'Transportation Fee',
            'value': '4'
        }
    ];

    $scope.mode = [{
            'name': 'Online',
            'value': '1'
        },
        {
            'name': 'Offline',
            'value': '2'
        }
    ];

    $scope.years = [
        '2017', '2018', '2019', '2020'
    ];
    $scope.vm = {};
    $scope.vm.dtOptions = DTOptionsBuilder.newOptions();

    //end of 0



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
            if (response.data.status == true) {
                if (response.data.data.length) {
                    callback(response.data.data);
                } else {
                    toastr.success(response.data.message, 'Success');
                    console.log(response.data.data);
                    callback(response.data.data);
                }
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
            if (response.status == 200) {
                callback(response.data.data);
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




    $scope.isStudnetLoggedIn = function () {
        commonGetHTTPService('Get', '', 'teacher/is_teacher_logged_in', function (result) {
            console.log(result);
            if (result) {} else {
                toastr.error("Please Login First !", 'Error');
                window.location = "http://www.merikitab.in/schoolkit/app/teacher/login.html";
            }
        });
    }

    $scope.isStudentLoggedIn();
    $scope.generate_reciept = function (feeId) {
        window.location.href = baseURL + 'fee/generate_reciept/' + feeId;
    };


    $scope.logout = function () {
        commonSetHTTPService('Post', '', 'student/student_logout', function (result) {
            window.location = "http://www.merikitab.in/schoolkit/app/student/login.html";
        });
    }



    $scope.listFee = function () {
        var fd = new FormData();
        commonSetHTTPService('GET', fd, 'fee/get_student_fee', function (result) {
            $scope.listFeeData = result;
            for (var idx1 in $scope.listFeeData) {
                $scope.listFeeData[idx1].fee_created_on = $scope.convertTimestamp($scope.listFeeData[idx1].fee_created_on);
                for (var idx2 in $scope.type) {
                    if ($scope.listFeeData[idx1].fee_type == $scope.type[idx2].value) {
                        $scope.listFeeData[idx1].fee_type = $scope.type[idx2].name;
                    }
                }
            }
            for (var idx1 in $scope.listFeeData) {
                for (var idx2 in $scope.mode) {
                    if ($scope.listFeeData[idx1].fee_mode == $scope.mode[idx2].value) {
                        $scope.listFeeData[idx1].fee_mode = $scope.mode[idx2].name;
                    }
                }

                for (var idx1 in $scope.listFeeData) {
                    for (var idx2 in $scope.months) {
                        if ($scope.listFeeData[idx1].fee_month == $scope.months[idx2].value) {
                            $scope.listFeeData[idx1].fee_month = $scope.months[idx2].name;
                        }
                    }
                }
            }
            console.log($scope.listStudentData);
        });
    }

    $scope.viewFee = function (feeId) {
        var fd = new FormData();
        // fd.append('fee_id', feeId);
        commonGetHTTPService('Post', fd, 'fee/view_fee/' + feeId, function (result) {
            $scope.fee = result[0];
            $scope.fee.fee_amount = parseInt($scope.fee.fee_amount);
            console.log($scope.fee);
        });
    }

    $scope.initialseVariables = function () {
        $scope.listFee();
    }

    $scope.initialseVariables();

    $scope.convertTimestamp = function (timestamp) {
        var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
            yyyy = d.getFullYear(),
            mm = ('0' + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
            dd = ('0' + d.getDate()).slice(-2), // Add leading 0.
            hh = d.getHours(),
            h = hh,
            min = ('0' + d.getMinutes()).slice(-2), // Add leading 0.
            ampm = 'AM',
            time;

        if (hh > 12) {
            h = hh - 12;
            ampm = 'PM';
        } else if (hh === 12) {
            h = 12;
            ampm = 'PM';
        } else if (hh == 0) {
            h = 12;
        }

        // ie: 2013-02-18, 8:35 AM	
        time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

        return time;
    }
});