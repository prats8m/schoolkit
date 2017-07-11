app.controller('wizardCtrl', function (WizardHandler, $scope, $mdDialog, $state, $cookies, $rootScope, $location, toaster, baseURL, appConstants, userSvc, utilitySvc, $uibModal) {
    $scope.checkIfValid = function () {
        if (!$cookies.get("isWizardUsed")) {
            $state.go('app.admin.dashboard')
        }
    }
    $scope.checkIfValid();
    $scope.wizard_setup = {
        facility: {
            facility_name: '',
            facility_location: '',
            timezone: '',
            status: 1,
            zip_code: ''
        },
        door: [],
        device: {
            device_name: '',
            serial_no: '',
            registration_code: '',
            sip_username: '',
            sip_password: ''
        },
        technician: {
            first_name: '',
            last_name: '',
            email: '',
            address: '',
            zipcode: '',
            phone_number: '',
            status: 1,
            expiration_date: ''
        }
    };
    $scope.doorlist = {
        name: '',
        door_description: '',
        status: 1
    }
    $scope.usTimeZonesForFacility = appConstants.availableTimeZoneOptions;
    $scope.validateDeviceForm = function (form) {
        if (!form)
            return false;
        if (form.$valid) {
            WizardHandler.wizard().next();
        }
        $scope.validDevice = true;
        return false;
    }
    $scope.doorname = "";
    $scope.door_description = "";
    $scope.validateDoorForm = function (form) {
        $scope.error = false;
        if (!form)
            return false;
        if (form.$valid) {
            angular.forEach($scope.wizard_setup.door, function (door, index) {
                if (door.name.toLowerCase() == document.getElementById("door_name").value.toLowerCase()) {
                    $scope.errMsg = "Please Enter a different Name"
                    $scope.errormsg = true;
                    return false;
                    // break;
                }
                else {
                    $scope.errMsg = "Please Enter a different Name"
                    $scope.errormsg = false;
                }
            })
            if ($scope.errormsg) {
                return false;
            }
            var doors = {
                name: document.getElementById("door_name").value,
                door_description: document.getElementById("door_description").value,
                status: 1
            }
            $scope.wizard_setup.door.push(doors);
            form.door_name = null;
            form.door_description = null;
            form.$valid = false
            document.getElementById("door_name").value = '';
            document.getElementById("door_description").value = '';
            return true;
        }
        $scope.validDoor = true;
        return false;
    }
    $scope.validateFacilityForm = function (form) {
        if (!form)
            return false;
        if (form.$valid) {
            WizardHandler.wizard().next();
        }
        $scope.validFacility = true;
        return false;
    }
    $scope.validateTechnicianForm = function (form) {
        if (!form)
            return false;
        if (form.$valid) {
            WizardHandler.wizard().next();
        }
        $scope.validTechnician = true;
        return false;
    }
    $scope.deleteDoor = function (index) {
        $scope.wizard_setup.door.splice(index, 1);
    }
    $scope.navigateNextForm = function () {
        if ($scope.wizard_setup.door.length > 0) {
            WizardHandler.wizard().next();
        }
        else
            $scope.error = true;
    }
    $scope.submitWizard = function () {
        userSvc.addStartingWizard(appConstants.wizardadd, appConstants.postMethod, {}, $scope.wizard_setup, function (succResponse) {
            if (succResponse.status) {
                toaster.pop(appConstants.success, appConstants.successFullAdd);
                $cookies.remove("isWizardUsed");
                $state.go('app.admin.dashboard')
            }
            else {
                toaster.pop(appConstants.error, succResponse.msg.replace(/_/g, ' '));
            }
        });
    }
})