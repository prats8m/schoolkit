app
    .controller('profileSettingCtrl', function ($scope, $mdDialog, $rootScope, toaster, appConstants, userSvc, profileSettingsSvc, utilitySvc, $cookies) {
        $scope.page = {
            title: appConstants.titileProfileSettings
        };

        //..Model......................................
        $scope.user_id = $cookies.get('userId');
        $scope.profileSettings = {
            changepassword: {
                user_id: $scope.user_id,
                current_password: null,
                new_password: null,
                confirm_password: null
            },
            manageAccount: {
                new_email: null,
                confirm_email: null,
                current_password: null
            },
            changeSecurityQuestions: {
                sq_id: null,
                answer: null,
                current_password: null
            }
        };

        //..............................................

        $scope.dashboardInit = function () {
            profileSettingsSvc.dashboardInit(appConstants.userDashboard, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.dashboardData = succResponse.data ? succResponse.data : [];
                }
            });
            $scope.getSecurityQuestion();
        };

        $scope.getSecurityQuestion = function () {
            $scope.lstSecurityQuestions = [];
            profileSettingsSvc.getSecurityQuestion(appConstants.listsecretquestions, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.lstSecurityQuestions = succResponse.data ? succResponse.data : [];
                }
            });
        };

        $scope.updateLoggedInUserProfile = function (form) {
            if (!form.validate()) {
                return false;
            }
            profileSettingsSvc.updateLoggedInUserProfile(appConstants.manageaccount, appConstants.postMethod, {}, $scope.profileSettings.manageAccount, function (succResponse) {
                if (succResponse.status) {
                    $scope.profileSettings.manageAccount = {};
                    toaster.pop(appConstants.success, succResponse.msg.replace(/_/g, ' '));
                    alert(appConstants._successemailIDchangesconfirmationmessage);
                    utilitySvc.logoutfacilityWeb();
                }
            });
        };

        $scope.changeSecurityQuestion = function (form) {
            if (!form.validate()) {
                return false;
            }
            profileSettingsSvc.changeSecurityQuestion(appConstants.updatesecretquestions, appConstants.postMethod, {}, $scope.profileSettings.changeSecurityQuestions, function (succResponse) {
                if (succResponse.status) {
                    $scope.profileSettings.changeSecurityQuestions = {};
                    toaster.pop(appConstants.success, succResponse.msg.replace(/_/g, ' '));
                }
            });
        };

        $scope.changeloggedInuserPassword = function (form1dd) {
            if (!form1dd.validate()) {
                return false;
            }
            profileSettingsSvc.changeloggedInuserPassword(appConstants.userchangepassword, appConstants.postMethod, {}, $scope.profileSettings.changepassword, function (succResponse) {
                if (succResponse.status) {
                    $scope.profileSettings.changepassword = {};
                    toaster.pop(appConstants.success, succResponse.msg.replace(/_/g, ' '));
                    utilitySvc.logoutfacilityWeb();
                }
            });
        };
        //.....Init
        $scope.dashboardInit();

        $scope.getUserprofile = function () {
            var userId = $cookies.get('userId');
            userSvc.profileInit(appConstants.userviewuserdetails + '?user_id=' + userId, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.currentUser = succResponse.data;
                    $scope.currentUser.user_photo = $scope.currentUser.user_photo + '?_ts=' + new Date().getTime();
                }
            });
        }
        $scope.getUserprofile();
        $scope.getDateTimeFormat = function (value) {
            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            var date = new Date(value);
            var day = date.getDate();
            var month = monthNames[date.getMonth()];
            var year = date.getFullYear();
            var combined = day + ' ' + month + ' , ' + year;
            return combined;
        }
        $scope.$watch('myFile', function (newVal, oldVal) {
            if (newVal != oldVal) {
                $scope.getFile();
            }
        })
        $scope.uploadProfilePic = function (file, user_id) {
            // return;
            var fd = new FormData();
            fd.append('user_id', user_id);
            fd.append('file', file);
            userSvc.uploadProfilePic(appConstants.userpicupload, appConstants.postMethod, {}, fd, function (succResponse) {
                if (succResponse.status) {
                    toaster.pop(appConstants.success, appConstants._successImageUpload);
                    $scope.currentUser = null;
                    $scope.currentUser = new Object();
                    setTimeout(function () {
                        $scope.$apply();
                    }, 100);

                    setTimeout(function () {
                        $scope.getUserprofile();
                    }, 300);

                }
            });
        };
        $scope.myFile = "";
        $scope.getFile = function () {
            if ($scope.myFile.compressed) {
                var blob = dataURItoBlob($scope.myFile.compressed.dataURL);
                $scope.myFile._file = blob;
                $scope.uploadProfilePic($scope.myFile._file, $scope.user_id);
            }
        }
        var dataURItoBlob = function (dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0) {
                byteString = atob(dataURI.split(',')[1]);
            } else {
                byteString = decodeURI(dataURI.split(',')[1]);
            }
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var array = [];
            for (var i = 0; i < byteString.length; i++) {
                array.push(byteString.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], { type: mimeString });
        };
    });
