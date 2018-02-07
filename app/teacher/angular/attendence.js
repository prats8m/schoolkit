app.controller('attendenceCtrl', function ($scope, $http, $rootScope, toastr, $location, $window) {


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

    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    var d = new Date();
    $scope.selectedMonth = d.getMonth() + 1;
    var n = new Array();
    $scope.selectedMonthName =monthNames[$scope.selectedMonth-1];
    $scope.selectedYear = d.getFullYear();
    console.log($scope.selectedYear);
    $scope.years = [
        '2017', '2018', '2019'
    ];
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
            console.log(response);
            if (response.data.status == true) {
                if (response.data.data.length) {
                    callback(response.data.data);
                } else {
                    toastr.success(response.data.msg, 'Success');
                    callback();
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
        $scope.listStudentData = {};
    }

    $scope.isTeacherLoggedIn = function () {
        commonGetHTTPService('Get', '', 'teacher/is_teacher_logged_in', function (result) {
            console.log(result);
            if (result.length) {
                $rootScope.selectedClass = result[0];
                $rootScope.listStudent();
            } else {
                toastr.error("Please Login First !", 'Error');
                window.location = "http://www.merikitab.in/schoolkit/app/teacher/login.html";
            }
        });
    }

    $scope.isTeacherLoggedIn();
    $scope.logout = function () {
        commonSetHTTPService('Post', '', 'teacher/teacher_logout', function (result) {
            window.location = "http://www.merikitab.in/schoolkit/app/teacher/login.html";
        });
    }

    $rootScope.listStudent = function () {
        var fd = new FormData();

        fd.append('class_id', $rootScope.selectedClass.class_id);
        commonSetHTTPService('POST', fd, 'teacher/list_student', function (result) {
            $scope.listStudentData = result;
            console.log($scope.listStudentData);
        });
        $scope.initialseVariables();
    }

    $scope.submitAttendence = function () {
        var fd = new FormData();
        var format = $scope.date.toLocaleString();
        var format = format.split(",");
        var acount = 0;
        var lcount = 0;
        var ecount = 0;
        for (var idx in $scope.listStudentData) {
            if ($('input[name=' + $scope.listStudentData[idx].id + ']:checked').val() == 'A') {
                fd.append('absent[' + acount + ']', $scope.listStudentData[idx].id);
                acount = acount + 1;
            }
            if ($('input[name=' + $scope.listStudentData[idx].id + ']:checked').val() == 'L') {
                fd.append('leave[' + lcount + ']', $scope.listStudentData[idx].id);
                lcount = lcount + 1;
            }
            if ($('input[name=' + $scope.listStudentData[idx].id + ']:checked').val() == 'E') {
                fd.append('expelled[' + ecount + ']', $scope.listStudentData[idx].id);
                ecount = ecount + 1;
            }

        }
        fd.append('class_id', $rootScope.selectedClass.class_id);
        fd.append('date', format[0]);
        commonSetHTTPService('POST', fd, 'attendence/take_attendence', function (result) {

        });
    }

    $scope.getAttendence = function (session) {
        var fd = new FormData();
        fd.append('class_id', $rootScope.selectedClass.class_id);
        fd.append('month', $scope.selectedMonth);
        console.log($scope.selectedMonth);
        fd.append('session', $scope.selectedYear);
        commonGetHTTPService('POST', fd, 'attendence/get_attendence', function (result) {
            $scope.datas = result.data;
            $scope.dates = result.dates;
            $scope.students = result.student;
        });

    }

});