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

    $scope.generatePassword = function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }


    $scope.initialseVariables = function () {
        $scope.student.password = $scope.generatePassword();
        $scope.student.state = "Uttar Pradesh";
        $scope.student.country = "India";
    }

    $scope.initialseVariables();
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
    $scope.addStudent = function () {
        var fd = new FormData();
        fd.append('name', $scope.student.name);
        fd.append('dob', $scope.student.dob);
        fd.append('email', $scope.student.email);
        fd.append('password', $scope.student.password);
        fd.append('mobile', $scope.student.mobile);
        fd.append('address', $scope.student.address);
        fd.append('gender', $scope.var.gender);
        fd.append('father_name', $scope.student.father_name);
        fd.append('class_id', $rootScope.selectedClass.class_id);
        commonSetHTTPService('Post', fd, 'teacher/add_student', function (result) {
            $scope.student = {};
            $scope.initialseVariables();
            $rootScope.listStudent();
          
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

    $scope.viewStudent = function (studentId) {
        var fd = new FormData();
        fd.append('student_id', studentId);
        commonGetHTTPService('Post', fd, 'teacher/view_student', function (result) {
            $scope.student = result;
        });
    }

    $scope.editStudent = function (studentId) {
        var fd = new FormData();
        fd.append('student_id', studentId);
        fd.append('name', $scope.student.name);
        fd.append('dob', $scope.student.dob);
        fd.append('email', $scope.student.email);
        fd.append('password', $scope.student.password);
        fd.append('mobile', $scope.student.mobile);
        fd.append('address', $scope.student.address);
        if ($scope.var)
            fd.append('gender', $scope.var.gender);
        else
            fd.append('gender', 'M');

        fd.append('father_name', $scope.student.father_name);
        fd.append('class_id', $rootScope.selectedClass.class_id);
        commonSetHTTPService('Post', fd, 'teacher/edit_student', function (result) {
            $scope.student = {};
            $scope.initialseVariables();
            $rootScope.listStudent();
            angular.element('#editStudentModal').modal('hide');
        });
    }

  $scope.deleteStudent = function(studentId){
        var fd = new FormData();
        fd.append('student_id', studentId);
         commonSetHTTPService('Post', fd, 'teacher/delete_student', function (result) {
            $scope.student = {};
            $scope.initialseVariables();
            $scope.listStudent();
        });
    }


});