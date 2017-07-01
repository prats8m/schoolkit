app
    .controller('profileSettingCtrl', function ($scope, $mdDialog, $rootScope, toaster, appConstants, userSvc, profileSettingsSvc, utilitySvc, $cookies) {
        $scope.page = {
            title: appConstants.titileProfileSettings
        };

        //..Model......................................

        $scope.profileSettings = {
            changepassword: {
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

        $scope.updateLoggedInUserProfile = function () {
            profileSettingsSvc.updateLoggedInUserProfile(appConstants.manageaccount, appConstants.postMethod, {}, $scope.profileSettings.manageAccount, function (succResponse) {
                if (succResponse.status) {
                    $scope.profileSettings.manageAccount = {};
                    toaster.pop(appConstants.success, succResponse.msg.replace(/_/g, ' '));
                    alert(appConstants._successemailIDchangesconfirmationmessage);
                    utilitySvc.logoutfacilityWeb();
                }
            });
        };

        $scope.changeSecurityQuestion = function () {
            profileSettingsSvc.changeSecurityQuestion(appConstants.updatesecretquestions, appConstants.postMethod, {}, $scope.profileSettings.changeSecurityQuestions, function (succResponse) {
                if (succResponse.status) {
                    $scope.profileSettings.changeSecurityQuestions = {};
                    toaster.pop(appConstants.success, succResponse.msg.replace(/_/g, ' '));
                }
            });
        };

        $scope.changeloggedInuserPassword = function () {
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
        $scope.user_id = $cookies.get('userId');
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
        $scope.uploadProfilePic = function (file, user_id) {                    
            var fd = new FormData();
            fd.append('user_id', user_id);
            fd.append('file', file.files[0]);
            userSvc.uploadProfilePic(appConstants.userpicupload, appConstants.postMethod, {}, fd, function (succResponse) {
                if (succResponse.status) {
                    toaster.pop(appConstants.success, appConstants._successImageUpload);
                    $scope.currentUser = null;
                    $scope.currentUser = new Object();
                    setTimeout(function () {
                        $scope.$apply();
                    }, 300);
                  
                    setTimeout(function () {                      
                        $scope.getUserprofile();
                    }, 600);

                }
            });
        };
    });
