app.controller('examCtrl', function ($scope, $http, $rootScope, toastr, $location, $window, DTOptionsBuilder, DTColumnBuilder) {
    var reader = new FileReader();

    //0:variable decalration
    var baseURL = "http://www.merikitab.in/school_kit/index.php/";
    $scope.loginData = {}; //info of school data
    $rootScope.isLoggedIn = 0;
    $scope.student = {};
    $scope.vm = {};
    $scope.vm.dtOptions = DTOptionsBuilder.newOptions();
    $scope.subjects = [];
    $scope.subject = [];
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
    $scope.generate_reciept = function (feeId) {
        window.location.href = baseURL + 'fee/generate_reciept/' + feeId;
    };


    $scope.logout = function () {
        commonSetHTTPService('Post', '', 'teacher/teacher_logout', function (result) {
            window.location = "http://www.merikitab.in/schoolkit/app/teacher/login.html";
        });
    }


    $scope.addExam = function () {
        var datestrng = $scope.exam.start_date.toLocaleString();
        var datestrng2 = datestrng.split(" ");
        var year = datestrng2[0].split("/");
        console.log(year);
        var fd = new FormData();
        fd.append('exam_name', $scope.exam.name);
        fd.append('exam_session', year[2]);
        fd.append('start_date', Date.parse($scope.exam.start_date) / 1000);
        fd.append('end_date', Date.parse($scope.exam.end_date) / 1000);
        fd.append('result_date', Date.parse($scope.exam.result_date) / 1000);
        fd.append('class_id', $rootScope.selectedClass.class_id);
        console.log($scope.subjects);
        for (var idx = 0; idx < $scope.subjects.length; idx++) {
            fd.append('subjects[' + idx + '][0]', $scope.subjects[idx][idx].name);
            fd.append('subjects[' + idx + '][1]', $scope.subjects[idx][idx].marks_type);
            fd.append('subjects[' + idx + '][2]', $scope.subjects[idx][idx].max_marks);
            fd.append('subjects[' + idx + '][3]', Date.parse($scope.subjects[idx][idx].date) / 1000);
        }
        console.log(fd);
        commonSetHTTPService('Post', fd, 'exam/add_exam', function (result) {
            angular.element('#addExamModal').modal('hide');
            $rootScope.listExam();
        });
    }


    $scope.editExam = function (examId) {
        var datestrng = $scope.singleExamData.exam.exam_start_date.toLocaleString();
        var datestrng2 = datestrng.split(" ");
        var year = datestrng2[0].split("/");
        console.log(year);
        var fd = new FormData();
        fd.append('exam_id', $scope.singleExamData.exam.exam_id);
        fd.append('exam_name', $scope.singleExamData.exam.exam_name);
        fd.append('exam_session', year[2]);
        fd.append('start_date', Date.parse($scope.singleExamData.exam.exam_start_date) / 1000);
        fd.append('end_date', Date.parse($scope.singleExamData.exam.exam_end_date) / 1000);
        fd.append('result_date', Date.parse($scope.singleExamData.exam.exam_result_date) / 1000);
        fd.append('class_id', $rootScope.selectedClass.class_id);
        console.log($scope.subjects);
        for (var idx = 0; idx < $scope.subjects.length; idx++) {
            fd.append('subjects[' + idx + '][0]', $scope.subjects[idx][idx].es_subject);
            fd.append('subjects[' + idx + '][1]', $scope.subjects[idx][idx].es_marks_type);
            fd.append('subjects[' + idx + '][2]', $scope.subjects[idx][idx].es_max_marks);
            fd.append('subjects[' + idx + '][3]', Date.parse($scope.subjects[idx][idx].es_date) / 1000);
        }
        console.log(fd);
        commonSetHTTPService('Post', fd, 'exam/edit_exam', function (result) {
            angular.element('#viewExamModal').modal('hide');
            $rootScope.listExam();
        });
    }


    $rootScope.listExam = function () {
        var classId = $rootScope.selectedClass.class_id;
        commonGetHTTPService('Get', '', 'exam/list_exam_name/' + classId, function (result) {
            $scope.examData = result;
        });
    }


    $scope.viewExam = function (examId) {
        commonGetHTTPService('Get', '', 'exam/view_exam/' + examId, function (result) {
            console.log('prtk');
            $scope.singleExamData = result;
            console.log($scope.singleExamData.exam.exam_start_date);
            $scope.singleExamData.exam.exam_start_date = new Date($scope.singleExamData.exam.exam_start_date * 1000);
            console.log($scope.singleExamData.exam.exam_start_date);
            $scope.singleExamData.exam.exam_end_date = new Date($scope.singleExamData.exam.exam_end_date * 1000);
            $scope.singleExamData.exam.exam_result_date = new Date($scope.singleExamData.exam.exam_result_date * 1000);
            for (var idx = 0; idx < result.subjects.length; idx++) {
                $scope.subjects[idx] = {};
                $scope.subjects[idx][idx] = result.subjects[idx];
                $scope.subjects[idx][idx].es_date = new Date($scope.subjects[idx][idx].es_date * 1000);
            }


        });
    }
    $scope.deleteExam = function (examId) {
        commonSetHTTPService('Post', '', 'exam/delete_exam/' + examId, function (result) {
            $rootScope.listExam();
        });
    }

    $scope.initialseVariables = function () {

    }

    $scope.addSubject = function () {
        var newItemNo = $scope.subjects.length + 1;
        $scope.subjects.push({
            'id': newItemNo
        });
    };

    $scope.removeSubject = function () {
        var lastItem = $scope.subjects.length - 1;
        $scope.subjects.splice(lastItem);
    };

    $scope.initialseVariables();


});