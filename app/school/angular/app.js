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
var app = angular.module("schoolKitApp", ['ngRoute', 'toastr']).config(function (toastrConfig) {
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


app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "./views/index.html",
            controller: "dashCtrl"
        })
        .when("/teacher", {
            templateUrl: "./views/teacher.html",
            controller: "teacherCtrl"
        })
         .when("/student", {
            templateUrl: "./views/student.html",
            controller: "studentCtrl"
        })
        .when("/class", {
            templateUrl: "./views/class.html",
            controller: "classCtrl"
        })
         .when("/result", {
            templateUrl: "./views/result.html",
            // controller: "schoolCtrl"
        })
         .when("/fee", {
            templateUrl: "./views/fee.html",
            // controller: "schoolCtrl"
        })
         .when("/inbox", {
            templateUrl: "./views/inbox.html",
            // controller: "schoolCtrl"
        })
         .when("/login", {
            templateUrl: "./views/login.html",
            // controller: "schoolCtrl"
        })
        .when("/holidays", {
            templateUrl: "./views/holiday.html",
            controller: "holidayCtrl"
        })
        .otherwise({
            templateUrl: "./views/404.html",
        });
});
