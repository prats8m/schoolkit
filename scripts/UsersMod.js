
'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the minovateApp

 
 
 */
app
    .controller('UserCtrl', function ($stateParams, $scope, $mdDialog, $http, $rootScope, $cookies, arrayPushService, $location, toaster, baseURL, $timeout, appConstants, userSvc, utilitySvc, $uibModal, $filter) {
        $scope.alphabateList = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        $scope.page = {
            title: appConstants.titleUsersUI,
            subtitle: appConstants.empty
        };
        $scope.facility = appConstants.empty;
        $rootScope.facilityId = $cookies.get("facilityId");
        $rootScope.schedule = {};

        $timeout(function () {
            $("md-tab-item[aria-controls^=tab-content]:contains('Credentials')").css("pointer-events", "none").css("opacity", "0.5");
            $("md-tab-item[aria-controls^=tab-content]:contains('User Groups')").css("pointer-events", "none").css("opacity", "0.5");
        });

        $scope.open_credentials = function () {
            $("md-tab-item[aria-controls^=tab-content]:contains('Credentials')").css("pointer-events", "block").css("opacity", "1");
            $timeout(function () {
                $("md-tab-item[aria-controls^=tab-content]:contains('Credentials')").click();
            });
            $timeout(function () { $scope.alldoorList(); });
        }

        //pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"

       $rootScope.check_submit = function(schedule_id, schedule){
        if(schedule_id == undefined){
          $mdDialog.cancel();
        }
        else{

          //Schedule edit 
          if(schedule.date != undefined){
            
            if(isNaN(schedule.date)){  
              var spli_date = schedule.date.split("/");
               schedule.schedule_start_date = spli_date[1]+"-"+spli_date[0]+"-"+spli_date[2];
            }
            else{
              
               schedule.schedule_start_date = (schedule.date.getMonth() + 1) + "-" + schedule.date.getDate() + "-" + schedule.date.getFullYear();
            }
          }
         
          var set_exp = schedule.expiration;
          var exp_date = new Date(schedule.expiration);
          schedule.expiration = (exp_date.getMonth() + 1) + "-" + exp_date.getDate() + "-" + exp_date.getFullYear();


          var weekday = new Array(7);
          weekday[0] = "Sunday";
          weekday[1] = "Monday";
          weekday[2] = "Tuesday";
          weekday[3] = "Wednesday";
          weekday[4] = "Thursday";
          weekday[5] = "Friday";
          weekday[6] = "Saturday";
          var ind = new Array();
          var sched_json = $filter('orderBy')(JSON.parse(scheduler.toJSON()), 'start_date');
          sched_json.forEach(function (v) {
          if (v.start_date != "NaN/NaN/NaN NaN:NaN") {
            delete v.id;
            delete v.text;
            var split_date = v.start_date.split(" ");
            v.day = weekday[new Date(v.start_date).getDay()];
            v.starttime = split_date[1];
            v.endtime = v.end_date.split(" ")[1];
            if ($scope.schedule.schedule_type == "ONETIME") {
              v.date = split_date[0].replace("/", "-").replace("/", "-");
              schedule.schedule_category = 1;
              delete schedule.schedule_start_date;
              delete schedule.schedule_end_date;
              delete schedule.expiration;
            }
            delete v.start_date;
            delete v.end_date;
            ind.push(v);
          }
          });
          schedule.schedule = ind;
          schedule.schedule_category = (schedule.schedule_type == "ONETIME" ? 1 : 0);
          var sch_type = schedule.schedule_type;
          schedule.schedule_type = "credential";



          delete schedule.schedule_sat; 
          delete schedule.schedule_sun;
          delete schedule.schedule_mon;
          delete schedule.schedule_tue;
          delete schedule.schedule_wed;
          delete schedule.schedule_thu;
          delete schedule.schedule_fri;
          schedule.schedule_exception_array = [];
          if(schedule.expiration == "NaN-NaN-NaN")
            delete schedule.expiration;

          if(schedule.schedule_end_date == "NaN-NaN-NaN")
            delete schedule.schedule_end_date;

          userSvc.submitEditSchedule(appConstants.scheduleEdit, appConstants.putMethod, {}, schedule, function (succResponse) {
          if (succResponse.status) {
            $scope.schedule = {}
            // schedule.expiration =  set_exp;
            // schedule.schedule_type = sch_type;

             $timeout(function () {
              $(".close_add").click();
            });
          }
          else{
            schedule.schedule_type = sch_type;
          }
          });
          //End Schedule Edit


        }
       }

        $rootScope.repetive_schedular = function () {
            angular.forEach($(".dhx_scale_bar"), function (value, key) {
                value.innerHTML = value.innerHTML.split(",")[0];
            });
            $(".dhx_cal_prev_button").hide();
            $(".dhx_cal_next_button").hide();
            $(".dhx_cal_today_button").hide();


        }

        $rootScope.custom_schedular = function () {
            $(".dhx_scale_bar")[0].innerHTML = $(".dhx_scale_bar:eq(0)").attr("aria-label");
            $(".dhx_scale_bar")[1].innerHTML = $(".dhx_scale_bar:eq(1)").attr("aria-label");
            $(".dhx_scale_bar")[2].innerHTML = $(".dhx_scale_bar:eq(2)").attr("aria-label");
            $(".dhx_scale_bar")[3].innerHTML = $(".dhx_scale_bar:eq(3)").attr("aria-label");
            $(".dhx_scale_bar")[4].innerHTML = $(".dhx_scale_bar:eq(4)").attr("aria-label");
            $(".dhx_scale_bar")[5].innerHTML = $(".dhx_scale_bar:eq(5)").attr("aria-label");
            $(".dhx_scale_bar")[6].innerHTML = $(".dhx_scale_bar:eq(6)").attr("aria-label");
            $(".dhx_cal_prev_button").show();
            $(".dhx_cal_next_button").show();
            $(".dhx_cal_today_button").show();

        }

        $scope.cleanAccordionFormObject = function (UI, objectType) {
            switch (UI) {
                case appConstants.adduser:
                    switch (objectType) {
                        case 'accessCode':
                            $scope.accesscode = {};
                            break;
                        case 'phoneCode':
                            $scope.phoneCode = {};
                            break;
                        case 'rfid':
                            $scope.rfid = {};
                            break;
                        case 'savenfc':
                            $scope.savenfc = {};
                            break;
                        case 'ble_code':
                            $scope.ble_code = {};
                            break;
                        case 'wiegand_code':
                            $scope.wiegand = {};
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
        };

        $scope.result = appConstants.empty;
        $scope.showConfirm = function (ev, id) {
            var confirm = $mdDialog.confirm()
                .title(appConstants._deleteuserconfirmationmessage)
                .content(appConstants.empty)
                .ok(appConstants.delete)
                .cancel(appConstants.cancel)
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                userSvc.deleteUser(appConstants.userdelete + '?user_id=' + id, appConstants.deleteMethod, {}, {}, function (succResponse) {
                    if (succResponse.status) {
                        //toaster.pop('info', appConstants._successfullyuserdeletedmessage);
                        toaster.pop(appConstants.success, succResponse.msg);
                        var users = $scope.users;
                        var tempUser = [];
                        for (var i = 0; i < users.length; i++) {
                            if (id != users[i].user_id) {
                                tempUser.push(users[i]);
                            }
                        }
                        $scope.users = tempUser;
                        $rootScope.dashboardData.user--;
                    }
                });
            }, function () {
                toaster.pop(appConstants.info, appConstants._canceluserdeletionmessage);
            });
        };

        $scope.layout = appConstants.gridLayout;
        $scope.class = appConstants.gridviewClass;
        $scope.changeClass = function () {
            if ($scope.class === appConstants.gridviewClass)
                $scope.class = appConstants.listviewClass;
            $scope.layout = appConstants.listLayout;
        };

        $scope.changeaClass = function () {
            if ($scope.class === appConstants.listviewClass)
                $scope.class = appConstants.gridviewClass;
            $scope.layout = appConstants.gridLayout;
        };

        $scope.refreshList = function () {
            $scope.searchAlphabet = '';
            $scope.pageNo = 1;
            $(".f-wm:contains(" + appConstants.nomoredataavailable + ")").text('Load More').css("opacity", 1);
            $scope.usersInit();
        }
        $scope.pageNo = 1;
        $scope.searchText = appConstants.empty;
        $scope.users = [];
        $scope.searchAlphabet = '';
        $scope.searchByAlphabet = function (alphabet) {
            $scope.searchText = '';
            $(".f-wm:contains(" + appConstants.nomoredataavailable + ")").text('Load More').css("opacity", 1);
            $scope.pageNo = 1;
            if (alphabet == 'All') {
                $scope.searchAlphabet = '';
                $scope.usersInit();
                return;
            }
            $scope.searchAlphabet = alphabet;
            $scope.usersInit();

        }
        $scope.usersInit = function () {

            userSvc.usersInit(appConstants.userlist + '?limit='+ appConstants.pageLimit +'&pageNo=' + $scope.pageNo + '&searchVal=' + $scope.searchText + '&facility_id=' + utilitySvc.getCurrentFacility() + '&albhabet=' + $scope.searchAlphabet, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    if ($scope.pageNo <= 1)
                        $scope.users = [];
                    angular.forEach(succResponse["data"]["data"], function (user, index) {
                        $scope.users.push(user);
                    });
                    $scope.count = succResponse["data"].count;
                    // $scope.users =  arrayPushService.arrayPush(succResponse.data.data, $scope.users);
                    $scope.pageNo = $scope.pageNo + 1;
                }
                else {
                    if (succResponse.data == null) {
                        $(".f-wm:contains(Load more)").text(appConstants.nomoredataavailable).css("opacity", 0.7);
                    }
                    if (succResponse.msg == 'No_Records_Found') {
                        $scope.users = [];
                    }
                }
            });
        };
        $scope.usersInit();

        $scope.searchFunction = function (e) {
            if (e)
                if (e.keyCode != 13) { return false; }
            if (!$scope.searchText) {
                $scope.searchText = appConstants.empty;
            }
            $scope.searchAlphabet = '';
            $(".f-wm:contains(" + appConstants.nomoredataavailable + ")").text('Load More').css("opacity", 1);
            $scope.pageNo = 1;
            $scope.users = [];
            userSvc.searchFunction(appConstants.userlist + '?limit='+ appConstants.pageLimit +'&pageNo=' + $scope.pageNo + '&searchVal=' + $scope.searchText, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.users = succResponse.data.data;
                    $scope.pageNo = $scope.pageNo + 1;
                }
            });
        };

        $scope.orderByMe = function (x) {
            $scope.myOrderBy = x;
        };

        $scope.imagePath = baseURL + appConstants.imagePath;
        $scope.facilityInit = function () {
            userSvc.facilityInit(appConstants.facilitylist, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.facilityList = succResponse.data.data;
                    $scope.facility = appConstants.empty;
                }
                else {
                    $scope.facilityList = {};
                    $scope.facility = {};
                }
            });
        };

        $scope.doorList = function () {
            userSvc.doorList(appConstants.userlistdoorcredential + parseInt($cookies.get("newUserId")), appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.door_lists = succResponse.data;
                }
            });
        };

        $scope.alldoorList = function () {
            userSvc.alldoorList(appConstants.doorlist, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.door_lists = succResponse.data.data;
                }
            });
        };

        //unnecesarily call............
        $scope.doorList();
        $scope.HandleProfilePicAddUpdateClick = function () {
            var fileinput = document.getElementById("profilePicAddUpdate");
            fileinput.click();
        };

        $scope.uploadProfilePic = function (file, user_id) {
            var fd = new FormData();
            fd.append('user_id', user_id);
            fd.append('file', file);
            userSvc.uploadProfilePic(appConstants.userpicupload, appConstants.postMethod, {}, fd, function (succResponse) {
                if (succResponse.status) {
                    //toaster.pop(appConstants.success,appConstants._successImageUpload);
                }
            });
        };

        $scope.userData = {};
        $scope.userData.status = 1;
        $scope.submitUserData = function (userData, user_form) {
            if (!user_form.validate({
                rules: {
                    user_phone_no: {
                        rangelength: [10, 15]
                    }
                }
            })) {
                var parDIV = $('#expirationdate-error').parents("div");
                var errorlabel = $('#' + parDIV[0].id).children('label');
                $('#' + errorlabel[0].id).remove();
                var html = $('#' + parDIV[0].id)[0].outerHTML + errorlabel[0].outerHTML;
                $('#' + parDIV[1].id).append(errorlabel[0].outerHTML);
                return false;
            }
            if (!userData) {
                $rootScope.user_error = appConstants.incompleteform;
                return false;
            }
            //userData.user_phone_no = parseInt(userData.user_phone_no);
            userData.zip_code = parseInt(userData.zip_code);
            userData.user_type = appConstants.usertype.admin;
            var ex_date = userData.expirationdate;
            var date = new Date(userData.expirationdate)
            userData.expiration_date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();

            if (!userData.expirationdate)
                userData.expiration_date = appConstants.empty;

            delete userData["expirationdate"];

            // userData.facility_id = parseInt($cookies.get("facilityId"));;
            if (userData.password != userData.cpassword) {
                alert(appConstants.messageOncheckifpwdAndcnfrmpwdSame);
                return false;
            }
            delete userData.photo;
            userSvc.submitUserData(appConstants.useradd, appConstants.postMethod, {}, userData, function (succResponse) {
                userData.expirationdate = ex_date;
                $scope.user_error = appConstants.empty;
                $scope.accesscode = {};
                var x = Math.floor(Math.random() * 9999999999) + 10000;
                $scope.accesscode.access_code = parseInt((appConstants.empty + x).substring(8, length));
                $scope.accesscode.access_code_status = appConstants.active;
                if (succResponse.status) {
                    if ($scope.myFile) {
                        var file = $scope.myFile;
                        $scope.uploadProfilePic(file, succResponse.data.user_id);
                    }
                    $cookies.put("newUserId", succResponse.data.user_id);
                    $("md-tab-item[aria-controls^=tab-content]:contains('User Groups')").css("pointer-events", "visible").css("opacity", "1");
                    $("md-tab-item[aria-controls^=tab-content]:contains('Credentials')").css("pointer-events", "none").css("opacity", "0.7");
                    $("md-tab-item[aria-controls^=tab-content]:contains('Account')").css("pointer-events", "none").css("opacity", "0.7");
                    $timeout(function () {
                        $(".ng-scope:contains(User Groups)").trigger("click");
                        $rootScope.dashboardData.user++;
                    });
                    $timeout(function () {
                        $scope.facilityInit();
                    });
                    $timeout(function () {
                        $scope.assignedGroup();
                    });
                }
                else {
                    $scope.user_error = succResponse.msg;
                }
            });
        };
        $scope.rfid = {};
        $scope.rfid.status = 1;

        $scope.getRfidList = function () {
            userSvc.getRfidList(appConstants.credentiallist + '?user_id=' + parseInt($cookies.get("newUserId")) + '&type=rfid_code', appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.rfid_code_list = succResponse.data;
                }
                else {
                    if (!succResponse.error) {
                        $scope.rfid_code_list = [];
                    }
                }
            });
        };

        $scope.saveRFID = function (rfid, rfid_form) {
            if (!rfid_form.validate()) {
                return false;
            }
            if (rfid == undefined) {
                $rootScope.rfid_error = appConstants.incompleteform;
                return false;
            }
            if($scope.schedule.schedule_type == "REPEATING"){
              if($scope.schedule.date == undefined){
                toaster.pop('error', "Please Add Start Date In Schedule");
                return false;
              }
            }
            //Add scheduler
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
            var ind = new Array();
            $scope.rfid_schedule = {};
            var sched_json = $filter('orderBy')(JSON.parse(scheduler.toJSON()), 'start_date');
            sched_json.forEach(function (v) {
                if (v.start_date != "NaN/NaN/NaN NaN:NaN") {
                    delete v.id;
                    delete v.text;
                    $scope.rfid_schedule.schedule_category = 0;
                    var split_date = v.start_date.split(" ");
                    v.day = weekday[new Date(v.start_date).getDay()];
                    v.starttime = split_date[1];
                    v.endtime = v.end_date.split(" ")[1];
                    if ($scope.schedule.schedule_type == "ONETIME") {
                        v.date = split_date[0].replace("/", "-").replace("/", "-");
                        $scope.rfid_schedule.schedule_category = 1;
                    }
                    delete v.start_date;
                    delete v.end_date;
                    ind.push(v);
                }

            });
            //End of add scheduler
            $scope.rfid_schedule.schedule = ind;
            rfid.user_id = parseInt($cookies.get("newUserId"));
            rfid.credential_type = "rfid_code";

            rfid.details = {};
            rfid.details.rfid_facility_id = JSON.stringify(parseInt(rfid.rfid_facility_code));
            rfid.details.rfid_card_no = JSON.stringify(parseInt(rfid.rfid_card_no));
            delete rfid.rfid_card_no;
            delete rfid.rfid_facility_code;

            if (rfid.credential_id == null) {
                var meth = appConstants.postMethod;
                var url = appConstants.useraddcredentials;
            }
            else {
                rfid.uc_id = rfid.credential_id;
                delete rfid.credential_id;
                var meth = appConstants.putMethod;
                var url = appConstants.usereditcredential;
            }
            if (scheduler.toJSON() == "[]") {
                if ($scope.assingned_usergroups == undefined) {
                    rfid.schedule_type = 1;
                }
                else {
                    rfid.schedule_type = 0;
                }

                userSvc.saveRFID(url, meth, {}, rfid, function (succResponse) {
                    $scope.rfid_error = appConstants.empty;
                    if (succResponse.status) {

                        $timeout(function () {
                            $(".accordion-toggle")[3].click();
                        });
                        $timeout(function () {
                            $scope.getRfidList();
                        });
                        if (!rfid.uc_id) {
                            toaster.pop(appConstants.success, appConstants.rfidaddedsuccessfully);
                        }
                        else {
                            toaster.pop(appConstants.success, appConstants.rfidupdatedsuccessfully);
                        }
                        $scope.rfid.credential_id = null;
                    }
                    else {
                        $scope.rfid_error = succResponse.msg;
                    }
                });
            }
            else {
                if ($scope.schedule.date != undefined) {

                    var start_date = new Date($scope.schedule.date);
                    $scope.rfid_schedule.schedule_start_date = (start_date.getMonth() + 1) + "-" + start_date.getDate() + "-" + start_date.getFullYear();

                }
                $scope.rfid_schedule.no_expirations = $scope.schedule.no_expirations;
                if ($scope.schedule.expiration != undefined) {
                    var exp_date = new Date($scope.schedule.expiration);
                    $scope.rfid_schedule.expiration = (exp_date.getMonth() + 1) + "-" + exp_date.getDate() + "-" + exp_date.getFullYear();
                }
                $scope.rfid_schedule.schedule_type = "credential";
                userSvc.submitSchedule(appConstants.scheduleadd, appConstants.postMethod, {}, $scope.rfid_schedule, function (success) {
                    JSON.parse(scheduler.toJSON()).forEach(function (v) { scheduler.deleteEvent(v.id); });

                    if (success.status) {
                        rfid.schedule_id = success.data;
                        rfid.schedule_type = 2;
                        userSvc.saveRFID(url, meth, {}, rfid, function (succResponse) {
                            $scope.rfid_error = appConstants.empty;
                            if (succResponse.status) {
                                $timeout(function () {
                                    $(".accordion-toggle")[3].click();
                                });
                                $timeout(function () {
                                    $scope.getRfidList();
                                });
                                if (!rfid.uc_id) {
                                    toaster.pop(appConstants.success, appConstants.rfidaddedsuccessfully);
                                }
                                else {
                                    toaster.pop(appConstants.success, appConstants.rfidupdatedsuccessfully);
                                }
                                $scope.rfid.credential_id = null;
                            }
                            else {
                                $scope.rfid_error = succResponse.msg;
                            }
                        });
                    }
                });
            }


        };

        $scope.saveWiegand = function (wiegand, wiegand_form) {
            if (!wiegand_form.validate()) {
                return false;
            }
            if (wiegand == undefined) {
                $rootScope.wiegand_error = appConstants.incompleteform;
                return false;
            }
            if($scope.schedule.schedule_type == "REPEATING"){
              if($scope.schedule.date == undefined){
                toaster.pop('error', "Please Add Start Date In Schedule");
                return false;
              }
            }
            //Add scheduler
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
            var ind = new Array();
            $scope.wiegand_schedule = {};
            var sched_json = $filter('orderBy')(JSON.parse(scheduler.toJSON()), 'start_date');
            sched_json.forEach(function (v) {
                if (v.start_date != "NaN/NaN/NaN NaN:NaN") {
                    delete v.id;
                    delete v.text;
                    $scope.wiegand_schedule.schedule_category = 0;
                    var split_date = v.start_date.split(" ");
                    v.day = weekday[new Date(v.start_date).getDay()];
                    v.starttime = split_date[1];
                    v.endtime = v.end_date.split(" ")[1];
                    if ($scope.schedule.schedule_type == "ONETIME") {
                        v.date = split_date[0].replace("/", "-").replace("/", "-");
                        $scope.wiegand_schedule.schedule_category = 1;
                    }
                    delete v.start_date;
                    delete v.end_date;
                    ind.push(v);
                }

            });
            //End of add scheduler
            $scope.wiegand_schedule.schedule = ind;
            wiegand.user_id = parseInt($cookies.get("newUserId"));
            wiegand.credential_type = "wiegand_code";

            $scope.wiegand = {};
            wiegand.details = {};
            wiegand.details.wiegand_facility_code = wiegand.wiegand_facility_code;
            wiegand.details.wiegand_card_number = wiegand.wiegand_card_number;
            wiegand.door_id = wiegand.door_id;
            wiegand.status = wiegand.status;



            if (wiegand.credential_id == null) {
                var meth = appConstants.postMethod;
                var url = appConstants.useraddcredentials;
            }
            else {
                wiegand.uc_id = wiegand.credential_id;
                delete wiegand.credential_id;
                var meth = appConstants.putMethod;
                var url = appConstants.usereditcredential;
            }
            if (scheduler.toJSON() == "[]") {
                if ($scope.assingned_usergroups == undefined) {
                    wiegand.schedule_type = 1;
                }
                else {
                    wiegand.schedule_type = 0;
                }
                userSvc.savewiegand(url, meth, {}, wiegand, function (succResponse) {
                    $scope.wiegand_error = appConstants.empty;
                    if (succResponse.status) {
                        $scope.wiegand = {};
                        $timeout(function () {
                            // $(".accordion-toggle")[3].click();
                        });
                        $timeout(function () {
                            $scope.getWiegandList();
                        });
                        if (!wiegand.uc_id) {
                            toaster.pop(appConstants.success, appConstants.wiegandaddedsuccessfully);
                        }
                        else {
                            toaster.pop(appConstants.success, appConstants.wiegandupdatedsuccessfully);
                        }
                        $scope.wiegand.credential_id = null;
                    }
                    else {
                        $scope.wiegand_error = succResponse.msg;
                    }
                });
            }
            else {
                if ($scope.schedule.date != undefined) {
                    var start_date = new Date($scope.schedule.date);
                    $scope.wiegand_schedule.schedule_start_date = (start_date.getMonth() + 1) + "-" + start_date.getDate() + "-" + start_date.getFullYear();
                }
                $scope.wiegand_schedule.no_expirations = $scope.schedule.no_expirations;
                if ($scope.schedule.expiration != undefined) {
                    var exp_date = new Date($scope.schedule.expiration);
                    $scope.wiegand_schedule.expiration = (exp_date.getMonth() + 1) + "-" + exp_date.getDate() + "-" + exp_date.getFullYear();
                }
                $scope.wiegand_schedule.schedule_type = "credential";
                userSvc.submitSchedule(appConstants.scheduleadd, appConstants.postMethod, {}, $scope.wiegand_schedule, function (success) {
                    JSON.parse(scheduler.toJSON()).forEach(function (v) { scheduler.deleteEvent(v.id); });

                    if (success.status) {
                        wiegand.schedule_id = success.data;
                        wiegand.schedule_type = 2;
                        userSvc.savewiegand(url, meth, {}, wiegand, function (succResponse) {
                            $scope.wiegand_error = appConstants.empty;
                            if (succResponse.status) {
                                $scope.wiegand = {};
                                $timeout(function () {
                                    // $(".accordion-toggle")[3].click();
                                });
                                $timeout(function () {
                                    $scope.getWiegandList();
                                });
                                if (!wiegand.uc_id) {
                                    toaster.pop(appConstants.success, appConstants.wiegandaddedsuccessfully);
                                }
                                else {
                                    toaster.pop(appConstants.success, appConstants.wiegandupdatedsuccessfully);
                                }
                                $scope.wiegand.credential_id = null;
                            }
                            else {
                                $scope.wiegand_error = succResponse.msg;
                            }
                        });
                    }
                });

            }
        };

        $scope.phoneCode = {};
        var x = Math.floor(Math.random() * 9999999999) + 10000;
        $scope.phoneCode.phone_code = (appConstants.empty + x).substring(8, length);
        $scope.phoneCode.status = 1;


        $scope.getPhoneList = function () {
            userSvc.getPhoneList(appConstants.credentiallist + '?user_id=' + parseInt($cookies.get("newUserId")) + '&type=phone_code', appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.phone_code_list = succResponse.data;
                }
                else {
                    if (!succResponse.error) {
                        $scope.phone_code_list = [];
                    }
                }
            });
        };

        $scope.getWiegandList = function () {
            userSvc.getWiegandList(appConstants.credentiallist + '?user_id=' + parseInt($cookies.get("newUserId")) + '&type=wiegand_code', appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.wiegand_code_list = succResponse.data;
                }
                else {
                    if (!succResponse.error) {
                        $scope.wiegand_code_list = [];
                    }
                }
            });
        };

        $scope.phoneCode.status = 1;
        $scope.timedropdown = appConstants.timedropdown;
        $scope.submitPhoneCode = function (phoneCode, phone_form) {
            if (!phone_form.validate()) {
                return false;
            }
            if($scope.schedule.schedule_type == "REPEATING"){
              if($scope.schedule.date == undefined){
                toaster.pop('error', "Please Add Start Date In Schedule");
                return false;
              }
            }

            //Add scheduler
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
            var ind = new Array();
            $scope.phoneCode = {};
            var sched_json = $filter('orderBy')(JSON.parse(scheduler.toJSON()), 'start_date');
            sched_json.forEach(function (v) {
                if (v.start_date != "NaN/NaN/NaN NaN:NaN") {
                    delete v.id;
                    delete v.text;
                    $scope.phoneCode.schedule_category = 0;
                    var split_date = v.start_date.split(" ");
                    v.day = weekday[new Date(v.start_date).getDay()];
                    v.starttime = split_date[1];
                    v.endtime = v.end_date.split(" ")[1];
                    if ($scope.schedule.schedule_type == "ONETIME") {
                        v.date = split_date[0].replace("/", "-").replace("/", "-");
                        $scope.phoneCode.schedule_category = 1;
                    }
                    delete v.start_date;
                    delete v.end_date;
                    ind.push(v);
                }

            });
            //End of add scheduler
            $scope.phoneCode.schedule = ind;
            phoneCode.user_id = parseInt($cookies.get("newUserId"));
            phoneCode.credential_type = "phone_code";
            phoneCode.details = {};
            phoneCode.details.phone_code = phoneCode.phone_code;
            phoneCode.details.phone_numbers = [];
            phoneCode.details.phone_numbers[0] = {phone_number:phoneCode.phone_numbers1,starttime:phoneCode.starttime1,endtime:phoneCode.endtime1,type:phoneCode.type1};
            phoneCode.details.phone_numbers[1] = {phone_number:phoneCode.phone_numbers2,starttime:phoneCode.starttime2,endtime:phoneCode.endtime3,type:phoneCode.type2};
            phoneCode.details.phone_numbers[2] = {phone_number:phoneCode.phone_numbers3,starttime:phoneCode.starttime2,endtime:phoneCode.endtime3,type:phoneCode.type3};
            delete phoneCode.phone_code;
            delete phoneCode.phone_numbers;

            if (phoneCode.credential_id == null) {
                var meth = appConstants.postMethod;
                var url = appConstants.useraddcredentials;
            }
            else {
                phoneCode.uc_id = phoneCode.credential_id;
                delete phoneCode.credential_id;
                var meth = appConstants.putMethod;
                var url = appConstants.usereditcredential;
            }
            if (scheduler.toJSON() == "[]") {
                if ($scope.assingned_usergroups == undefined) {
                    phoneCode.schedule_type = 1;
                }
                else {
                    phoneCode.schedule_type = 0;
                }
                userSvc.submitPhoneCode(url, meth, {}, phoneCode, function (succResponse) {
                    if (succResponse.status) {
                        $timeout(function () {
                            $(".accordion-toggle")[2].click();
                        });
                        $timeout(function () {
                            $scope.getPhoneList();
                        });
                        if (!phoneCode.uc_id) {
                            toaster.pop(appConstants.success, appConstants.phonecodeaddedsuccessfully);
                        }
                        else {
                            toaster.pop(appConstants.appConstants.success, appConstants.phonecodeupdatedsuccessfully);
                        }
                        $scope.phoneCode.credential_id = null;
                    }
                    else {
                        $rootScope.phone_error = succResponse.msg;
                    }
                });
            }
            else {
                if ($scope.schedule.date != undefined) {
                    var start_date = new Date($scope.schedule.date);
                    $scope.phoneCode.schedule_start_date = (start_date.getMonth() + 1) + "-" + start_date.getDate() + "-" + start_date.getFullYear();
                }
                $scope.phoneCode.no_expirations = $scope.schedule.no_expirations;
                if ($scope.schedule.expiration != undefined) {
                    var exp_date = new Date($scope.schedule.expiration);
                    $scope.phoneCode.expiration = (exp_date.getMonth() + 1) + "-" + exp_date.getDate() + "-" + exp_date.getFullYear();
                }
                $scope.phoneCode.schedule_type = "credential";
                userSvc.submitSchedule(appConstants.scheduleadd, appConstants.postMethod, {}, $scope.phoneCode, function (success) {
                    JSON.parse(scheduler.toJSON()).forEach(function (v) { scheduler.deleteEvent(v.id); });
                    if (success.status) {
                        phoneCode.schedule_id = success.data;
                        phoneCode.schedule_type = 2;
                        userSvc.submitPhoneCode(url, meth, {}, phoneCode, function (succResponse) {
                            if (succResponse.status) {
                                $timeout(function () {
                                    $(".accordion-toggle")[2].click();
                                });
                                $timeout(function () {
                                    $scope.getPhoneList();
                                });
                                if (!phoneCode.uc_id) {
                                    toaster.pop(appConstants.success, appConstants.phonecodeaddedsuccessfully);
                                }
                                else {
                                    toaster.pop(appConstants.appConstants.success, appConstants.phonecodeupdatedsuccessfully);
                                }
                                $scope.phoneCode.credential_id = null;
                            }
                            else {
                                $rootScope.phone_error = succResponse.msg;
                            }
                        });
                    }
                });
            }
        };

        $scope.getBleList = function () {
            userSvc.getBleList(appConstants.credentiallist + '?user_id=' + parseInt($cookies.get("newUserId")) + '&type=ble_code', appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.ble_code_list = succResponse.data;
                }
                else {
                    if (!succResponse.error) {
                        $scope.ble_code_list = [];
                    }
                }
            });
        };

        $scope.ble_code = {};
        $scope.ble_code.status = 1;
        $scope.saveBLEcode = function (ble_code, ble_form) {
            if (!ble_form.validate()) {
                return false;
            }
            if (ble_code == undefined) {
                $scope.blecode_error = appConstants.incompleteform;
                return false;
            }
            if($scope.schedule.schedule_type == "REPEATING"){
              if($scope.schedule.date == undefined){
                toaster.pop('error', "Please Add Start Date In Schedule");
                return false;
              }
            }
            //Add scheduler
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
            var ind = new Array();
            $scope.ble_code = {};
            var sched_json = $filter('orderBy')(JSON.parse(scheduler.toJSON()), 'start_date');
            sched_json.forEach(function (v) {
                if (v.start_date != "NaN/NaN/NaN NaN:NaN") {
                    delete v.id;
                    delete v.text;
                    $scope.ble_code.schedule_category = 0;
                    var split_date = v.start_date.split(" ");
                    v.day = weekday[new Date(v.start_date).getDay()];
                    v.starttime = split_date[1];
                    v.endtime = v.end_date.split(" ")[1];
                    if ($scope.schedule.schedule_type == "ONETIME") {
                        v.date = split_date[0].replace("/", "-").replace("/", "-");
                        $scope.ble_code.schedule_category = 1;
                    }
                    delete v.start_date;
                    delete v.end_date;
                    ind.push(v);
                }

            });
            //End of add scheduler
            $scope.ble_code.schedule = ind;
            ble_code.user_id = parseInt($cookies.get("newUserId"));
            ble_code.credential_type = "ble_code";
            ble_code.details = {};
            ble_code.details.ble_username = ble_code.ble_name;
            ble_code.details.ble_password = ble_code.ble_pass;
            delete ble_code.ble_name;
            delete ble_code.ble_pass;

            if (ble_code.credential_id == null) {
                var meth = appConstants.postMethod;
                var url = appConstants.useraddcredentials;
            }
            else {
                ble_code.uc_id = ble_code.credential_id;
                delete ble_code.credential_id;
                var meth = appConstants.putMethod;
                var url = appConstants.usereditcredential;
            }
            if (scheduler.toJSON() == "[]") {
                if ($scope.assingned_usergroups == undefined) {
                    ble_code.schedule_type = 1;
                }
                else {
                    ble_code.schedule_type = 0;
                }
                userSvc.saveBLEcode(url, meth, {}, ble_code, function (succResponse) {
                    if (succResponse.status) {
                        $timeout(function () {
                            $scope.getBleList();
                        });
                        if (!ble_code.uc_id) {
                            toaster.pop(appConstants.success, appConstants.blecodeaddedsuccessfully);
                        }
                        else {
                            toaster.pop(appConstants.success, appConstants.blecodeupdatedsuccessfully);
                        }
                        $scope.ble_code.credential_id = null;
                    }
                    else {
                        $rootScope.blecode_error = succResponse.msg;
                    }
                });
            }
            else {
                if ($scope.schedule.date != undefined) {
                    var start_date = new Date($scope.schedule.date);
                    $scope.ble_code.schedule_start_date = (start_date.getMonth() + 1) + "-" + start_date.getDate() + "-" + start_date.getFullYear();
                }
                $scope.ble_code.no_expirations = $scope.schedule.no_expirations;
                if ($scope.schedule.expiration != undefined) {
                    var exp_date = new Date($scope.schedule.expiration);
                    $scope.ble_code.expiration = (exp_date.getMonth() + 1) + "-" + exp_date.getDate() + "-" + exp_date.getFullYear();
                }
                $scope.ble_code.schedule_type = "credential";
                userSvc.submitSchedule(appConstants.scheduleadd, appConstants.postMethod, {}, $scope.ble_code, function (success) {
                    JSON.parse(scheduler.toJSON()).forEach(function (v) { scheduler.deleteEvent(v.id); });

                    if (success.status) {
                        ble_code.schedule_id = success.data;
                        ble_code.schedule_type = 2;
                        userSvc.saveBLEcode(url, meth, {}, ble_code, function (succResponse) {
                            if (succResponse.status) {
                                $timeout(function () {
                                    $scope.getBleList();
                                });
                                if (!ble_code.uc_id) {
                                    toaster.pop(appConstants.success, appConstants.blecodeaddedsuccessfully);
                                }
                                else {
                                    toaster.pop(appConstants.success, appConstants.blecodeupdatedsuccessfully);
                                }
                                $scope.ble_code.credential_id = null;
                            }
                            else {
                                $rootScope.blecode_error = succResponse.msg;
                            }

                        });
                    }
                });
            }
        };

        $scope.generateAddAccessCode = function () {
            // $scope.accesscode = {};
            var x = Math.floor(Math.random() * 9999999999) + 10000;
            $scope.accesscode.access_code = parseInt((appConstants.empty + x).substring($scope.accesscode.accesscode_size, length));
        };

        $rootScope.generateAddPhoneCode = function () {
            // $scope.phoneCode = {};
            var x = Math.floor(Math.random() * 9999999999) + 10000;
            $scope.phoneCode.phone_code = (appConstants.empty + x).substring($scope.phoneCode.phoneCode_size, length);
        };
        $scope.generateNFCCode = function () {
            // $scope.savenfc = {};
            var x = Math.floor(Math.random() * 9999999999) + 10000;
            $scope.savenfc.nfc_code = (appConstants.empty + x).substring($scope.savenfc.savenfc_size, length);
        };

        //NFC code edit
        $scope.getNfcCodeList = function () {
            userSvc.getNfcCodeList(appConstants.credentiallist + '?user_id=' + parseInt($cookies.get("newUserId")) + '&type=nfc_code', appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.nfc_code_list = succResponse.data;
                }
                else {
                    if (!succResponse.error) {
                        $scope.nfc_code_list = [];
                    }
                }
            });
        };

        $scope.savenfc = {};
        $scope.savenfc.status = 1;
        $scope.saveNFCcode = function (savenfc, nfc_form) {
            if (!nfc_form.validate()) {
                return false;
            }
            if($scope.schedule.schedule_type == "REPEATING"){
              if($scope.schedule.date == undefined){
                toaster.pop('error', "Please Add Start Date In Schedule");
                return false;
              }
            }
            savenfc.user_id = parseInt($cookies.get("newUserId"));
            savenfc.credential_type = "nfc_code";
            savenfc.details = {};
            savenfc.details.nfc_code = savenfc.nfc_code;
            savenfc.details.nfc_facility_code = savenfc.nfc_facility_code;
            // savenfc.details.nfc_facility_id = JSON.stringify(parseInt($cookies.get("facilityId")));
            delete savenfc.nfc_code;
            delete savenfc.nfc_facility_code;
            if (savenfc.credential_id == null) {
                var meth = appConstants.postMethod;
                var url = appConstants.useraddcredentials;
            }
            else {
                savenfc.uc_id = savenfc.credential_id;
                delete savenfc.credential_id;
                var meth = appConstants.putMethod;
                var url = appConstants.usereditcredential;
            }

            //Add scheduler
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
            var ind = new Array();
            // $scope.savenfc = {};
            var sched_json = $filter('orderBy')(JSON.parse(scheduler.toJSON()), 'start_date');
            sched_json.forEach(function (v) {
                if (v.start_date != "NaN/NaN/NaN NaN:NaN") {
                    delete v.id;
                    delete v.text;
                    $scope.savenfc.schedule_category = 0;
                    var split_date = v.start_date.split(" ");
                    v.day = weekday[new Date(v.start_date).getDay()];
                    v.starttime = split_date[1];
                    v.endtime = v.end_date.split(" ")[1];
                    if ($scope.schedule.schedule_type == "ONETIME") {
                        v.date = split_date[0].replace("/", "-").replace("/", "-");
                        $scope.savenfc.schedule_category = 1;
                    }
                    delete v.start_date;
                    delete v.end_date;
                    ind.push(v);
                }

            });
            //End of add scheduler
            $scope.savenfc.schedule = ind;

            if (scheduler.toJSON() == "[]") {
                if ($scope.assingned_usergroups == undefined) {
                    savenfc.schedule_type = 1;
                }
                else {
                    savenfc.schedule_type = 0;
                }
                userSvc.saveNFCcode(url, meth, {}, savenfc, function (succResponse) {
                    if (succResponse.status) {
                        $timeout(function () {
                            $(".accordion-toggle")[4].click();
                        });
                        $timeout(function () {
                            $scope.getNfcCodeList();
                        });
                        if (!savenfc.uc_id) {
                            toaster.pop(appConstants.success, appConstants.nfccodeaddedsuccessfully);
                        }
                        else {
                            toaster.pop(appConstants.success, appConstants.nfccodeupdatedsuccessfully);
                        }
                        $scope.savenfc.credential_id = null;
                        $rootScope.NFCCodeMessage = appConstants.empty;
                    }
                    else {
                        // $scope.savenfc.nfc_code = savenfc.details.nfc_code;

                        $rootScope.NFCCodeMessage = succResponse.msg;
                    }
                });
            }
            else {
                if ($scope.schedule.date != undefined) {
                    var start_date = new Date($scope.schedule.date);
                    $scope.savenfc.schedule_start_date = (start_date.getMonth() + 1) + "-" + start_date.getDate() + "-" + start_date.getFullYear();
                }
                $scope.savenfc.no_expirations = $scope.schedule.no_expirations;
                if ($scope.schedule.expiration != undefined) {
                    var exp_date = new Date($scope.schedule.expiration);
                    $scope.savenfc.expiration = (exp_date.getMonth() + 1) + "-" + exp_date.getDate() + "-" + exp_date.getFullYear();
                }
                $scope.savenfc.schedule_type = "credential";
                userSvc.submitSchedule(appConstants.scheduleadd, appConstants.postMethod, {}, $scope.savenfc, function (success) {
                    JSON.parse(scheduler.toJSON()).forEach(function (v) { scheduler.deleteEvent(v.id); });
                    if (success.status) {
                        savenfc.schedule_id = success.data;
                        savenfc.schedule_type = 2;
                        userSvc.saveNFCcode(url, meth, {}, savenfc, function (succResponse) {
                            if (succResponse.status) {
                                $timeout(function () {
                                    $(".accordion-toggle")[4].click();
                                });
                                $timeout(function () {
                                    $scope.getNfcCodeList();
                                });
                                if (!savenfc.uc_id) {
                                    toaster.pop(appConstants.success, appConstants.nfccodeaddedsuccessfully);
                                }
                                else {
                                    toaster.pop(appConstants.success, appConstants.nfccodeupdatedsuccessfully);
                                }
                                $scope.savenfc.credential_id = null;
                                $rootScope.NFCCodeMessage = appConstants.empty;
                            }
                            else {
                                $rootScope.NFCCodeMessage = succResponse.msg;
                            }
                        });
                    }
                });
            }
        };

        //End Of NFC Code Edit
        $scope.getAccessCodeList = function () {
            userSvc.getAccessCodeList(appConstants.credentiallist + '?user_id=' + parseInt($cookies.get("newUserId")) + '&type=access_code', appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.access_code_list = succResponse.data;
                }
                else {
                    if (!succResponse.error) {
                        $scope.access_code_list = [];
                    }
                }
            });
        };
        //$scope.getAccessCodeList();


        //Edit Access Code Schedule
        $scope.accessEditSchedule = function (data, form) {
          if (!form.validate()) {
          return false;
          }
          data.block = "";
          $scope.schedule.forEach(function (v) {
            if (v.schedule_type == 'ONETIME') {
              v.frequency = "one-time";
            }
            else {
              v.frequency = "repeat";
            }
            if (v.status == "Disabled") {
              v.type = "disable";
            }
            else {
              v.type = "enable";
            }
            delete v.status;
          });
          data.schedule_category = 0;
          // data.schedule_start_date = utilitySvc.convertDateToMilliecondTimeStamp(data.selected_schedule_start_date)/1000;
          // data.expiration = utilitySvc.convertDateToMilliecondTimeStamp(data.selected_schedule_expiration_date)/1000;
          var start_date = data.selected_schedule_start_date;
          var date = new Date(data.selected_schedule_start_date)
          data.schedule_start_date = (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear();
          var expiration_date = data.selected_schedule_expiration_date;
          var exp_date = new Date(data.selected_schedule_expiration_date)
          data.expiration = (exp_date.getMonth() + 1) + "-" + exp_date.getDate() + "-" + exp_date.getFullYear();


          var weekday = new Array(7);
          weekday[0] = "Sunday";
          weekday[1] = "Monday";
          weekday[2] = "Tuesday";
          weekday[3] = "Wednesday";
          weekday[4] = "Thursday";
          weekday[5] = "Friday";
          weekday[6] = "Saturday";
          var ind = new Array();
          var sched_json = $filter('orderBy')(JSON.parse(scheduler.toJSON()), 'start_date');
          sched_json.forEach(function (v) {
          if (v.start_date != "NaN/NaN/NaN NaN:NaN") {
            delete v.id;
            delete v.text;
            var split_date = v.start_date.split(" ");
            v.day = weekday[new Date(v.start_date).getDay()];
            v.starttime = split_date[1];
            v.endtime = v.end_date.split(" ")[1];
            if ($scope.schedule.schedule_type == 1) {
              v.date = split_date[0].replace("/", "-").replace("/", "-");
              data.schedule_category = 1;
            }
            delete v.start_date;
            delete v.end_date;
            ind.push(v);
          }
          });
          data.schedule = ind;
          data.schedule_type = "usergroup";



          delete data.schedule_sat; 
          delete data.schedule_sun;
          delete data.schedule_mon;
          delete data.schedule_tue;
          delete data.schedule_wed;
          delete data.schedule_thu;
          delete data.schedule_fri;
          scheduleSvc.submitEditSchedule(appConstants.scheduleEdit, appConstants.putMethod, {}, $scope.schedule, function (succResponse) {
          if (succResponse.status) {
            data.schedulestart_date = start_date;
            data.expiration = expiration_date;
            toaster.pop(appConstants.success, appConstants.submitSuccessfully);
            $location.path('/app/admin/schedule/schedule-groups');
          }
          });
        }
        //End Of Edit Access Code Schedule

        $scope.accesscode = {};
        $scope.accesscode.status = 1;
        $scope.saveAccessCode = function (accesscode, access_code) {
            if (!access_code.validate()) {
                return false;
            }
            if($scope.schedule.schedule_type == "REPEATING"){
              if($scope.schedule.date == undefined){
                toaster.pop('error', "Please Add Start Date In Schedule");
                return false;
              }
            }
            //Add scheduler
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
            var ind = new Array();
            $scope.accesscode_schedule = {};

            var sched_json = $filter('orderBy')(JSON.parse(scheduler.toJSON()), 'start_date');
            sched_json.forEach(function (v) {
                if (v.start_date != "NaN/NaN/NaN NaN:NaN") {
                    delete v.id;
                    delete v.text;
                    $scope.accesscode_schedule.schedule_category = 0;
                    var split_date = v.start_date.split(" ");
                    v.day = weekday[new Date(v.start_date).getDay()];
                    v.starttime = split_date[1];
                    v.endtime = v.end_date.split(" ")[1];
                    if ($scope.schedule.schedule_type == "ONETIME") {
                        v.date = split_date[0].replace("/", "-").replace("/", "-");
                        $scope.accesscode_schedule.schedule_category = 1;
                    }
                    delete v.start_date;
                    delete v.end_date;
                    ind.push(v);
                }

            });
            //End of add scheduler
            $scope.accesscode_schedule.schedule = ind;
            accesscode.user_id = parseInt($cookies.get("newUserId"));
            accesscode.credential_type = "access_code";
            accesscode.details = {};
            accesscode.details.access_code = accesscode.access_code;
            delete accesscode.access_code;
            if (accesscode.credential_id == null) {
                var meth = appConstants.postMethod;
                var url = appConstants.useraddcredentials;
            }
            else {
                accesscode.uc_id = accesscode.credential_id;
                delete accesscode.credential_id;
                var meth = appConstants.putMethod;
                var url = appConstants.usereditcredential;
            }
            if (scheduler.toJSON() == "[]") {
                if ($scope.assingned_usergroups == undefined) {
                    accesscode.schedule_type = 1;
                }
                else {
                    accesscode.schedule_type = 0;
                }
                userSvc.saveAccessCode(url, meth, {}, accesscode, function (succResponse) {
                    if (succResponse.status) {

                        $timeout(function () {
                            $scope.getAccessCodeList();
                        });
                        if (!accesscode.uc_id) {
                            toaster.pop(appConstants.success, appConstants.accesscodeaddedsuccessfully);
                        }
                        else {
                            toaster.pop(appConstants.success, appConstants.accesscodeupdatedsuccessfully);
                        }
                        $scope.accesscode.credential_id = null;
                    }
                    else {
                        $rootScope.accesscode_error = succResponse.msg;
                    }
                });

            }

            else {

                if ($scope.schedule.date != undefined) {
                    var start_date = new Date($scope.schedule.date);
                    $scope.accesscode_schedule.schedule_start_date = (start_date.getMonth() + 1) + "-" + start_date.getDate() + "-" + start_date.getFullYear();
                }
                $scope.accesscode_schedule.no_expirations = $scope.schedule.no_expirations;
                if ($scope.schedule.expiration != undefined) {
                    var exp_date = new Date($scope.schedule.expiration);
                    $scope.accesscode_schedule.expiration = (exp_date.getMonth() + 1) + "-" + exp_date.getDate() + "-" + exp_date.getFullYear();
                }
                $scope.accesscode_schedule.schedule_type = "credential";
                userSvc.submitSchedule(appConstants.scheduleadd, appConstants.postMethod, {}, $scope.accesscode_schedule, function (success) {
                    JSON.parse(scheduler.toJSON()).forEach(function (v) { scheduler.deleteEvent(v.id); });
                    if (success.status) {
                        accesscode.schedule_id = success.data;
                        accesscode.schedule_type = 2;
                        userSvc.saveAccessCode(url, meth, {}, accesscode, function (succResponse) {
                            if (succResponse.status) {

                                $timeout(function () {
                                    $scope.getAccessCodeList();
                                });
                                if (!accesscode.uc_id) {
                                    toaster.pop(appConstants.success, appConstants.accesscodeaddedsuccessfully);
                                }
                                else {
                                    toaster.pop(appConstants.success, appConstants.accesscodeupdatedsuccessfully);
                                }
                                $scope.accesscode.credential_id = null;
                            }
                            else {
                                $rootScope.accesscode_error = succResponse.msg;
                            }
                        });
                    }
                });
            }



        };

        $rootScope.usergroup = {};
        $rootScope.usergroup.usergrouparr = [];

        $rootScope.assignUserGroup = function (user_group) {
            var arr = [];
            $.each(user_group.usergrouparr, function (index, value) {
                if (value == true) {
                    arr.push(index);
                }
            });
            userSvc.assignUserGroup(appConstants.userassignusergrouop, appConstants.postMethod, {}, { user_id: parseInt($cookies.get("newUserId")), user_group_id: arr, facility_id: user_group.facility_id }, function (succResponse) {
                if (succResponse.status) {
                    $scope.usergroupmsg = succResponse.msg;
                    $("md-tab-item[aria-controls^=tab-content]:contains('Credentials')").css("pointer-events", "visible").css("opacity", "1");
                    $timeout(function () {
                        $scope.doorList();
                    });
                    $timeout(function () {
                        $scope.getAccessCodeList();
                    });
                    $timeout(function () {
                        $(".closeg").click();
                    });
                }
                else {
                    $rootScope.usergroupmsg = succResponse.msg;
                }
                $timeout(function () {
                    $scope.assignedGroup();
                    user_group.usergrouparr = [];
                }, 500);
                $timeout(function () {
                    $scope.unassignedGroup(user_group.facility_id);
                }, 500);
            });
        };


        $rootScope.unassignUserToUsergroup = function (user_group_id, facility_id) {
            userSvc.unassignUserToUsergroup(appConstants.removeusergroup, appConstants.postMethod, {}, { user_id: parseInt($cookies.get("newUserId")), user_group_id: user_group_id }, function (succResponse) {
                if (succResponse.status) {
                    $scope.unassignedUserGroup = appConstants._successUserGroupRemoved;
                }
                $timeout(function () {
                    $scope.assignedGroup();
                }, 500);
                $timeout(function () {
                    $scope.unassignedGroup(facility_id);
                }, 500);

            });
        };

        $scope.assignedGroup = function () {
            userSvc.assignedGroup(appConstants.usergroupassignedtouser, appConstants.postMethod, {}, { user_id: parseInt($cookies.get("newUserId")) }, function (succResponse) {
                if (succResponse.status) {
                  $scope.assingned_usergroups = {};
                    if (succResponse.data) {
                        $scope.assingned_usergroups = succResponse.data;
                        $scope.groupcount = succResponse.data.length ? succResponse.data.length : 0;
                    }
                }
            });
        };

        $scope.unassignedGroup = function (facility_id) {
            userSvc.unassignedGroup(appConstants.usergroupnotassignedtouser, appConstants.postMethod, {}, { user_id: parseInt($cookies.get("newUserId")), facility_id: facility_id }, function (succResponse) {
                $rootScope.usergroups = {};
                if (succResponse.status) {
                    $rootScope.usergroup = {};
                    $rootScope.usergroup.facility_id = facility_id;
                    $rootScope.usergroups = succResponse.data;
                }
            });
        };

        $scope.editCredential = function (cred_data, credential_type) {
            switch (credential_type) {
                case 'access_code':
                    $scope.accesscode = {};
                    $scope.accesscode.access_code = cred_data.Access_Code;
                    $scope.accesscode.credential_id = cred_data.Credential_Id;
                    $scope.accesscode.status = cred_data.status;
                    var arr = [];
                    angular.forEach(cred_data.Door_Id.split(","), function (value, key) { arr[key] = parseInt(value); });
                    $scope.accesscode.door_id = arr;
                    break;
                case 'phone_code':
                    $scope.phoneCode = {};
                    $scope.phoneCode.credential_id = cred_data.Credential_Id;
                    $scope.phoneCode.phone_code = cred_data.Detail.phone_code;
                    $scope.phoneCode.phone_numbers = cred_data.Detail.phone_numbers[0];
                    $scope.phoneCode.status = cred_data.status;
                    var arr = [];
                    angular.forEach(cred_data.Door_Id.split(","), function (value, key) { arr[key] = parseInt(value); });
                    $scope.phoneCode.door_id = arr;
                    break;
                case 'rfid_code':
                    $scope.rfid = {};
                    $scope.rfid.credential_id = cred_data.Credential_Id;
                    $scope.rfid.rfid_card_no = cred_data.Detail.rfid_card_no;
                    $scope.rfid.rfid_facility_code = cred_data.Detail.rfid_facility_id;
                    $scope.rfid.status = cred_data.status;
                    var arr = [];
                    angular.forEach(cred_data.Door_Id.split(","), function (value, key) { arr[key] = parseInt(value); });
                    $scope.rfid.door_id = arr;
                    break;
                case 'wiegand_code':
                    $scope.wiegand = {};
                    $scope.wiegand.credential_id = cred_data.Credential_Id;
                    $scope.wiegand.wiegand_card_number = cred_data.Detail.wiegand_card_number;
                    $scope.wiegand.wiegand_facility_code = cred_data.Detail.wiegand_facility_code;
                    $scope.wiegand.status = cred_data.status;
                    var arr = [];
                    angular.forEach(cred_data.Door_Id.split(","), function (value, key) { arr[key] = parseInt(value); });
                    $scope.wiegand.door_id = arr;
                    break;
                case 'nfc_code':
                    $scope.savenfc = {};
                    $scope.savenfc.credential_id = cred_data.Credential_Id;
                    $scope.savenfc.nfc_code = cred_data.Detail.nfc_code;
                    $scope.savenfc.nfc_facility_code = cred_data.Detail.nfc_facility_code;
                    $scope.savenfc.status = cred_data.status;
                    var arr = [];
                    angular.forEach(cred_data.Door_Id.split(","), function (value, key) { arr[key] = parseInt(value); });
                    $scope.savenfc.door_id = arr;
                    break;
                case 'ble_code':
                    $scope.ble_code = {};
                    $scope.ble_code.credential_id = cred_data.Credential_Id;
                    $scope.ble_code.ble_name = cred_data.Detail.ble_username;
                    $scope.ble_code.ble_pass = cred_data.Detail.ble_password;
                    $scope.ble_code.status = cred_data.status;
                    var arr = [];
                    angular.forEach(cred_data.Door_Id.split(","), function (value, key) { arr[key] = parseInt(value); });
                    $scope.ble_code.door_id = arr;
                    break;
                default:

            }
        };

        $scope.removeCredential = function (id, type) {
            userSvc.removeCredential(appConstants.userdeletecredential + '?credential_id=' + id + '&type=' + type, appConstants.deleteMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    switch (type) {
                        case 'access_code':
                            $scope.getAccessCodeList();
                            break;
                        case 'phone_code':
                            $scope.getPhoneList();
                            break;
                        case 'rfid_code':
                            $scope.getRfidList();
                            break;
                        case 'wiegand_code':
                            $scope.getWiegandList();
                            break;
                        case 'nfc_code':
                            $scope.getNfcCodeList();
                            break;
                        case 'ble_code':
                            $scope.getBleList();
                            break;
                        default:
                            break;
                    }
                }
            });
        };

        /*$scope.dashboardInit = function () {
            userSvc.dashboardInit(appConstants.userDashboard, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.dashboardData = succResponse.data;
                }
            });
        };

        if (!$rootScope.hasOwnProperty('dashboardData')) { $scope.dashboardInit(); }*/
    });










