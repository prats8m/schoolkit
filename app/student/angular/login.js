(function () {
    var app = angular.module('schoolKitApp2', ['ngRoute', 'toastr']).config(function (toastrConfig) {
        angular.extend(toastrConfig, {
            autoDismiss: true,
            containerId: 'toast-container',
            maxOpened: 0,
            newestOnTop: true,
            positionClass: 'toast-top-right',
            preventDuplicates: false,
            preventOpenDuplicates: false,
            target: 'body'
        });
    });;
    var baseURL = "http://www.merikitab.in/school_kit/index.php/";
    console.log('login app loaded ');
    app.controller('loginCtrl', function ($scope, $http, $location, $rootScope, toastr) {

        //Variabels
        $scope.school_country = 'India';
        $scope.school_state = 'Uttar Pradesh';
        $classes = [];

        //1:command set ajax calling function
        var commonSetHTTPService = function (method, data, url, callback) {
            $http({
                method: method,
                url: baseURL + url,
                dataType: 'JSON',
                data: data,
                headers: {
                    'Content-Type': undefined
                }
            }).then(function (response) {
                if (response.data.status == true) {
                    console.log(response);

                    toastr.success(response.data.msg, 'Success');
                    callback(response.data.data);
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
                console.log(error);
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


        $scope.login = function () {
            var fd = new FormData();
            fd.append('email', $scope.email);
            fd.append('password', $scope.password);
            commonSetHTTPService('Post', fd, 'student/login', function (result) {
                $classes = result;
                window.location = "http://www.merikitab.in/schoolkit/app/student/#!/";
            });
        }


        $scope.generateOtp = function () {
            var fd = new FormData();
            fd.append('email', $scope.email);
            commonGetHTTPService('Post', fd, 'student/forget_password', function (result) {
                $scope.otp = "";
                $scope.password = "";
                $scope.confirm_password = "";
                toastr.info("An Email or SMS ha been sent with OTP!", 'Check your Email/Mobile');
                window.location = "http://www.merikitab.in/schoolKit/app/student/login.html#changePassword";
            });
        }


        $scope.checkOtp = function () {
            var fd = new FormData();
            fd.append('email', $scope.email);
            fd.append('password', $scope.password);
            fd.append('confirm_password', $scope.confirm_password);
            fd.append('otp', $scope.otp);

            commonSetHTTPService('Post', fd, 'student/check_otp', function (result) {
                window.location = "http://www.merikitab.in/schoolKit/app/student/login.html";
            });
        }


        $scope.isStudentLoggedIn = function () {
            commonGetHTTPService('Get', '', 'student/is_student_logged_in', function (result) {
                if (result.length) {
                    toastr.success("Authomatic Session Retrived!", 'Congratulation');
                    window.location = "http://www.merikitab.in/schoolkit/app/student/#!/";
                }
            });
        }

        $scope.isStudentLoggedIn();

    });

})();