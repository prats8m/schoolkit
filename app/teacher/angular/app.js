'use strict';
/**
 * @ngdoc overview
 * @name minovateApp
 * @description
 * # minovateApp
 *
 * Main module of the application.
 */

  /*jshint -W079 */

var baseUrl = 'http://127.0.0.1/';
console.log(baseUrl);
var app = angular.module("schoolKitApp", ['ngRoute','toastr']).config(function (toastrConfig) {
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
});


app.config(function($routeProvider) {
    $routeProvider
    .when("/school", {
        templateUrl : "./views/school/index.html",
        controller : "schoolCtrl"
    })
    .when("/student", {
        templateUrl : "./views/student/index.html",
        controller : "studentCtrl"
    })
    .when("/teacher", {
        templateUrl : "./views/teacher/index.html",
        controller : "teacherCtrl"
    })
    .otherwise({
        templateUrl : "./views/404.html",
      });
});

