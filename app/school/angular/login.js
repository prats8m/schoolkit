(function () {
    var app = angular.module('schoolKitAppLogin', ['ngRoute', 'toastr']).config(function (toastrConfig) {
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
    var baseURL = "http://www.schoolkitapp.com/school_kit/index.php/";

    app.controller('loginCtrl', function ($scope, $http, $rootScope, toastr) {

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
                    callback(1);
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

        var showError = function (data) {
            if (data.errors.length) {
                toastr.error('Error', data.errors);
            } else {
                toastr.error('Error', data.msg.replace(/_/g, " "));
            }

        }

        $scope.schoolLogin = function () {
            toastr.success("Welcome " + $scope.username, 'Success');
            window.location.href = baseURL + '/#!/';
        }

        $scope.signup = function () {
            var fd = new FormData();
            fd.append('name', $scope.school_name);
            fd.append('email', $scope.school_email);
            fd.append('password', $scope.school_password);
            fd.append('confirm_password', $scope.school_confirm_password);
            fd.append('mobile1', $scope.school_mobile1);
            fd.append('mobile2', $scope.school_mobile2);
            fd.append('address', $scope.school_address);
            fd.append('landmark', $scope.school_landmark);
            fd.append('address', $scope.school_address);
            fd.append('city', $scope.school_city);
            fd.append('state', $scope.school_state);
            fd.append('country', $scope.school_country);
            fd.append('pincode', $scope.school_pincode);
            fd.append('secret_key', $scope.school_secret_key);
            fd.append('referal_admin_id', $scope.school_referal_admin_id);
            fd.append('nos', $scope.number_of_student);
            fd.append('nom', $scope.number_of_months);
            fd.append('amount', $scope.amount);

            commonSetHTTPService('Post', fd, 'school/signup', function (result) {
                window.location = "http://www.schoolkitapp.com/app/school/login.html#signin";
            });
        }

        $scope.login = function () {
            var fd = new FormData();
            fd.append('email', $scope.email);
            fd.append('password', $scope.password);
            commonSetHTTPService('Post', fd, 'school/login', function (result) {
                window.location = "http://www.schoolkitapp.com/app/school/#!/";
            });
        }


        $scope.generateOtp = function () {
            var fd = new FormData();
            fd.append('email', $scope.email);
            commonGetHTTPService('Post', fd, 'school/forget_password', function (result) {
                $scope.otp = "";
                $scope.password = "";
                $scope.confirm_password = "";
                toastr.info("An Email or SMS ha been sent with OTP!", 'Check your Email/Mobile');
                window.location = "http://www.schoolkitapp.com/app/school/login.html#changePassword";
            });
        }


        $scope.checkOtp = function () {
            var fd = new FormData();
            fd.append('email', $scope.email);
            fd.append('password', $scope.password);
            fd.append('confirm_password', $scope.confirm_password);
            fd.append('otp', $scope.otp);

            commonSetHTTPService('Post', fd, 'school/check_otp', function (result) {
                window.location = "http://www.schoolkitapp.com/app/school/login.html";
            });
        }


        $scope.isSchoolLoggedIn = function () {
            commonGetHTTPService('Get', '', 'school/is_school_logged_in', function (result) {
                if (result.length) {
                    toastr.success("Authomatic Session Retrived!", 'Congratulation');
                    window.location = "http://www.schoolkitapp.com/app/school/#!/";
                }
            });
        }

        $scope.isSchoolLoggedIn();


        $scope.calculateAmount = function(){
            $scope.totalAmount = $scope.amount*$scope.number_of_student*$scope.number_of_months;
        }
    });
})();