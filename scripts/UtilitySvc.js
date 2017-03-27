'use strict';


app
.factory('utilitySvc',['$http','baseURL','$cookies','toaster',function ($http,baseURL,$cookies,toaster) {

    var factoryResp=this;


    factoryResp.callHttpService=function (url,method,data,response_key) {
        factoryResp.response_key_Result={};
        $http({
            url: baseURL + url,
            method: method,
            data:data,
            dataType : 'JSON',
            headers: {
                "Authorization": $cookies.get("token"),
                "Content-type": "application/json"
            }
        })
            .success(function(response) {
                if(response.status == true){
                    factoryResp.response_key_Result= response.data;
                }
                if(response.msg == 'Invalid_Token'){
                    toaster.pop('error','Session Expired');
                    $cookies.remove("token");
                    $location.path('/core/login');return false;
                }
            })
            .error(function (data, status, headers, config) {

            });

    };
    return factoryResp;
}]);