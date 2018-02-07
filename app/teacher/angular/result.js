app.controller('resultCtrl', function ($scope, $http, $rootScope, toastr, $location, $window, DTOptionsBuilder, DTColumnBuilder) {
    var reader = new FileReader();

    //0:variable decalration
    var baseURL = "http://www.merikitab.in/school_kit/index.php/";
    $scope.loginData = {}; //info of school data
    $rootScope.isLoggedIn = 0;
    $scope.student = {};
    $scope.vm = {};
    $scope.vm.dtOptions = DTOptionsBuilder.newOptions();
    $scope.examSubject = [];
    $scope.marks = [];
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
            if (response.data.status == true || response.status == 200) {
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

    $scope.isTeacherLoggedIn = function () {
        console.log('hello');
        commonGetHTTPService('Get', '', 'teacher/is_teacher_logged_in', function (result) {
            console.log(result);
            if (result.length) {
                $rootScope.selectedClass = result[0];
                $rootScope.listExam();
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
        $scope.listStudentData = {};
        fd.append('class_id', $rootScope.selectedClass.class_id);
        commonSetHTTPService('POST', fd, 'teacher/list_student', function (result) {
            console.log('PRATEEK');
            $scope.listStudentData = result;
            console.log($scope.listStudentData);
        });
    }


    $rootScope.listExam = function () {
        var classId = $rootScope.selectedClass.class_id;
        commonGetHTTPService('Get', '', 'exam/list_exam_name/' + classId, function (result) {
            $scope.examData = result;
            $rootScope.listStudent();
        });
    }

    $rootScope.listExamSubjects = function (examId) {
        commonGetHTTPService('Get', '', 'exam/list_exam_subject/' + examId, function (result) {
            $scope.examSubjectData = result;
            $scope.getResult(examId);
        });
    }


    $scope.getResult = function (examId) {
        commonGetHTTPService('Get', '', 'exam/get_result/' + examId, function (result) {
            console.log(result.length)
            for ( i = 0; i < $scope.examSubjectData.length; i++) {
                var data = {};
                for ( j = 0; j < result.length; j + 2) {
                    data[result[j]['result_student_id']] = result[j]['result_marks'];
                }
                $scope.marks[i] = data;
            }

            console.log(JSON.stringify($scope.marks));
        });
    }


    $scope.submitResult = function (studentId) {
        var fd = new FormData();
        fd.append('student_id', studentId);
        console.log('examsubject ' + JSON.stringify($scope.examSubject));
        console.log('marks ' + JSON.stringify($scope.marks));
        for (var idx = 0; idx < $scope.examSubjectData.length; idx++) {
            fd.append('marks[' + idx + '][0]', $scope.examSubjectData[idx].es_id);
            fd.append('marks[' + idx + '][1]', $scope.marks[idx][studentId]);
        }
        console.log(fd);
        commonSetHTTPService('Post', fd, 'exam/submit_result', function (result) {});
    }

    $scope.initialseVariables = function () {}
    $scope.initialseVariables();


});