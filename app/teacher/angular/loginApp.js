(function () {
    var app = angular.module('schoolKitApp', ['ngRoute', 'toastr']).config(function (toastrConfig) {
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
    var baseURL = "http://18.220.128.189/schoolkit-UI/app";
    
    app.controller('loginCtrl', function ($scope, $http, $location, $rootScope, toastr) {

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


        $scope.schoolLogin = function () {
            toastr.success("Welcome " + $scope.username, 'Success');
            window.location.href = baseURL+ '/#!/school';
          }

    });
})();