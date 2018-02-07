app.controller('appCtrl', function ($scope, $http, $rootScope, toastr, $location, $window) {


    //0:variable decalration
    var baseURL = "http://www.merikitab.in/school_kit/index.php/";
    $scope.loginData = {}; //info of school data
    $rootScope.isLoggedIn = 0;
    $rootScope.classes = [];
    $rootScope.selectedClass = 0;
    //end of 0

    //1:command set ajax calling function
    var commonSetHTTPService = function (method, data, url, callback) {
        $http({
            method: method,
            url: baseURL + url,
            dataType: 'JSON',
            data: data,
            headers: {
                "Content-type": "application/json"
            }
        }).then(function (response) {
            console.log(response);
            if (response.data.status == true) {
                toastr.success(response.data.message, 'Success');
                callback(1);
            }
            if (response.data.status == false) {
                console.log(',,,');
                toastr.error(response.data.message, 'Error');
            }
            $('#loader').hide();
        }, function (error) {
            $('#loader').hide();
            toastr.error(error.data.message, 'Error');
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
                "Content-type": "application/json"
            }
        }).then(function (response) {
            console.log(response);
            if (response.data.status == true) {
                callback(response.data.data);
            }
            if (response.data.status == false) {
                toastr.error(response.data.message, 'Error');
            }
            $('#loader').hide();
        }, function (error) {
            $('#loader').hide();
            toastr.error(error.data.message, 'Error');
        });
    };
    //end of 1; 

    $scope.isStudentLoggedIn = function () {
        commonGetHTTPService('Get', '', 'student/is_student_logged_in', function (result) {
            console.log(result);
            if (result) {
                $scope.name = result.student_name;
            } else {
                toastr.error("Please Login First !", 'Error');
                window.location = "http://www.merikitab.in/schoolkit/app/student/login.html";
            }
        });
    }

    $scope.isStudentLoggedIn();

    $scope.logout = function () {
        commonSetHTTPService('Post', '', 'student/student_logout', function (result) {
            window.location = "http://www.merikitab.in/schoolkit/app/student/login.html";
        });
    }

    $scope.callFunctions = function (classData) {
        $rootScope.selectedClass = classData;
        console.log('selected_class ' + JSON.stringify($rootScope.selectedClass));
        $rootScope.listStudent();
    }




});