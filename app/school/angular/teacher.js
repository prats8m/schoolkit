app.controller('teacherCtrl', function ($scope, $http, $rootScope, toastr, $location, $window, DTOptionsBuilder, DTColumnBuilder) {


    //0:variable decalration
    var baseURL = "http://www.merikitab.in/school_kit/index.php/";
    $scope.loginData = {}; //info of school data
    $rootScope.isLoggedIn = 0;
    $scope.teacher = {};
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

      $scope.generatePassword = function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }


    $scope.initialseVariables = function () {
        $scope.teacher.password = $scope.generatePassword();
        $scope.teacher.state = "Uttar Pradesh";
        $scope.teacher.country = "India";
    }

    $scope.addTeacher = function () {
        var fd = new FormData();
        console.log($scope.teacher);
        fd.append('name', $scope.teacher.name);
        fd.append('dob', $scope.teacher.dob);
        fd.append('email', $scope.teacher.email);
        fd.append('password', $scope.teacher.password);
        fd.append('mobile', $scope.teacher.mobile);
        fd.append('address', $scope.teacher.address);
        fd.append('city', $scope.teacher.city);
        fd.append('state', $scope.teacher.state);
        fd.append('country', $scope.teacher.country);
        fd.append('pincode', $scope.teacher.pincode);
        fd.append('gender', $scope.school.gender);
        commonSetHTTPService('Post', fd, 'school/add_teacher', function (result) {
            $scope.teacher = {};
            $scope.initialseVariables();
        });
    }
        $scope.initialseVariables();

        $scope.listTeacher = function() {
           commonGetHTTPService('Post', '', 'school/list_teachers', function (result) {
            $scope.listTeacherData = result;
            console.log($scope.listTeacherData); 
        }); 
    }

    $scope.listTeacher();

    $scope.deleteTeacher = function(teacherId){
        var fd = new FormData();
        fd.append('teacher_id', teacherId);
         commonSetHTTPService('Post', fd, 'school/delete_teacher', function (result) {
            $scope.teacher = {};
            $scope.initialseVariables();
            $scope.listTeacher();
        });
    }


$scope.viewTeacher = function(teacherId){
        var fd = new FormData();
        fd.append('teacher_id', teacherId);
         commonGetHTTPService('Post', fd, 'school/view_teacher', function (result) {
            $scope.teacher = result;
            // $scope.initialseVariables();
            // $scope.listTeacher();
        });
    }


 $scope.editTeacher = function (teacherId) {
        var fd = new FormData();
        console.log($scope.teacher);
        fd.append('teacher_id', teacherId);
        fd.append('name', $scope.teacher.name);
        fd.append('dob', $scope.teacher.dob);
        fd.append('email', $scope.teacher.email);
        fd.append('password', $scope.teacher.password);
        fd.append('mobile', $scope.teacher.mobile);
        fd.append('address', $scope.teacher.address);
        fd.append('city', $scope.teacher.city);
        fd.append('state', $scope.teacher.state);
        fd.append('country', $scope.teacher.country);
        fd.append('pincode', $scope.teacher.pincode);
        if($scope.school)
        fd.append('gender', $scope.school.gender);
        else
        fd.append('gender', null);
        
        commonSetHTTPService('Post', fd, 'school/edit_teacher', function (result) {
            $scope.teacher = {};
            $scope.initialseVariables();
             $scope.listTeacher();
             angular.element('#editTeacherModal').modal('hide');
        });
    }
        $scope.initialseVariables();

        $scope.listTeacher = function() {
           commonGetHTTPService('Post', '', 'school/list_teachers', function (result) {
            $scope.listTeacherData = result;
            console.log($scope.listTeacherData); 
        }); 
    }
   
});