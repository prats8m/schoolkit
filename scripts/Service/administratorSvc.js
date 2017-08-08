'use strict';
app
    .factory('administratorSvc',['toaster','utilitySvc','appConstants','$rootScope',function (toaster,utilitySvc,appConstants,$rootScope) {
    	var administratorSvcResp =this;

		administratorSvcResp.submitData = function(url,method,params,data,cb){
			utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
				if(succResponse.status){
					cb(succResponse);
				} else {
					var n = [];
					$.each(succResponse.error, function (index, value) {
						n[index] = value.property.split("request.body.")[1].replace(/_/g, ' ')[0].toUpperCase() + value.property.split("request.body.")[1].replace(/_/g, ' ').slice(1);
						$.each(value.messages, function (ind, value) {
							n[index] += " " + value
						})
					});
					succResponse.msg = n.join(", ");
					toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
					cb(succResponse);
				}
			});
		}

		administratorSvcResp.rolesInit = function(url,method,params,data,cb){
			utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
				if(succResponse.status){
					cb(succResponse);
				} else {
					var n = [];
					$.each(succResponse.error, function (index, value) {
						n[index] = value.property.split("request.body.")[1].replace(/_/g, ' ')[0].toUpperCase() + value.property.split("request.body.")[1].replace(/_/g, ' ').slice(1);
						$.each(value.messages, function (ind, value) {
							n[index] += " " + value
						})
					});
					succResponse.msg = n.join(", ");
					toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
					cb(succResponse);
				}
			});
		}

		administratorSvcResp.roleDelete = function(url,method,params,data,cb){
			utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
				if(succResponse.status){
					cb(succResponse);
				} else {
					var n = [];
					$.each(succResponse.error, function (index, value) {
						n[index] = value.property.split("request.body.")[1].replace(/_/g, ' ')[0].toUpperCase() + value.property.split("request.body.")[1].replace(/_/g, ' ').slice(1);
						$.each(value.messages, function (ind, value) {
							n[index] += " " + value
						})
					});
					succResponse.msg = n.join(", ");
					toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
					cb(succResponse);
				}
			});
		}

		administratorSvcResp.submitAddAdmin = function(url,method,params,data,cb){
			utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
				if(succResponse.status){
					cb(succResponse);
				} else {
					if(angular.isArray(succResponse.error)){
						var n = [];
						$.each(succResponse.error, function (index, value) {
							n[index] = value.property.split("request.body.")[1].replace(/_/g, ' ')[0].toUpperCase() + value.property.split("request.body.")[1].replace(/_/g, ' ').slice(1);
							$.each(value.messages, function (ind, value) {
								n[index] += " " + value
							})
						});
						succResponse.msg = n.join(", ");
					}
					toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
					cb(succResponse);
				}
			});
		}

		administratorSvcResp.adminInit = function(url,method,params,data,cb){
			utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
				if(succResponse.status){
					cb(succResponse);
				} else {
					if(angular.isArray(succResponse.error)){
						var n = [];
						$.each(succResponse.error, function (index, value) {
							n[index] = value.property.split("request.body.")[1].replace(/_/g, ' ')[0].toUpperCase() + value.property.split("request.body.")[1].replace(/_/g, ' ').slice(1);
							$.each(value.messages, function (ind, value) {
								n[index] += " " + value
							})
						});
						succResponse.msg = n.join(", ");
					}
					toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
					cb(succResponse);
				}
			});
		}

		administratorSvcResp.dashboardInit=function(url,method,params,data,cb) {
            utilitySvc.callHttpService(url,method,params,data,function (succResponse) {
                if(succResponse.status){
                    cb(succResponse);
                }
                else {
                     toaster.pop(appConstants.error,succResponse.msg.replace(/_/g,' '));
                    cb(succResponse);
                }
            });
        };
    	return administratorSvcResp;
    }]);