'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:UserProfileCtrl
 * @description
 * # UserProfileCtrl
 * Controller of the minovateApp
 */
app
    .controller('UserProfileCtrl', function ($scope, $http, $cookies, $stateParams, baseURL, $rootScope, $location, toaster, $timeout, $mdDialog, $filter, appConstants, userSvc, utilitySvc) {
        $scope.page = {
            title: $location.path().indexOf('view-user') >= 0 ? appConstants._titleviewUser : appConstants._titleEditUser,
            subtitle: appConstants.empty
        };
        $scope.editUser = {};
        $("#mask02").datepicker();
        $rootScope.schedule = {};

        $scope.alldoorList = function () {
            userSvc.alldoorList(appConstants.doorlist, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.door_lists = succResponse.data.data;
                }
            });
        };
        $scope.timeddl = appConstants.timedropdown;

        $scope.cleanAccordionFormObject = function (UI, objectType) {
            switch (UI) {
                case appConstants._titleEditUser:
                    switch (objectType) {
                        case 'editAccess':
                            $scope.editAccess = {};
                            break;
                        case 'phoneedit':
                            $scope.phoneedit = {};
                            break;
                        case 'editRfid':
                            $scope.editRfid = {};
                            break;
                        case 'editNfc':
                            $scope.editNfc = {};
                            break;
                        case 'Wiegand_code':
                            $scope.wiegand = {};
                            break;
                        case 'editBle':
                            $scope.editBle = {};
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
        };

        $scope.dashboardInit = function () {
            userSvc.dashboardInit(appConstants.userDashboard, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.dashboardData = succResponse.data ? succResponse.data : [];
                }
            });
        };
        if (!$rootScope.hasOwnProperty('dashboardData')) { $scope.dashboardInit(); }

        //Initialize Facility
        $scope.facilityInit = function () {
            userSvc.facilityInit(appConstants.facilitylist, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.facilityList = succResponse.data.data;
                } else {
                    $rootScope.facilityList = {};
                }
            });
        };
        $scope.facilityInit();
        //End Of Initialize Facility
        $scope.editAccess = {};
        $scope.editAccess.status = 1;
        $scope.phoneedit = {};
        $scope.phoneedit.status = 1;
        $scope.editRfid = {};
        $scope.editRfid.status = 1;
        $scope.wiegand = {};
        $scope.wiegand.status = 1;
        $scope.editNfc = {};
        $scope.editNfc.status = 1;
        $scope.editBle = {};
        $scope.editBle.status = 1;
        $scope.profileInit = function () {
            //userSvc.profileInit(appConstants.userviewuserdetails + '?user_id=' + $stateParams.user_id, appConstants.getMethod, {}, {}, function (succResponse) {
            userSvc.profileInit(appConstants.userviewuserdetails + '?user_id=' + $stateParams.user_id, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {

                    $scope.userData = succResponse.data;
                    $scope.editUser.user_id = $stateParams.user_id;
                    $scope.editUser.user_zipcode = angular.copy($scope.userData.user_zipcode);
                    $scope.editUser.user_zipcode = angular.copy($scope.userData.user_zipcode);
                    $scope.editUser.first_name = angular.copy($scope.userData.user_first_name);
                    $scope.editUser.last_name = angular.copy($scope.userData.user_last_name);
                    $scope.editUser.address = angular.copy($scope.userData.user_address);
                    $scope.editUser.email = angular.copy($scope.userData.user_email);
                    if ($scope.userData.user_expiration_date != 0) {
                        var date = angular.copy(new Date($scope.userData.user_expiration_date * 1000));
                        $scope.editUser.expirationdate = (date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCFullYear());
                    }
                    $scope.editUser.status = angular.copy($scope.userData.user_status);
                    $scope.editUser.user_name_on_lcd = angular.copy($scope.userData.user_name_on_lcd);
                    // $scope.editAccess.access_code = angular.copy($scope.userData.access_code);
                    $scope.editUser.access_code_status = angular.copy($scope.userData.access_status);
                    // $scope.editUser.phone_code = angular.copy($scope.userData.phone_code);
                    $scope.editUser.phone_code_status = angular.copy($scope.userData.phone_status);
                    $scope.editUser.nfc_code = angular.copy($scope.userData.nfc_code);
                    $scope.editUser.rfid_card_no = angular.copy($scope.userData.rfid_card_number);

                    $rootScope.todos = [];
                    var todos = $rootScope.todos;

                    $rootScope.todos.push({
                        text: $scope.userData.phone_number_1,
                        completed: false
                    });
                    $scope.editUser.phone_numbers = angular.copy($scope.userData.phone_number_1);
                    $scope.editUser.rfid_facility_code = angular.copy($scope.userData.rfid_facility_code);
                    $scope.editUser.rfid_status = angular.copy($scope.userData.rfid_sttaus);
                    $scope.editUser.ble_name = angular.copy($scope.userData.ble_name);
                    $scope.editUser.ble_status = angular.copy($scope.userData.ble_status);
                    $scope.editUser.ble_pass = angular.copy($scope.userData.ble_pass);
                    $scope.editUser.description = angular.copy($scope.userData.user_description);
                    $scope.editUser.user_phone_no = angular.copy($scope.userData.user_phone_no);
                    $scope.editUser.user_status = angular.copy($scope.userData.user_status);
                    if ($scope.userData.access_status == undefined) {
                        $scope.editAccess.access_code_status = 1;
                    }
                    else {
                        $scope.editAccess.access_code_status = angular.copy($scope.userData.access_status);
                    }
                    if ($scope.userData.rfid_status == undefined) {
                        $scope.editUser.rfid_status = 1;
                    }
                    else {
                        $scope.editUser.rfid_status = angular.copy($scope.userData.rfid_status);
                    }
                    if ($scope.userData.ble_status == undefined) {
                        $scope.editUser.ble_status = 1;
                    }
                    else {
                        $scope.editUser.ble_status = angular.copy($scope.userData.ble_status);
                    }
                    if ($scope.userData.nfc_code_status == undefined) {
                        $scope.editUser.nfc_code_status = 1;
                    }
                    else {
                        $scope.editUser.nfc_code_status = angular.copy($scope.userData.nfc_code_status);
                    }
                    $scope.userData.user_status = ($scope.userData.user_status == 1 ? appConstants.active : ($scope.userData.user_status == 0 ? appConstants.inactive : appConstants.na));
                    $scope.userData.ble_status = ($scope.userData.ble_status == 1 ? appConstants.active : ($scope.userData.ble_status == 0 ? appConstants.inactive : appConstants.na));
                    $scope.userData.rfid_sttaus = ($scope.userData.rfid_sttaus == 1 ? appConstants.active : ($scope.userData.rfid_sttaus == 0 ? appConstants.inactive : appConstants.na));
                    $scope.userData.phone_status = ($scope.userData.phone_status == 1 ? appConstants.active : ($scope.userData.phone_status == 0 ? appConstants.inactive : appConstants.na));
                    $scope.userData.access_status = ($scope.userData.access_code_status == 1 ? appConstants.active : ($scope.userData.access_code_status == 0 ? appConstants.inactive : appConstants.na));
                    $scope.userData.nfc_code_status = ($scope.userData.nfc_code_status == 1 ? appConstants.active : ($scope.userData.nfc_code_status == 0 ? appConstants.inactive : appConstants.na));
                    $scope.editassignedGroup();
                }
            });
        };

        $scope.profileInit();

        $rootScope.repetive_schedular = function () {
            angular.forEach($(".dhx_scale_bar"), function (value, key) {
                value.innerHTML = value.innerHTML.split(",")[0];
            });
            $(".dhx_cal_prev_button").hide();
            $(".dhx_cal_next_button").hide();
            $(".dhx_cal_today_button").hide();


        }

        $rootScope.custom_schedular = function () {
            $(".dhx_scale_bar")[0].innerHTML = $(".dhx_scale_bar:eq(0)").attr("aria-label");
            $(".dhx_scale_bar")[1].innerHTML = $(".dhx_scale_bar:eq(1)").attr("aria-label");
            $(".dhx_scale_bar")[2].innerHTML = $(".dhx_scale_bar:eq(2)").attr("aria-label");
            $(".dhx_scale_bar")[3].innerHTML = $(".dhx_scale_bar:eq(3)").attr("aria-label");
            $(".dhx_scale_bar")[4].innerHTML = $(".dhx_scale_bar:eq(4)").attr("aria-label");
            $(".dhx_scale_bar")[5].innerHTML = $(".dhx_scale_bar:eq(5)").attr("aria-label");
            $(".dhx_scale_bar")[6].innerHTML = $(".dhx_scale_bar:eq(6)").attr("aria-label");
            $(".dhx_cal_prev_button").show();
            $(".dhx_cal_next_button").show();
            $(".dhx_cal_today_button").show();

        }

        //Credentials schedule edit
        $rootScope.check_submit = function(schedule_id, schedule){
        if(schedule_id == undefined){
          $mdDialog.cancel();
        }
        else{
          //Schedule edit 
          if(schedule.date != undefined){
            
            if(isNaN(schedule.date)){  
              var spli_date = schedule.date.split("/");
               schedule.schedule_start_date = spli_date[1]+"-"+spli_date[0]+"-"+spli_date[2];
            }
            else{
              
               schedule.schedule_start_date = (schedule.date.getMonth() + 1) + "-" + schedule.date.getDate() + "-" + schedule.date.getFullYear();
            }
          }
         
          var set_exp = schedule.expiration;
          var exp_date = new Date(schedule.expiration);
          schedule.expiration = (exp_date.getMonth() + 1) + "-" + exp_date.getDate() + "-" + exp_date.getFullYear();


          var weekday = new Array(7);
          weekday[0] = "Sunday";
          weekday[1] = "Monday";
          weekday[2] = "Tuesday";
          weekday[3] = "Wednesday";
          weekday[4] = "Thursday";
          weekday[5] = "Friday";
          weekday[6] = "Saturday";
          var ind = new Array();
          var sched_json = $filter('orderBy')(JSON.parse(scheduler.toJSON()), 'start_date');
          sched_json.forEach(function (v) {
          if (v.start_date != "NaN/NaN/NaN NaN:NaN") {
            delete v.id;
            delete v.text;
            var split_date = v.start_date.split(" ");
            v.day = weekday[new Date(v.start_date).getDay()];
            v.starttime = split_date[1];
            v.endtime = v.end_date.split(" ")[1];
            if ($scope.schedule.schedule_type == "ONETIME") {
              v.date = split_date[0].replace("/", "-").replace("/", "-");
              schedule.schedule_category = 1;
              delete schedule.schedule_start_date;
              delete schedule.schedule_end_date;
              delete schedule.expiration;
            }
            delete v.start_date;
            delete v.end_date;
            ind.push(v);
          }
          });
          schedule.schedule = ind;
          schedule.schedule_category = (schedule.schedule_type == "ONETIME" ? 1 : 0);
          var sch_type = schedule.schedule_type;
          schedule.schedule_type = "credential";



          delete schedule.schedule_sat; 
          delete schedule.schedule_sun;
          delete schedule.schedule_mon;
          delete schedule.schedule_tue;
          delete schedule.schedule_wed;
          delete schedule.schedule_thu;
          delete schedule.schedule_fri;
          schedule.schedule_exception_array = [];
          if(schedule.expiration == "NaN-NaN-NaN")
            delete schedule.expiration;

          if(schedule.schedule_end_date == "NaN-NaN-NaN")
            delete schedule.schedule_end_date;

          userSvc.submitEditSchedule(appConstants.scheduleEdit, appConstants.putMethod, {}, schedule, function (succResponse) {
          if (succResponse.status) {
            $scope.schedule = {}
            // schedule.expiration =  set_exp;
            // schedule.schedule_type = sch_type;

             $timeout(function () {
              $(".close_add").click();
            });
          }
          else{
            schedule.schedule_type = sch_type;
          }
          });
          //End Schedule Edit


        }
       }
        //End of credentials schedule edit

        //Edit credentials on edit page
        $scope.editCredential = function (cred_data, credential_type) {
            switch (credential_type) {
                case 'access_code':
                    $(".access_div").hide();
                    $scope.editAccess = {};
                    $scope.editAccess.accesscode_size = cred_data.Access_Code.length;
                    $scope.editAccess.access_code = cred_data.Access_Code;
                    $scope.editAccess.credential_id = cred_data.Credential_Id;
                    $scope.editAccess.status = cred_data.status;
                    var arr = [];
                    angular.forEach(cred_data.Door_Id.split(","), function (value, key) {
                        arr[key] = parseInt(value);
                    });
                    $scope.editAccess.door_id = arr;
                    break;
                case 'phone_code':
                    $(".phone_div").hide();
                    $scope.phoneedit = {};
                    $scope.phoneedit.phonecode_size = cred_data.Detail.phone_code.length;
                    $scope.phoneedit.credential_id = cred_data.Credential_Id;
                    $scope.phoneedit.phone_code = cred_data.Detail.phone_code;
                    $scope.phoneedit.phone_numbers1 = cred_data.Detail.phone_numbers[0].phone_number;
                    $scope.phoneedit.starttime1 = cred_data.Detail.phone_numbers[0].starttime;
                    $scope.phoneedit.endtime1 = cred_data.Detail.phone_numbers[0].endtime;
                    $scope.phoneedit.type1 = cred_data.Detail.phone_numbers[0].type;

                    $scope.phoneedit.phone_numbers2 = cred_data.Detail.phone_numbers[1].phone_number;
                    $scope.phoneedit.starttime2 = cred_data.Detail.phone_numbers[1].starttime;
                    $scope.phoneedit.endtime2 = cred_data.Detail.phone_numbers[1].endtime;
                    $scope.phoneedit.type2 = cred_data.Detail.phone_numbers[1].type;

                    $scope.phoneedit.phone_numbers3 = cred_data.Detail.phone_numbers[2].phone_number;
                    $scope.phoneedit.starttime3 = cred_data.Detail.phone_numbers[2].starttime;
                    $scope.phoneedit.endtime3 = cred_data.Detail.phone_numbers[2].endtime;
                    $scope.phoneedit.type3 = cred_data.Detail.phone_numbers[2].type;

                    $scope.phoneedit.status = cred_data.status;
                    var arr = [];
                    angular.forEach(cred_data.Door_Id.split(","), function (value, key) {
                        arr[key] = parseInt(value);
                    });
                    $scope.phoneedit.door_id = arr;
                    break;
                case 'rfid_code':
                    $(".rfid_div").hide();
                    $scope.editRfid = {};
                    $scope.editRfid.credential_id = cred_data.Credential_Id;
                    $scope.editRfid.rfid_card_no = cred_data.Detail.rfid_card_no;
                    $scope.editRfid.rfid_facility_code = cred_data.Detail.rfid_facility_id;
                    $scope.editRfid.status = cred_data.status;
                    var arr = [];
                    angular.forEach(cred_data.Door_Id.split(","), function (value, key) { arr[key] = parseInt(value); });
                    $scope.editRfid.door_id = arr;
                    break;
                case 'wiegand_code':
                    $(".wiegand_div").hide();
                    $scope.wiegand = {};
                    $scope.wiegand.credential_id = cred_data.Credential_Id;
                    $scope.wiegand.wiegand_card_number = cred_data.Detail.wiegand_card_number;
                    $scope.wiegand.wiegand_facility_code = cred_data.Detail.wiegand_facility_code;
                    $scope.wiegand.status = cred_data.status;
                    var arr = [];
                    angular.forEach(cred_data.Door_Id.split(","), function (value, key) { arr[key] = parseInt(value); });
                    $scope.wiegand.door_id = arr;
                    break;
                case 'nfc_code':
                    $(".nfc_div").hide();
                    $scope.editNfc = {};
                    $scope.editNfc.credential_id = cred_data.Credential_Id;
                    $scope.editNfc.nfc_code = cred_data.Detail.nfc_code;
                    $scope.editNfc.nfc_facility_code = cred_data.Detail.nfc_facility_code;
                    $scope.editNfc.status = cred_data.status;
                    var arr = [];
                    angular.forEach(cred_data.Door_Id.split(","), function (value, key) { arr[key] = parseInt(value); });
                    $scope.editNfc.door_id = arr;
                    break;
                case 'ble_code':
                    $(".ble_div").hide();
                    $scope.editBle = {};
                    $scope.editBle.schedule = {};
                    $scope.editBle.credential_id = cred_data.Credential_Id;
                    $scope.editBle.ble_name = cred_data.Detail.ble_username;
                    $scope.editBle.ble_pass = cred_data.Detail.ble_password;
                    $scope.editBle.status = cred_data.status;
                    var arr = [];
                    angular.forEach(cred_data.Door_Id.split(","), function (value, key) { arr[key] = parseInt(value); });
                    $scope.editBle.door_id = arr;
                    break;
                default:
            }
        };
        //End of credentials edit 

        $scope.editdoorList = function () {
            userSvc.editdoorList(appConstants.userlistdoorcredential + parseInt($stateParams.user_id), appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.door_lists = succResponse.data;
                }
            });
        };
        $scope.editdoorList();

        $rootScope.usergroup = {};
        $rootScope.usergroup.usergrouparr = [];

        $rootScope.assignEditUserGroup = function (user_group) {
            console.log(user_group);
            var arr = [];
            $.each(user_group.usergrouparr, function (index, value) {
                if (value == true) {
                    arr.push(index);
                }
            });
            userSvc.assignEditUserGroup(appConstants.userassignusergrouop, appConstants.postMethod, {}, { user_id: parseInt($stateParams.user_id), user_group_id: arr, facility_id: user_group.facility_id }, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.usergroupmsg = succResponse.msg;
                    $rootScope.userNotAssignedGroup(user_group.facility_id);
                    toaster.pop(appConstants.success, succResponse.msg.replace(/_/g, " "));
                }
                else {
                    $rootScope.usergroupmsg = succResponse.msg;
                }
                $timeout(function () {
                    $scope.editassignedGroup();
                    user_group.usergrouparr = [];
                });
                $timeout(function () {
                    $scope.editdoorList();
                });
                $timeout(function () { $(".usergroup_edit").click(); });
            });
        };

        $scope.editassignedGroup = function () {
            userSvc.editassignedGroup(appConstants.usergroupassignedtouser, appConstants.postMethod, {}, { user_id: parseInt($stateParams.user_id) }, function (succResponse) {
                $scope.nogroup = false;
                if (succResponse.status) {
                    if (succResponse.data == null || succResponse.data == "") {
                        // $("md-tab-item[aria-controls^=tab-content]:contains('Credentials')").css("pointer-events", "none").css("opacity", "0.5");
                        $scope.nogroup = appConstants.nousergroupassigned;
                        $scope.userGroup = appConstants.empty;
                        $scope.alldoorList();                        
                    }
                    else {
                        $("md-tab-item[aria-controls^=tab-content]:contains('Credentials')").css("pointer-events", "visible").css("opacity", "1");
                        $scope.userGroup = succResponse.data;
                        $scope.groupcount = succResponse.data.length;
                    }
                }
            });
        };

        $scope.editassignedGroup();
        $rootScope.userNotAssignedGroup = function (facility_id) {
            if (facility_id == undefined) {
                $("#add_group_facility").addClass("disable-button");
            }
            else {
                $("#add_group_facility").removeClass("disable-button");
            }
            userSvc.userNotAssignedGroup(appConstants.usergroupnotassignedtouser, appConstants.postMethod, {}, { user_id: parseInt($stateParams.user_id), facility_id: facility_id }, function (succResponse) {
                $rootScope.usergroups = [];
                if (succResponse.status) {
                    $rootScope.usergroups = succResponse.data;
                    $rootScope.usergroup.facility_id = facility_id;
                }
            });
        };
        $rootScope.userNotAssignedGroup();
        //$rootScope.assignUserGroup();

        $scope.deleteGroup = function (id) {
            if (!confirm(appConstants.confirmationusergroupdeletemessage)) { return false; }
            userSvc.deleteGroup(appConstants.usergroupdelete + '?usergroup_id=' + id, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {

                }
            });
        };

        $scope.formatDate = function (date) {
            var d = new Date(date),
                month = appConstants.empty + (d.getMonth() + 1),
                day = appConstants.empty + d.getDate(),
                year = d.getFullYear();
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            return [day, month, year].join('/');
        };

        $scope.HandleProfilePicAddUpdateClick = function () {
            var fileinput = document.getElementById("profilePicAddUpdate");
            fileinput.click();
        };

        $scope.uploadProfilePic = function (file, user_id) {
            var fd = new FormData();
            fd.append('user_id', user_id);
            fd.append('file', file);
            userSvc.uploadProfilePic(appConstants.userpicupload, appConstants.postMethod, {}, fd, function (succResponse) {
                if (succResponse.status) {
                    //toaster.pop(appConstants.success,appConstants._successImageUpload);
                }
                $scope.profileInit();
            });

            //......... Working code for Profile Pic upload.................................................................

            // $http.post(baseURL+'user/pic-upload',fd,
            // {
            //  transformRequest: angular.identity,
            //  headers: {
            //      "Authorization": $cookies.get("token"),
            //      "Content-type": undefined
            //  }}
            //     ).success(function (resp) {
            //         if(resp.msg == 'Invalid_Token'){
            //             toaster.pop('error','Session Expired');
            //             $cookies.remove("token");
            //             $location.path('/core/login');return false;
            //         }
            //         else if(resp.status==true){
            //             toaster.pop('Success','Profile pic updated successfully');
            //         }
            //     })
            // .error(function (error) {})

            //..............................................................................................................
        };

        var n = [];
        $scope.submitEditUser = function (submitData, user_edit) {
            if (!user_edit.validate()) {
                return false;
            }
            // if(submitData.password!=submitData.cnf_pass){
            //  toaster.pop('Warning!! ','Password and Confirm Password should be same');
            //  return;
            // }
            submitData.status = submitData.user_status;
            submitData.user_id = parseInt($stateParams.user_id);
            submitData.user_phone_no = submitData.user_phone_no;
            submitData.name_on_lcd = submitData.user_name_on_lcd;
            submitData.zipcode = parseInt(submitData.user_zipcode);
            submitData.facility_id = parseInt($cookies.get("facilityId"));
            // submitData.expiration_date = submitData.expiration_date;
            var ex_date = '';
            if (submitData.no_expirations == 1 || submitData.status == 0) {
                submitData.expirationdate = '';
            }
            else {
                ex_date = submitData.expirationdate;
                if (isNaN(submitData.expirationdate)) {
                    var d = submitData.expirationdate.split("/");
                    var date = new Date(d[2] + "/" + d[1] + "/" + d[0]);
                }
                else {
                    var date = submitData.expirationdate;
                }
                submitData.expiration_date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
                delete submitData["expirationdate"];
            }
            $rootScope.masters = [];
            userSvc.submitEditUser(appConstants.useredit, appConstants.putMethod, {}, submitData, function (succResponse) {
                submitData.expirationdate = ex_date;
                $scope.editUserMessage = appConstants.empty;
                if (succResponse.status) {
                    if ($scope.myFile) {
                        var file = $scope.myFile;
                        $scope.uploadProfilePic(file, $stateParams.user_id);
                    }
                    //$scope.profileInit();
                    toaster.pop(appConstants.success, appConstants.submitSuccessfully);
                    $location.path('/app/admin/user/users');
                }
                else {
                    if (succResponse.error && succResponse.error.length > 0) {
                        $rootScope.masters[0] = succResponse.error[0];
                    }
                    else {
                        $scope.editUserMessage = succResponse.msg;
                    }
                }
            });
        };

        $scope.generateAccessCode = function () {
            // $scope.editUser.access_code = Date.now();
            // $scope.accesscode = {};
            var x = Math.floor(Math.random() * 9999999999) + 10000;
            $scope.editAccess.access_code = parseInt((appConstants.empty + x).substring($scope.editAccess.accesscode_size, length));
        };

        $scope.generatePhoneCode = function () {
            var x = Math.floor(Math.random() * 9999999999) + 10000;
            $scope.phoneedit.phone_code = (appConstants.empty + x).substring($scope.phoneedit.phonecode_size, length);
        };

        $scope.submitEditAccessCode = function (submitData, access_edit_form) {
            if (!access_edit_form.validate()) {
                return false;
            }
            if($scope.schedule.schedule_type == "REPEATING"){
              if($scope.schedule.date == undefined){
                toaster.pop('error', "Please Add Start Date In Schedule");
                return false;
              }
            }
            //Add scheduler
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
            var ind = new Array();
            $scope.edit_access_schedule = {};

            var sched_json = $filter('orderBy')(JSON.parse(scheduler.toJSON()), 'start_date');
            sched_json.forEach(function (v) {
                if (v.start_date != "NaN/NaN/NaN NaN:NaN") {
                    delete v.id;
                    delete v.text;
                    $scope.edit_access_schedule.schedule_category = 0;
                    var split_date = v.start_date.split(" ");
                    v.day = weekday[new Date(v.start_date).getDay()];
                    v.starttime = split_date[1];
                    v.endtime = v.end_date.split(" ")[1];
                    if ($scope.schedule.schedule_type == "ONETIME") {
                        v.date = split_date[0].replace("/", "-").replace("/", "-");
                        $scope.edit_access_schedule.schedule_category = 1;
                    }
                    delete v.start_date;
                    delete v.end_date;
                    ind.push(v);
                }

            });
            //End of add scheduler
            $scope.edit_access_schedule.schedule = ind;

            submitData.user_id = parseInt($stateParams.user_id);
            submitData.credential_type = "access_code";
            submitData.details = {};
            submitData.details.access_code = JSON.stringify(parseInt(submitData.access_code));
            delete submitData.access_code;
            if (submitData.credential_id == null) {
                var meth = appConstants.postMethod;
                var url = appConstants.useraddcredentials;
            }
            else {
                submitData.uc_id = submitData.credential_id;
                var meth = appConstants.putMethod;
                var url = appConstants.usereditcredential;
            }
            
            if($scope.edit_access_schedule.schedule.length == 0){
              if ($scope.usergroups == undefined) {
                    submitData.schedule_type = 1;
                }
                else {
                    submitData.schedule_type = 0;
                }
              userSvc.submitEditAccessCode(url, meth, {}, submitData, function (succResponse) {
                  $scope.editAccess.credential_id = null;
                  if (succResponse.status) {
                      toaster.pop(appConstants.success, appConstants.submitSuccessfully);
                      $scope.getAccessCodeList();
                  }
                  else {
                      $scope.AccessCodeMessage = succResponse.msg;
                  }
              });
            }
            else{
              if ($scope.schedule.date != undefined) {
                    var start_date = new Date($scope.schedule.date);
                    $scope.edit_access_schedule.schedule_start_date = (start_date.getMonth() + 1) + "-" + start_date.getDate() + "-" + start_date.getFullYear();
                }
                $scope.edit_access_schedule.no_expirations = $scope.schedule.no_expirations;
                if ($scope.schedule.expiration != undefined) {
                    var exp_date = new Date($scope.schedule.expiration);
                    $scope.edit_access_schedule.expiration = (exp_date.getMonth() + 1) + "-" + exp_date.getDate() + "-" + exp_date.getFullYear();
                }
                $scope.edit_access_schedule.schedule_type = "credential";
                userSvc.submitSchedule(appConstants.scheduleadd, appConstants.postMethod, {}, $scope.edit_access_schedule, function (success) {
                    JSON.parse(scheduler.toJSON()).forEach(function (v) { scheduler.deleteEvent(v.id); });
                    if (success.status) {
                      submitData.schedule_type = 2;
                      submitData.schedule_id = success.data;
                      userSvc.submitEditAccessCode(url, meth, {}, submitData, function (succResponse) {
                        $scope.editAccess.credential_id = null;
                        if (succResponse.status) {
                          toaster.pop(appConstants.success, appConstants.submitSuccessfully);
                          $scope.getAccessCodeList();
                        }
                        else {
                          $scope.getAccessCodeList();
                          $scope.AccessCodeMessage = succResponse.msg;
                        }
                      });
                    } 
                });
            }
        };


        $scope.getAccessCodeList = function () {
            userSvc.getAccessCodeList(appConstants.credentiallist + '?user_id=' + parseInt($stateParams.user_id) + '&type=access_code', appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.access_code_list = succResponse.data;
                }
                else {
                    if (!succResponse.error) {
                        $scope.access_code_list = [];
                    }
                }
            });
        };
        // $scope.getAccessCodeList();
        $scope.getCredentials = function(){
            $scope.getAccessCodeList();
            $scope.getNfcCodeList();
            $scope.getPhoneList();
            $scope.getBleList();
            $scope.getWiegandList();
            $scope.getRfidList();
        }
        //NFC code edit
        $scope.submitEditNfcCode = function (submitData, nfc_edit_form) {
            if (!nfc_edit_form.validate()) {
                return false;
            }
            // submitData.user_id = parseInt($stateParams.user_id);
            // submitData.nfc_code = parseInt(submitData.nfc_code);
            // submitData.nfc_facility_code = parseInt($cookies.get("facilityId"));
            submitData.user_id = parseInt($stateParams.user_id);
            submitData.credential_type = "nfc_code";
            submitData.details = {};
            submitData.details.nfc_code = submitData.nfc_code;
            submitData.details.nfc_facility_code = parseInt(submitData.nfc_facility_code);
            // submitData.details.nfc_facility_id = JSON.stringify(parseInt($cookies.get("facilityId")));

            delete submitData.nfc_code;
            delete submitData.nfc_facility_code;

            if (submitData.credential_id == null) {
                var meth = appConstants.postMethod;
                var url = appConstants.useraddcredentials;
            }
            else {
                submitData.uc_id = submitData.credential_id;
                var meth = appConstants.putMethod;
                var url = appConstants.usereditcredential;
            }
            userSvc.submitEditNfcCode(url, meth, {}, submitData, function (succResponse) {
                $scope.editNfc.credential_id = null;
                if (succResponse.status) {
                    $scope.getNfcCodeList();
                    toaster.pop(appConstants.success, appConstants.submitSuccessfully);
                    $scope.NfcCodeMessage = appConstants.empty;
                }
                else {
                    $rootScope.NfcCodeMessage = succResponse.msg;
                }
            });
        };

        $scope.getNfcCodeList = function () {
            userSvc.getNfcCodeList(appConstants.credentiallist + '?user_id=' + parseInt($stateParams.user_id) + '&type=nfc_code', appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.nfc_code_list = succResponse.data;
                }
                else {
                    if (!succResponse.error) {
                        $scope.nfc_code_list = [];
                    }
                }
            });
        };
        //$scope.getNfcCodeList();

        //End Of NFC Code Edit
        $scope.getPhoneList = function () {
            userSvc.getPhoneList(appConstants.credentiallist + '?user_id=' + parseInt($stateParams.user_id) + '&type=phone_code', appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.phone_code_list = succResponse.data;
                }
                else {
                    if (!succResponse.error) {
                        $scope.phone_code_list = [];
                    }
                }
            });
        };
        ///$scope.getPhoneList();

        $scope.submitEditPhoneCode = function (submitData, phone_edit_form) {

            if (!phone_edit_form.validate()) {
                return false;
            }
            if($scope.schedule.schedule_type == "REPEATING"){
              if($scope.schedule.date == undefined){
                toaster.pop('error', "Please Add Start Date In Schedule");
                return false;
              }
            }
            //Add scheduler
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
            var ind = new Array();
            $scope.edit_phone_schedule = {};

            var sched_json = $filter('orderBy')(JSON.parse(scheduler.toJSON()), 'start_date');
            sched_json.forEach(function (v) {
                if (v.start_date != "NaN/NaN/NaN NaN:NaN") {
                    delete v.id;
                    delete v.text;
                    $scope.edit_phone_schedule.schedule_category = 0;
                    var split_date = v.start_date.split(" ");
                    v.day = weekday[new Date(v.start_date).getDay()];
                    v.starttime = split_date[1];
                    v.endtime = v.end_date.split(" ")[1];
                    if ($scope.schedule.schedule_type == "ONETIME") {
                        v.date = split_date[0].replace("/", "-").replace("/", "-");
                        $scope.edit_phone_schedule.schedule_category = 1;
                    }
                    delete v.start_date;
                    delete v.end_date;
                    ind.push(v);
                }

            });
            //End of add scheduler
            $scope.edit_phone_schedule.schedule = ind;
            submitData.user_id = parseInt($stateParams.user_id);
            submitData.credential_type = "phone_code";
            submitData.details = {};
            submitData.details.phone_code = submitData.phone_code;
            submitData.details.phone_numbers = [];
console.log(submitData);
            submitData.details.phone_numbers[0] = {phone_number:submitData.phone_numbers1,starttime:submitData.starttime1,endtime:submitData.endtime1,type:submitData.type1};
            submitData.details.phone_numbers[1] = {phone_number:submitData.phone_numbers2,starttime:submitData.starttime2,endtime:submitData.endtime2,type:submitData.type2};
            submitData.details.phone_numbers[2] = {phone_number:submitData.phone_numbers3,starttime:submitData.starttime3,endtime:submitData.endtime3,type:submitData.type3};

            delete submitData.phone_code;
            delete submitData.phone_numbers;

            if (submitData.credential_id == null) {
                var meth = appConstants.postMethod;
                var url = appConstants.useraddcredentials;
            }
            else {
                submitData.uc_id = submitData.credential_id;
                var meth = appConstants.putMethod;
                var url = appConstants.usereditcredential;
            }

            if($scope.edit_phone_schedule.schedule.length == 0){
              if ($scope.usergroups == undefined) {
                    submitData.schedule_type = 1;
                }
                else {
                    submitData.schedule_type = 0;
                }
            userSvc.submitEditPhoneCode(url, meth, {}, submitData, function (succResponse) {
                $scope.phoneedit.credential_id = null;
                if (succResponse.status) {
                    toaster.pop(appConstants.success, appConstants.submitSuccessfully);
                    $scope.getPhoneList();
                }
                else {
                    $scope.PhoneCodeMessage = succResponse.msg;
                }
            });
          }
          else{
            if ($scope.schedule.date != undefined) {
                    var start_date = new Date($scope.schedule.date);
                    $scope.edit_phone_schedule.schedule_start_date = (start_date.getMonth() + 1) + "-" + start_date.getDate() + "-" + start_date.getFullYear();
                }
                $scope.edit_phone_schedule.no_expirations = $scope.schedule.no_expirations;
                if ($scope.schedule.expiration != undefined) {
                    var exp_date = new Date($scope.schedule.expiration);
                    $scope.edit_phone_schedule.expiration = (exp_date.getMonth() + 1) + "-" + exp_date.getDate() + "-" + exp_date.getFullYear();
                }
                $scope.edit_phone_schedule.schedule_type = "credential";
                userSvc.submitSchedule(appConstants.scheduleadd, appConstants.postMethod, {}, $scope.edit_phone_schedule, function (success) {
                    JSON.parse(scheduler.toJSON()).forEach(function (v) { scheduler.deleteEvent(v.id); });
                    if(success.status) {
                        submitData.schedule_type = 2;
                        submitData.schedule_id = success.data;
                        userSvc.submitEditPhoneCode(url, meth, {}, submitData, function (succResponse) {
                          $scope.phoneedit.credential_id = null;
                          if (succResponse.status) {
                          toaster.pop(appConstants.success, appConstants.submitSuccessfully);
                          $scope.getPhoneList();
                          }
                          else {
                          $scope.PhoneCodeMessage = succResponse.msg;
                          }
                        });
                    }
                  });
          }
        };

        $scope.getRfidList = function () {
            userSvc.getRfidList(appConstants.credentiallist + '?user_id=' + parseInt($stateParams.user_id) + '&type=rfid_code', appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.rfid_code_list = succResponse.data;
                }
                else {
                    if (!succResponse.error) {
                        $scope.rfid_code_list = [];
                    }
                }
            });
        };
        // $scope.getRfidList();

        $scope.getWiegandList = function () {
            userSvc.getWiegandList(appConstants.credentiallist + '?user_id=' + parseInt($stateParams.user_id) + '&type=wiegand_code', appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.wiegand_code_list = succResponse.data;
                }
                else {
                    if (!succResponse.error) {
                        $scope.wiegand_code_list = [];
                    }
                }
            });
        };

        // $scope.getWiegandList();
        $scope.submitEditRFIDCode = function (submitData, rfid_form) {
            if (!rfid_form.validate()) {
                return false;
            }
            submitData.user_id = parseInt($stateParams.user_id);
            submitData.credential_type = "rfid_code";
            submitData.details = {};
            // submitData.details.rfid_facility_id = JSON.stringify(parseInt(submitData.rfid_facility_code));
            submitData.details.rfid_card_no = JSON.stringify(parseInt(submitData.rfid_card_no));
            submitData.details.rfid_facility_id = JSON.stringify(parseInt(submitData.rfid_facility_code));
            delete submitData.rfid_card_no;
            delete submitData.rfid_facility_code;

            if (submitData.credential_id == null) {
                var meth = appConstants.postMethod;
                var url = appConstants.useraddcredentials;
            }
            else {
                submitData.uc_id = submitData.credential_id;
                var meth = appConstants.putMethod;
                var url = appConstants.usereditcredential;
            }
            userSvc.submitEditRFIDCode(url, meth, {}, submitData, function (succResponse) {
                $scope.editRfid.credential_id = null;
                if (succResponse.status) {
                    toaster.pop(appConstants.success, appConstants.submitSuccessfully);
                    $scope.getRfidList();
                }
                else {
                    $scope.EditRFIDCodeMsg = succResponse.msg;
                }
            });
        };


        $scope.submitEditWIEGANDCode = function (submitData, rfid_form) {
            // if(!wiegand_form.validate()){
            //  return false;
            // }
            if($scope.schedule.schedule_type == "REPEATING"){
              if($scope.schedule.date == undefined){
                toaster.pop('error', "Please Add Start Date In Schedule");
                return false;
              }
            }
            //Add scheduler
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
            var ind = new Array();
            $scope.edit_wiegand_schedule = {};

            var sched_json = $filter('orderBy')(JSON.parse(scheduler.toJSON()), 'start_date');
            sched_json.forEach(function (v) {
                if (v.start_date != "NaN/NaN/NaN NaN:NaN") {
                    delete v.id;
                    delete v.text;
                    $scope.edit_wiegand_schedule.schedule_category = 0;
                    var split_date = v.start_date.split(" ");
                    v.day = weekday[new Date(v.start_date).getDay()];
                    v.starttime = split_date[1];
                    v.endtime = v.end_date.split(" ")[1];
                    if ($scope.schedule.schedule_type == "ONETIME") {
                        v.date = split_date[0].replace("/", "-").replace("/", "-");
                        $scope.edit_wiegand_schedule.schedule_category = 1;
                    }
                    delete v.start_date;
                    delete v.end_date;
                    ind.push(v);
                }

            });
            //End of add scheduler
            $scope.edit_wiegand_schedule.schedule = ind;
            $scope.wiegand = {};
            submitData.user_id = parseInt($stateParams.user_id);
            submitData.credential_type = "wiegand_code";
            submitData.details = {};
            // submitData.details.wiegand_facility_id = JSON.stringify(parseInt(submitData.wiegand_facility_code));
            submitData.details.wiegand_card_number = submitData.wiegand_card_number;
            submitData.details.wiegand_facility_code = submitData.wiegand_facility_code;
            submitData.door_id = submitData.door_id;
            submitData.status = submitData.status;

            if (submitData.credential_id == null) {
                var meth = appConstants.postMethod;
                var url = appConstants.useraddcredentials;
            }
            else {
                submitData.uc_id = submitData.credential_id;
                var meth = appConstants.putMethod;
                var url = appConstants.usereditcredential;
            }

           if($scope.edit_wiegand_schedule.schedule.length == 0){
            if ($scope.usergroups == undefined) {
                  submitData.schedule_type = 1;
              }
              else {
                  submitData.schedule_type = 0;
              }
            userSvc.submitEditWiegandCode(url, meth, {}, submitData, function (succResponse) {
                $scope.wiegand.credential_id = null;
                if (succResponse.status) {
                    toaster.pop(appConstants.success, appConstants.submitSuccessfully);
                    $scope.getWiegandList();
                }
            });
          }
          else{

            if ($scope.schedule.date != undefined) {
                    var start_date = new Date($scope.schedule.date);
                    $scope.edit_wiegand_schedule.schedule_start_date = (start_date.getMonth() + 1) + "-" + start_date.getDate() + "-" + start_date.getFullYear();
                }
                $scope.edit_wiegand_schedule.no_expirations = $scope.schedule.no_expirations;
                if ($scope.schedule.expiration != undefined) {
                    var exp_date = new Date($scope.schedule.expiration);
                    $scope.edit_wiegand_schedule.expiration = (exp_date.getMonth() + 1) + "-" + exp_date.getDate() + "-" + exp_date.getFullYear();
                }
                $scope.edit_wiegand_schedule.schedule_type = "credential";
                userSvc.submitSchedule(appConstants.scheduleadd, appConstants.postMethod, {}, $scope.edit_wiegand_schedule, function (success) {
                    JSON.parse(scheduler.toJSON()).forEach(function (v) { scheduler.deleteEvent(v.id); });
                    if(success.status) {
                        submitData.schedule_type = 2;
                        submitData.schedule_id = success.data;
                        userSvc.submitEditWiegandCode(url, meth, {}, submitData, function (succResponse) {
                          $scope.wiegand.credential_id = null;
                          if (succResponse.status) {
                            toaster.pop(appConstants.success, appConstants.submitSuccessfully);
                            $scope.getWiegandList();
                          }
                        });
                      }
                    });


          }
        };

        $scope.getBleList = function () {
            userSvc.getBleList(appConstants.credentiallist + '?user_id=' + parseInt($stateParams.user_id) + '&type=ble_code', appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.ble_code_list = succResponse.data;
                }
                else {
                    if (!succResponse.error) {
                        $scope.ble_code_list = [];
                    }
                }
            });
        };
        // $scope.getBleList();

        $scope.submitEditBLECode = function (submitData, ble_edit_form) {
            if (!ble_edit_form.validate()) {
                return false;
            }
            if($scope.schedule.schedule_type == "REPEATING"){
              if($scope.schedule.date == undefined){
                toaster.pop('error', "Please Add Start Date In Schedule");
                return false;
              }
            }
            //Add scheduler
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
            var ind = new Array();
            $scope.edit_ble_schedule = {};

            var sched_json = $filter('orderBy')(JSON.parse(scheduler.toJSON()), 'start_date');
            sched_json.forEach(function (v) {
                if (v.start_date != "NaN/NaN/NaN NaN:NaN") {
                    delete v.id;
                    delete v.text;
                    $scope.edit_ble_schedule.schedule_category = 0;
                    var split_date = v.start_date.split(" ");
                    v.day = weekday[new Date(v.start_date).getDay()];
                    v.starttime = split_date[1];
                    v.endtime = v.end_date.split(" ")[1];
                    if ($scope.schedule.schedule_type == "ONETIME") {
                        v.date = split_date[0].replace("/", "-").replace("/", "-");
                        $scope.edit_ble_schedule.schedule_category = 1;
                    }
                    delete v.start_date;
                    delete v.end_date;
                    ind.push(v);
                }

            });
            //End of add scheduler
            $scope.edit_ble_schedule.schedule = ind;
            submitData.user_id = parseInt($stateParams.user_id);
            submitData.credential_type = "ble_code";
            submitData.details = {};
            submitData.details.ble_username = submitData.ble_name;
            submitData.details.ble_password = submitData.ble_pass;

            delete submitData.ble_name;
            delete submitData.ble_pass;

            if (submitData.credential_id == null) {
                var meth = appConstants.postMethod;
                var url = appConstants.useraddcredentials;
            }
            else {
                submitData.uc_id = submitData.credential_id;
                var meth = appConstants.putMethod;
                var url = appConstants.usereditcredential;
            }
           if($scope.edit_ble_schedule.schedule.length == 0){
            if ($scope.usergroups == undefined) {
                  submitData.schedule_type = 1;
              }
              else {
                  submitData.schedule_type = 0;
              }
            userSvc.submitEditBLECode(url, meth, {}, submitData, function (succResponse) {
                $scope.editBle.credential_id = null;
                if (succResponse.status) {
                    toaster.pop(appConstants.success, appConstants.submitSuccessfully);
                    $scope.getBleList();
                    // $scope.bleerror = appConstants.empty;
                }
                else {
                    // $scope.bleerror = succResponse.msg;
                }
            });
          }
          else{
            if ($scope.schedule.date != undefined) {
                    var start_date = new Date($scope.schedule.date);
                    $scope.edit_ble_schedule.schedule_start_date = (start_date.getMonth() + 1) + "-" + start_date.getDate() + "-" + start_date.getFullYear();
                }
                $scope.edit_ble_schedule.no_expirations = $scope.schedule.no_expirations;
                if ($scope.schedule.expiration != undefined) {
                    var exp_date = new Date($scope.schedule.expiration);
                    $scope.edit_ble_schedule.expiration = (exp_date.getMonth() + 1) + "-" + exp_date.getDate() + "-" + exp_date.getFullYear();
                }
                $scope.edit_ble_schedule.schedule_type = "credential";
                userSvc.submitSchedule(appConstants.scheduleadd, appConstants.postMethod, {}, $scope.edit_ble_schedule, function (success) {
                    JSON.parse(scheduler.toJSON()).forEach(function (v) { scheduler.deleteEvent(v.id); });
                    if(success.status) {
                        submitData.schedule_type = 2;
                        submitData.schedule_id = success.data;
                        userSvc.submitEditBLECode(url, meth, {}, submitData, function (succResponse) {
                        $scope.editBle.credential_id = null;
                        if (succResponse.status) {
                          toaster.pop(appConstants.success, appConstants.submitSuccessfully);
                          $scope.getBleList();
                          // $scope.bleerror = appConstants.empty;
                        }
                        else {
                          // $scope.bleerror = succResponse.msg;
                        }
                        });
                      }
                    });

          }
        };

        $scope.unassignUserGroupEdit = function (ev, user_group_id, facility_id) {
            $scope.showConfirm(ev, user_group_id, facility_id)
        };
        $scope.showConfirm = function (ev, user_group_id, facility_id) {
            var confirm = $mdDialog.confirm()
                .title('Would you like to remove User from User Group ?')
                .content('')
                .ok('Yes')
                .cancel('No')
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                userSvc.unassignUserGroupEdit(appConstants.removeusergroup, appConstants.postMethod, {}, { user_id: parseInt($stateParams.user_id), user_group_id: user_group_id }, function (succResponse) {
                    if (succResponse.status) {
                        toaster.pop(appConstants.success, appConstants._successUserGroupRemoved);
                    }
                    $timeout(function () {
                        $scope.editassignedGroup();
                    });
                    $timeout(function () { $rootScope.userNotAssignedGroup(facility_id); })
                });
            }, function () {
                toaster.pop('info', 'You decided to keep user in User Group.');
            });
        };

        //Delete user on detail page
        $scope.deleteUser = function (ev, id) {
            var confirm = $mdDialog.confirm()
                .title(appConstants._deleteuserconfirmationmessage)
                .content(appConstants.empty)
                .ok(appConstants.delete)
                .cancel(appConstants.cancel)
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                userSvc.deleteUser(appConstants.userdelete + '?user_id=' + id, appConstants.deleteMethod, {}, {}, function (succResponse) {
                    if (succResponse.status) {
                        $rootScope.dashboardData.user--;
                        $location.path('/app/admin/user/users');
                    }
                });
            }, function () {
                toaster.pop('info', appConstants._canceluserdeletionmessage);
            });
        };
        //Delete user on detail page

        //Remove user  credentials
        $scope.removeCredential = function (id, type) {
            userSvc.removeCredential(appConstants.userdeletecredential + '?credential_id=' + id + '&type=' + type, appConstants.deleteMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    toaster.pop(appConstants.success, succResponse.msg.replace(/_/g, ' '));
                    switch (type) {
                        case 'access_code':
                            $scope.getAccessCodeList();
                            break;
                        case 'phone_code':
                            $scope.getPhoneList();
                            break;
                        case 'rfid_code':
                            $scope.getRfidList();
                            break;
                        case 'wiegand_code':
                            $scope.getWiegandList();
                            break;
                        case 'nfc_code':
                            $scope.getNfcCodeList();
                            break;
                        case 'ble_code':
                            $scope.getBleList();
                            break;
                        default:
                            break;
                    }
                }
            });
        };
        //End remove user credentials
        $scope.onlyNumber = function (e) {
            console.log(e);
            if (e.charCode >= 48 && e.charCode <= 57) {
                //return true;
            } else {
                e.preventDefault();
            }
        };

        $("#mask02").datepicker();

        if ($stateParams.type == "edit") {
            $timeout(function () {
                $("a:contains('Edit Account')").click();
            });
        }
    });

