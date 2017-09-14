app.controller('appCtrl', function ($scope, $http, $rootScope, toastr, $location,$window) {


    //0:variable decalration
    var baseURL = "http://localhost/meri_kitaab/index.php/";
    $scope.loginData = {}; //info of school data
    $rootScope.isLoggedIn = 0;
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


    $rootScope.logout = function () {
        console.log('logout function called');
        $('#loader').show();
        commonSetHTTPService('Post', $scope.customer, 'customer/logout', function (result) {
            if (result) {
                $window.location.reload();
            }
        });

    } 


    commonGetHTTPService('Get', '', 'customer/is_logged_in', function (result) {
        $('#loader').show();
        console.log('app ctrl is logged n called');
        if (result['customer_name']) {
            $scope.isLoggedIn = 1;
            $scope.customer_name = result['customer_name'];
            console.log('logged in status: ' + $scope.isLoggedIn);


        }
    });




});