app.controller('dashCtrl', function ($scope, $http, $rootScope, toastr, $location, $window) {


    //0:variable decalration
    var baseURL = "http://www.merikitab.in/school_kit/index.php/";
    $scope.loginData = {}; //info of school data
    $rootScope.isLoggedIn = 0;
    $scope.holiday = {};
    //end of 0

    console.log('dash ctrl loaded');

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

       $scope.getHeaderData = function(){
            commonGetHTTPService('Post', '', 'school/get_dashboard', function (result) {
            $scope.headerData = result;
           });
       }

    $scope.initialseVariables = function () {
        $scope.headerData = {};
        $scope.getHeaderData();
       }

       $scope.initialseVariables();



});