'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:UserGroupsCtrl
 * @description
 * # UserGroupsCtrl
 * Controller of the minovateApp
 */
app
    .controller('UserGroupsCtrl', function ($scope, $mdDialog, $http, baseURL, $stateParams, $rootScope, $cookies, toaster, arrayPushService, $timeout, schedul, $uibModal, $log, $location, appConstants, userSvc, utilitySvc) {
        $scope.alphabateList = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        $scope.page = {
            title: appConstants._titleUserGroups,
            subtitle: appConstants.empty,
            member: appConstants._membersUserGroups
        };
        $rootScope.userGroup = {};
        $scope.items = ['item1', 'item2', 'item3'];
        $scope.addGroupOpen = function (size) {
            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
            $rootScope.user_group_error = appConstants.empty;
            $rootScope.user_group_success = appConstants.empty;
            $rootScope.usergroupedit = {};
            $rootScope.listDoorGroup = {};
            $timeout(function () {
                $("md-tab-item[aria-controls^=tab-content]:contains('Door Schedule')").css("pointer-events", "none").css("opacity", "0.5");
            });
        };

        $scope.currentSelectedGroupName = $stateParams.userGroupName;
        $scope.CurrentUserGroupUserCount = $stateParams.userGroupUserCount;

        $scope.dashboardInit = function () {
            userSvc.dashboardInit(appConstants.userDashboard, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.dashboardData = succResponse.data ? succResponse.data : [];
                }
            });
        };

        if (!$rootScope.hasOwnProperty('dashboardData')) { $scope.dashboardInit(); }

        $scope.layout = appConstants.gridLayout;
        $scope.class = appConstants.gridviewClass;
        $scope.changeClass = function () {
            if ($scope.class === appConstants.gridviewClass)
                $scope.class = appConstants.listviewClass;
            $scope.layout = appConstants.listLayout;
        };

        $scope.changeaClass = function () {
            if ($scope.class === appConstants.listviewClass)
                $scope.class = appConstants.gridviewClass;
            $scope.layout = appConstants.gridLayout;
        };

        $scope.result = appConstants.empty;
        $scope.showConfirm = function (ev, id) {
            var confirm = $mdDialog.confirm()
                .title(appConstants._deleteusergroupconfirmationmessage)
                .content(appConstants.empty)
                .ok(appConstants.delete)
                .cancel(appConstants.cancel)
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                $scope.userGroupDelete(id);
            }, function () {
                toaster.pop('info', appConstants._cancelusergroupdeleteioonmessage);
            });
        };

        $scope.facilityInit = function () {
            userSvc.facilityInit(appConstants.facilitylist, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.facilityList = succResponse.data.data;
                    if (utilitySvc.getCurrentFacility() != '') {
                        $rootScope.userGroup.facility_id = parseInt(utilitySvc.getCurrentFacility());
                        $rootScope.facility_disable = true;
                        //$rootScope.getDoorsList();
                    }
                }
                else {
                    $rootScope.facilityList = {};
                }
            });
        };
        $scope.facilityInit();

        $rootScope.saveUserGroup = function (usergroup, group_form) {
            if (!group_form.validate()) {
                return false;
            }
            //usergroup.facility_id = parseInt($cookies.get("facilityId"));
            $rootScope.user_group_error = appConstants.empty;
            userSvc.saveUserGroup(appConstants.usergroupadd, appConstants.postMethod, {}, usergroup, function (succResponse) {
                if (succResponse.status) {
                    $timeout(function () {
                        $rootScope.listDoorSchedule(succResponse.data.user_group_id, usergroup.facility_id);
                    }, 1);
                    $timeout(function () { $("md-tab-item[aria-controls^=tab-content]:contains('Group Name')").css("pointer-events", "none").css("opacity", "0.5") });
                    $timeout(function () { $("md-tab-item[aria-controls^=tab-content]:contains('Door Schedule')").click().css("pointer-events", "block").css("opacity", "1"); });
                    $timeout(function () {
                        $scope.pageNo = 1;
                        $scope.usergroups = [];
                        $scope.getUserGroupList();
                    });
                }
                else {
                    $rootScope.user_group_error = succResponse.msg;
                }
            });
        };

        $rootScope.addDoorScheduleUserGroup = function (doorObj, ud_id, is_access_allowed, userGroupBehaviour) {

            var schedule_id = doorObj.schedule_id;
            for (var key in doorObj.schedulelist) {
                if (doorObj.schedulelist[key].id == doorObj.tempSchedulerId) {
                    is_access_allowed = doorObj.schedulelist[key].is_access_allowed;
                    schedule_id = doorObj.tempSchedulerId;
                    // delete  doorObj.tempSchedulerId;
                    break;
                }
            }

            if (is_access_allowed == null) {
                return false;
            }
            $("#" + ud_id).css("display", appConstants.block);
            if (schedule_id != "No Access" && schedule_id != "Full Access") {
                is_access_allowed = 2;
            }
            userSvc.addDoorScheduleUserGroup(appConstants.usergroupeditdoorschedule, appConstants.putMethod, {}, { ud_id: ud_id, is_access_allowed: is_access_allowed, schedule_id: schedule_id, type: userGroupBehaviour }, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.user_group_success = succResponse.msg;
                }
                else {
                    $rootScope.user_group_success = succResponse.msg;
                }
                $timeout(function () {
                    $("#" + ud_id).css("display", appConstants.none);
                });
            });
        };

        $rootScope.listDoorSchedule = function (usergroup_id, facility_id) {
            userSvc.listDoorSchedule(appConstants.usergrouplistdoorschedule + '?usergroup_id=' + usergroup_id, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.listDoorGroup = [];
                    $scope.x = schedul.getScheduleByFacility(facility_id);
                    angular.forEach(succResponse.data, function (value, key) {
                        $rootScope.listDoorGroup[key] = value;
                        $rootScope.listDoorGroup[key].schedulelist = [];
                        $scope.x.success(function (resp) {
                            angular.forEach(resp.data, function (val, k) {
                                var obj = { name: val.schedule_name, id: val.schedule_id, is_access_allowed: val.is_access_allowed };
                                $rootScope.listDoorGroup[key].schedulelist.push(obj);
                            });
                            if ($rootScope.listDoorGroup[key].schedule_id)
                                $rootScope.listDoorGroup[key].tempSchedulerId = $rootScope.listDoorGroup[key].schedule_id.toString();
                        });
                    });
                }
            });
        };




        $scope.searchFunction = function (e) {
            if (e)
                if (e.keyCode != 13) { return false; }
            if (!$scope.searchText) {
                $scope.searchText = appConstants.empty;
            }
            $scope.pageNo = 1;
            $scope.usergroups = [];
            $scope.searchAlphabet = '';
            userSvc.searchFunction(appConstants.usergrouplist + '?limit=8&pageNo=' + $scope.pageNo + '&facility_id=' + utilitySvc.getCurrentFacility() + '&searchVal=' + $scope.searchText, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.usergroups = arrayPushService.arrayPush(succResponse.data.data, $scope.usergroups);
                    $scope.pageNo = $scope.pageNo + 1;
                }
                else {
                    if (succResponse.data == null) {
                        $(".f-wm:contains(Load more)").text(appConstants.nomoredataavailable).css("opacity", 0.7);
                    }
                }
            });
        };
        $scope.refreshList = function () {
            $scope.searchAlphabet = '';
            $scope.pageNo = 1;
            $(".f-wm:contains(" + appConstants.nomoredataavailable + ")").text('Load More').css("opacity", 1);
            $scope.getUserGroupList();
        }
        $scope.pageNo = 1;
        $scope.usergroups = [];
        $scope.searchText = appConstants.empty;
        $scope.searchAlphabet = '';
        $scope.searchByAlphabet = function (alphabet) {
            $scope.searchText = '';
            $(".f-wm:contains(" + appConstants.nomoredataavailable + ")").text('Load More').css("opacity", 1);
            $scope.pageNo = 1;
            if (alphabet == 'All') {
                $scope.searchAlphabet = '';
                $scope.getUserGroupList();
                return;
            }
            $scope.searchAlphabet = alphabet;
            $scope.getUserGroupList();

        }
        $scope.getUserGroupList = function () {
            userSvc.getUserGroupList(appConstants.usergrouplist + '?limit=8&pageNo=' + $scope.pageNo + '&facility_id=' + utilitySvc.getCurrentFacility() + '&searchVal=' + $scope.searchText + '&albhabet=' + $scope.searchAlphabet, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    if ($scope.pageNo <= 1)
                        $scope.usergroups = [];
                    angular.forEach(succResponse["data"]["data"], function (userGroup, index) {
                        $scope.usergroups.push(userGroup);
                    });
                    $scope.pageNo = $scope.pageNo + 1;
                    $scope.totalDisplayed = 8;
                    if (succResponse.data.count > 8) {
                        $scope.lmbtn = {
                            display: appConstants.block
                        };
                    } else {
                        $scope.lmbtn = {
                            display: appConstants.none
                        };
                    }
                }
                else {
                    if (succResponse.data == null) {
                        $(".f-wm:contains(Load more)").text(appConstants.nomoredataavailable).css("opacity", 0.7);
                    }
                    if (succResponse.msg == 'No_Records_Found') {
                        $scope.usergroups = [];
                    }
                }
            });
        };

        $scope.userGroupDelete = function (id) {
            userSvc.userGroupDelete(appConstants.usergroupdelete + '?usergroup_id=' + id, appConstants.deleteMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    toaster.pop('info', appConstants._successDeleteUserGroup);
                    var ug = $scope.usergroups;
                    var temp = [];
                    for (var i = 0; i < ug.length; i++) {
                        if (ug[i].usergroup_id != id)
                            temp.push(ug[i]);
                    }
                    $scope.usergroups = temp;
                }
            });
        };

        $scope.showEditForm = function (group_id, group_name, facility_id, facility_name, size) {
            $scope.items = ['item1', 'item2', 'item3'];
            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContent1.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

            $rootScope.usergroupedit = {};
            $rootScope.listDoorGroup = {};
            $rootScope.usergroupedit.usergroup_name = group_name;
            $rootScope.usergroupedit.usergroup_id = group_id;
            $rootScope.usergroupedit.facility_id = facility_id;
            $rootScope.usergroupedit.facility_name = facility_name;

        };


        $rootScope.editUserGroupp = function (usergroupedit) {
            // delete usergroupedit.facility_name;
            userSvc.editUserGroupp(appConstants.usergroupedit, appConstants.putMethod, {}, usergroupedit, function (succResponse) {
                if (succResponse.status) {
                    toaster.pop(appConstants.success, succResponse.msg.replace(/_/g, ' '));
                    $timeout(function () {
                        $rootScope.listDoorSchedule(usergroupedit.usergroup_id, usergroupedit.facility_id);
                    }, 1);
                    $timeout(function () { $("md-tab-item[aria-controls^=tab-content]:contains('Group Name')").css("pointer-events", "none").css("opacity", "0.5") });
                    $timeout(function () { $("md-tab-item[aria-controls^=tab-content]:contains('Door Schedule')").click() });
                    $timeout(function () {
                        $scope.pageNo = 1;
                        $scope.usergroups = [];
                        $scope.getUserGroupList();
                    });
                }
            });
        };

        $scope.orderByMe = function (x) {
            $scope.myOrderBy = x;
        };

        $scope.imagePath = baseURL + appConstants.imagePath;

    });

