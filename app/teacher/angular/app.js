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
var app = angular.module("schoolKitApp", ['ngRoute', 'datatables', 'toastr']).config(function (toastrConfig) {
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
        .when("/student", {
            templateUrl: "./views/students.html",
            controller: "studentCtrl"
        })
        .when("/attendence", {
            templateUrl: "./views/attendence.html",
            controller: "attendenceCtrl"
        })
        .when("/fee", {
            templateUrl: "./views/fee.html",
            controller: "feeCtrl"
        })
        .when("/exam", {
            templateUrl: "./views/exam.html",
            controller: "examCtrl"
        })
        .when("/result", {
            templateUrl: "./views/result.html",
            controller: "resultCtrl"
        })
        // .when("/inbox", {
        //     templateUrl: "./views/inbox.html",
        //     controller: "teacherCtrl"
        // })
        // .otherwise({
        //     templateUrl: "./views/404.html",
        // });
});