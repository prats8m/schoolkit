app.controller('studentCtrl', function ($scope, $http, $rootScope, toastr, $location, $window) {


    //0:variable decalration
    var baseURL = "http://www.merikitab.in/school_kit/index.php/";
    $scope.loginData = {}; //info of school data
    $rootScope.isLoggedIn = 0;
    $scope.student = {};
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
                    toastr.success(response.data.message, 'Success');
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
        $scope.student = {};
        $scope.student.state = "Uttar Pradesh";
        $scope.student.country = "India";
    }

    $scope.initialseVariables();
    $scope.isSchoolLoggedIn = function () {
        commonGetHTTPService('Get', '', 'school/is_school_logged_in', function (result) {
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

    $scope.isSchoolLoggedIn();
    $scope.listStudent = function (classId) {
        var fd = new FormData();
        $scope.listStudentData = {};
        if(classId)
        fd.append('class_id',classId);
        else
        fd.append('class_id',0);
        
        commonSetHTTPService('POST', fd, 'teacher/list_student', function (result) {
            $scope.listStudentData = result;
            console.log($scope.listStudentData);
        });
    }

    $scope.listStudent(0);
    $scope.viewStudent = function (studentId) {
        var fd = new FormData();
        fd.append('student_id', studentId);
        commonGetHTTPService('Post', fd, 'teacher/view_student', function (result) {
            $scope.student = result;
        });
    }

    

});