'use strict';
/**
 * @ngdoc function
 * @name minovateApp.controller:SettingCtrl
 * @description
 * # SettingCtrl
 * Controller of the minovateApp
 */
app
    .controller('UserGroupsDetailCtrl', function ($scope, $mdDialog, $http, $rootScope, $cookies, arrayPushService, $location, toaster, baseURL, $timeout, $stateParams, appConstants, userSvc, utilitySvc) {

        $scope.page = {
            title: appConstants._titleUserGroups,
            subtitle: appConstants.empty,
            member: appConstants._membersUserGroups
        };

        $scope.usergroup_id = $stateParams.usergroup_id;

        $scope.currentSelectedGroupName = $stateParams.userGroupName;
        $scope.CurrentUserGroupUserCount = $stateParams.userGroupUserCount;


        $scope.dashboardInit = function () {
            userSvc.dashboardInit(appConstants.userDashboard, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $rootScope.dashboardData = succResponse.data ? succResponse.data : [];
                }
            });
        };

        if (!$rootScope.hasOwnProperty('dashboardData')) {
            $scope.dashboardInit();
        };

        $scope.usergroupDetail = function () {
            userSvc.usergroupDetail(appConstants.listuserbyusergroup + '?usergroup_id=' + $stateParams.usergroup_id, appConstants.getMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    $scope.usergroupslist = succResponse.data;
                }
            });
        };

        $scope.usergroupDetail();

        //User Group Delete
        $scope.showConfirm = function (ev, id) {
            var confirm = $mdDialog.confirm()
                .title(appConstants._deleteusergroupconfirmationmessage)
                .content(appConstants.empty)
                .ok(appConstants.delete)
                .cancel(appConstants.cancel)
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                $scope.userGroupDetailDelete(id);
            }, function () {
                toaster.pop('info', appConstants._cancelusergroupdeleteioonmessage);
            });
        };

        $scope.userGroupDetailDelete = function (id) {
            userSvc.userGroupDetailDelete(appConstants.usergroupdelete + '?usergroup_id=' + id, appConstants.deleteMethod, {}, {}, function (succResponse) {
                if (succResponse.status) {
                    toaster.pop('info', appConstants._successDeleteUserGroup);
                    $location.path('/app/admin/user/user-groups');
                }
            });
        };
        //End Of User Group Delete

        $scope.unassignUserGroupDetail = function (ev, user_id) {
            $scope.showConfirm(ev, user_id)
        }
        $scope.showConfirm = function (ev, user_id) {
            var confirm = $mdDialog.confirm()
                .title('Would you like to remove User from User Group ?')
                .content('')
                .ok('Yes')
                .cancel('No')
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                userSvc.unassignUserGroupDetail(appConstants.removeusergroup, appConstants.postMethod, {}, { user_id: user_id, user_group_id: parseInt($stateParams.usergroup_id) }, function (succResponse) {
                    if (succResponse.status) {
                        toaster.pop(appConstants.success, appConstants._successUserRemoved);
                        $timeout(function () {
                            $scope.editassignedGroup();
                        });
                        $timeout(function () {
                            $rootScope.userNotAssignedGroup(facility_id);
                        })
                        $location.path('/app/admin/user/user-groups');
                    }
                });
            }, function () {
                toaster.pop('info', 'You decided to keep user in User Group.');
            });
        };
    });
