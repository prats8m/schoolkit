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


    //2:command get ajax calling function for download
    var commonDownloadHTTPService = function (method, data, url, callback) {
        $http({
            method: method,
            url: baseURL + url,
            dataType: 'JSON',
            data: data,
            headers: {
                "Content-type": undefined
            }
        }).then(function (response) {
            console.log($scope.dataDetail)
            var file = new Blob([response.data], {
                type: 'application/pdf'
            });

            var fileurl = URL.createObjectURL(file);
            window.open(fileurl);
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




    $scope.isTeacherLoggedIn = function () {
        commonGetHTTPService('Get', '', 'teacher/is_teacher_logged_in', function (result) {
            console.log(result);
            if (result.length) {
                $rootScope.selectedClass = result[0];
                $scope.listStudent();
            } else {
                toastr.error("Please Login First !", 'Error');
                window.location = "http://www.merikitab.in/schoolkit/app/teacher/login.html";
            }
        });
    }

    $scope.isTeacherLoggedIn();
    $scope.generate_reciept = function (feeId) {
        window.location.href = baseURL + 'fee/generate_reciept/' + feeId;
    };


    $scope.addFee = function () {
        var fd = new FormData();
        fd.append('student_id', $scope.fee.student.id);
        fd.append('amount', $scope.fee.amount);
        fd.append('mode', $scope.fee.mode);
        fd.append('type', $scope.fee.type);
        fd.append('month', $scope.fee.month);
        fd.append('year', $scope.fee.year);
        fd.append('verified_by', $scope.fee.verified_by);
        fd.append('class_id', $rootScope.selectedClass.class_id);
        commonSetHTTPService('Post', fd, 'fee/add_fee', function (result) {
            console.log(result);
            $scope.generate_reciept(result);
            $scope.student = {};
            $scope.initialseVariables();
        });
    }


    $scope.logout = function () {
        commonSetHTTPService('Post', '', 'teacher/teacher_logout', function (result) {
            window.location = "http://www.merikitab.in/schoolkit/app/teacher/login.html";
        });
    }

    $rootScope.listStudent = function () {
        var fd = new FormData();
        $scope.listStudentData = {};
        fd.append('class_id', $rootScope.selectedClass.class_id);
        commonSetHTTPService('POST', fd, 'teacher/list_student', function (result) {
            $scope.listStudentData = result;
            console.log($scope.listStudentData);
        });
    }


    $scope.listFee = function () {
        var fd = new FormData();
        if ($scope.fee.month)
            fd.append('month', $scope.fee.month);
        else
            fd.append('month', 0);

        if ($scope.fee.year)
            fd.append('year', $scope.fee.year);
        else
            fd.append('year', 0);

        if ($scope.fee.type)
            fd.append('type', $scope.fee.type);
        else
            fd.append('year', 0);

        if ($scope.fee.mode)
            fd.append('mode', $scope.fee.mode);
        else
            fd.append('mode', 0);

        fd.append('class_id', $rootScope.selectedClass.class_id);
        commonSetHTTPService('GET', fd, 'fee/get_fee', function (result) {
            $scope.listFeeData = result;
            for (var idx1 in $scope.listFeeData) {
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
                    if ($scope.listFeeData[idx1].fee_mode == null) {
                        $scope.listFeeData[idx1].fee_mode = "Offline";
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

    $scope.editFee = function (feeId) {
        var fd = new FormData();
        fd.append('fee_id', feeId);
        fd.append('student_id', $scope.fee.fee_student_id);
        fd.append('amount', $scope.fee.fee_amount);
        fd.append('mode', $scope.fee.fee_mode);
        fd.append('type', $scope.fee.fee_type);
        fd.append('month', $scope.fee.fee_month);
        fd.append('year', $scope.fee.fee_year);
        fd.append('verified_by', $scope.fee.fee_verified_by);
        fd.append('class_id', $rootScope.selectedClass.class_id);
        commonSetHTTPService('Post', fd, 'fee/edit_fee', function (result) {
            $scope.student = {};
            $scope.initialseVariables();
            angular.element('#editFeeModal').modal('hide');
        });
    }

    $scope.deleteFee = function (feeId) {
        var fd = new FormData();
        commonSetHTTPService('Post', fd, 'fee/delete_fee/' + feeId, function (result) {
            $scope.fee = {};
            document.getElementById(feeId).style.display = "none";
            $scope.initialseVariables();
            $scope.listfee();
        });
    }



    $scope.initialseVariables = function () {
        $scope.fee = {};
    }

    $scope.initialseVariables();


});