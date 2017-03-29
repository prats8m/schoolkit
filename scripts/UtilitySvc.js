'use strict';


app
.factory('utilitySvc',['$http','baseURL','$cookies','toaster',function ($http,baseURL,$cookies,toaster) {

   var factoryResp=this;
   // factoryResp.response_key_Result={};

    var respStructure={
        status:false,
        data:null,
        msg:''
    };

    factoryResp.callHttpService=function (url,method,data,cb) {
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
                    cb(respStructure={
                        status:response.status,
                        data:response.data,
                        msg:response.msg
                    });
                }
                if(response.msg == 'Invalid_Token'){
                    toaster.pop('error','Session Expired');
                    $cookies.remove("token");
                    $location.path('/core/login');return false;
                }
            })
            .error(function (data, status, headers, config) {
                cb(respStructure={
                    status:data.status,
                    data:data.data,
                    msg:data.msg
                });
            });

    };
    return factoryResp;
}]);