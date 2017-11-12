app.controller('classCtrl', function ($scope, $http, $rootScope, toastr, $location, $window) {


    //0:variable decalration
    var baseURL = "http://www.merikitab.in/school_kit/index.php/";
    $scope.loginData = {}; //info of school data
    $rootScope.isLoggedIn = 0;
    $scope.class = {};
    //end of 0

    console.log('class ctrl loaded');

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
        $scope.class.password = $scope.generatePassword();
        $scope.class.state = "Uttar Pradesh";
        $scope.class.country = "India";
    }

    $scope.addClass = function () {
        var fd = new FormData();
        console.log($scope.class);
        fd.append('name', $scope.class.name);
        fd.append('status', $scope.school.status);
        fd.append('nos', $scope.class.nos);
        commonSetHTTPService('Post', fd, 'school/add_class', function (result) {
            $scope.class = {};
            $scope.initialseVariables();
            $scope.listclass();
        });
    }
    $scope.initialseVariables();

    $scope.listclass = function () {
        commonGetHTTPService('Post', '', 'school/list_classes', function (result) {
            $scope.listclassData = result.class;
            
            for (var idx in $scope.listclassData)
                if ($scope.listclassData[idx].status == '1') {
                    $scope.listclassData[idx].status = 'Active';
                }
            else {
                $scope.listclassData[idx].status = 'In Active';
            }

            console.log($scope.listclassData[0].teacher_id);
        });
    }



    $scope.listclass();

    $scope.listTeacher = function () {
        commonGetHTTPService('Post', '', 'school/list_teachers', function (result) {
            $scope.listTeacherData = result;
            console.log($scope.listTeacherData);
        });
    }

    $scope.listTeacher();

    $scope.deleteclass = function (classId) {
        var fd = new FormData();
        fd.append('class_id', classId);
        commonSetHTTPService('Post', fd, 'school/delete_class', function (result) {
            $scope.class = {};
            $scope.initialseVariables();
            $scope.listclass();
        });
    }


    $scope.viewclass = function (classId) {
        // alert('hi');
        var fd = new FormData();
        fd.append('class_id', classId);
        commonGetHTTPService('Post', fd, 'school/view_class', function (result) {
            $scope.class = result;
            // $scope.initialseVariables();
            // $scope.listclass();
        });
    }


    $scope.editclass = function (classId) {
        var fd = new FormData();
        console.log($scope.class);
        fd.append('class_id', classId);
        fd.append('name', $scope.class.name);
        fd.append('nos', $scope.class.nos);
        fd.append('status', $scope.school.status);
        commonSetHTTPService('Post', fd, 'school/edit_class', function (result) {
            $scope.class = {};
            $scope.initialseVariables();
            $scope.listclass();
            angular.element('#editclassModal').modal('hide');
        });
    }


    $scope.mapTeacher = function (classId, teacherId) {
        console.log(JSON.stringify(classId) + "  " + teacherId);
        var fd = new FormData();
        console.log($scope.class);
        fd.append('tc_id', classId);
        fd.append('teacher_id', teacherId);
        commonSetHTTPService('Post', fd, 'school/map_teacher_class', function (result) {
            $scope.class = {};
            $scope.initialseVariables();
        });
    }








});