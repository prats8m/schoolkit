app.constant("appConstants", {

    //........API URLs...........................................................

    loginweb: 'login-web',
    userDashboard: 'user/dashboard',
    facilityAdd: 'facility/add',
    facilitylist: 'facility/list',
    facilityview: 'facility/view/',
    devicelistmaster: 'device/list-master-device',
    deviceadd: 'device/add',
    facilityedit: 'facility/edit',
    listeventtype: 'event/list-event-type',
    listevent: 'event/list-event',
    adminadd: 'admin/add',
    adminlist: 'admin/list',
    cameralist: 'camera/list',
    cameragrouplist: 'cameragroup/list',
    deletecameragroup: 'cameragroup/delete',
    s3list: 's3/list',
    cameragroupadd: 'cameragroup/add',
    devicedelete: 'device/delete',
    doorlistnotassigntodevice: 'door/list-door-not-assigned-to-device',
    doorlist: 'door/list',
    technicianlist: 'technician/list',
    devicemodellist: 'device/models-list',
    deviceview: 'device/view',
    listslaveofmasterdevice: 'device/list-slave-of-master-device',
    userdetailsbydevice: 'device/user-details-by-device',
    deviceedit: 'device/edit',
    devicelistslave: 'device/list-slave-device',
    deviceaddsettings: 'device/add-settings',
    devicegetsettings: 'device/get-settings',
    doorlistfordeviceid: 'door/list-door-for-deviceid',
    getdevicerelay: 'device/get-device-relay',
    getWiegandDevice: 'device/get-wiegand-device',
    doorassigndevice: 'door/assign-device',
    doorgroupadd: 'doorgroup/add',
    doorgrouplist: 'doorgroup/list',
    doorgroupedit: 'doorgroup/edit',
    doorgroupdelete: 'doorgroup/delete',
    doorgroupview:'doorgroup/view',
    doordelete: 'door/delete/',
    dooradd: 'door/add',
    doorview: 'door/view',
    dooredit: 'door/edit',
    scheduleadd: 'schedule/add',
    scheduleDelete: 'schedule/delete',
    scheduleList: 'schedule/list',
    scheduleEdit: 'schedule/edit',
    listSecretQuestions: 'list-secret-ques',
    forgetPassword: 'user/forget-password',
    userpicupload: 'user/pic-upload',
    useradd: 'user/add',
    useredit: 'user/edit',
    manageaccount: 'manage-account',
    listuserbyusergroup: 'usergroup/list-user-by-usergroup',
    usergroupdelete: 'usergroup/delete',
    removeusergroup: 'user/remove-usergroup',
    usergroupadd: 'usergroup/add',
    usergroupeditdoorschedule: 'usergroup/edit-door-schedule',
    usergrouplistdoorschedule: 'usergroup/list-door-schedule',
    usergrouplist: 'usergroup/list',
    usergroupedit: 'usergroup/edit',
    listsecretquestions: 'list-secret-ques',
    updatesecretquestions: 'update-secret-ques',
    userviewuserdetails: 'user/view-user-details',
    userlistdoorcredential: 'user/list-door-credential/',
    userassignusergrouop: 'user/assign-usergroup',
    usergroupassignedtouser: 'user/usergroup-assigned-to-user',
    usergroupnotassignedtouser: 'user/usergroup-not-assigned-to-user',
    useraddcredentials: 'user/add-credential',
    usereditcredential: 'user/edit-credential',
    credentiallist: 'credential/list',
    userdelete: 'user/delete',
    userdeletecredential: 'user/delete-credential',
    userlist: 'user/list',
    facilitydelete: 'facility/delete',
    userchangepassword: 'user/change-password',
    holidayscheduleadd: 'holiday-schedule/add',
    holidayschedulelist: 'holiday-schedule/list',
    holidayscheduleedit: 'holiday-schedule/edit',
    holidayscheduleview: 'holiday-schedule/view',
    holidayscheduledelete: 'holiday-schedule/delete',
    schedulelistschedule: 'schedule/list-schedule',
    scheduleView: 'schedule/view',
    credentialscheduleView: 'schedule-credential/view',
    shortcutslist: 'shortcut/list',
    shortcutadd: 'shortcut/add',
    roleadd: 'role/add',
    rolelist: 'role/list',
    adminadd: 'admin/add',
    addtechnician: 'technician/add',
    viewtechnician: 'technician/view',
    deletetechnician: 'technician/delete',
    geteventmediaurl: 'event/get-event-media-url',
    edittechnician: 'technician/edit',
    addmasteradmin: 'warehouse/add-master-admin',
    getCameraDoorList: 'list-door-of-camera',
    openDoorCommand:'open-door?door_id=',
    historylist:'history/list',

    //...........................................................................

    //........Constants............................................................

    pageLimit:20,

    //...........................................................................

    //........Methods............................................................
    getMethod: 'GET',
    postMethod: 'POST',
    putMethod: 'PUT',
    deleteMethod: 'DELETE',
    //...........................................................................


    //..............Generics.....................................................
    oops: "Oops !! ",
    error: "error",
    success: "success",
    info: 'info',
    warning: 'warning',
    none: "none",
    block: 'block',
    inlineblock: 'inline-block',
    empty: '',
    questionMark: '?',
    null: null,
    gridLayout: 'grid',
    listLayout: 'list',
    gridviewClass: 'gridview',
    listviewClass: 'listview',
    imagePath: 'elika/images/',
    content: '',
    active: 'Active',
    inactive: 'Inactive',
    na: 'NA',
    reset: 'Reset',
    search: 'Search',
    submitSuccessfully: 'Submit Successfully',
    somethingwrong: 'Something went wrong',
    invaliddata: 'InValid Data',
    apiNotFound: 'API not found',
    responsenotfound: 'response not found',
    timeout: 'Timeout',

    //...........................................................................

    //....................HTTP Consts..........................................
    facilitycookieID: 'facility',
    sessionTokenCookieID: 'token',
    contentType: 'application/json',
    dataType: 'JSON',
    sessionExp: 'Session Expired',

    //............................................................................

    //.....Modals................................................................

    cancel: 'Cancel',
    delete: 'Delete',
    ok: 'OK',
    yes: 'Yes',
    no: 'No',
    dangerstatusClass: 'alert alert-danger alert-dismissable',
    successstatusClass: 'alert alert-success alert-dismissable',
    disabled: 'disabled',



    //...........................................................................

    //.............Login.........................................................

    invalidcredentials: 'Please enter correct email id and password.',

    //...........................................................................


    //.........Home/Dashboard....................................................
    dashboardTitle: 'Dashboard',
    dashboardSubTitle: 'So much more to see at a glance.',
    dashboard_facility_name: "Dashboard",
    dashboard_facility_quote: "Welcome to elika",
    allfacilities : 'All Facilities',

    //...........................................................................

    //.........Facilities..........................................................
    facilityTitle: 'Facility',
    facilitySubTitle: '',
    facilityDetailsTitle: 'Facility Details',
    facilityedittitle: 'Facility Edit',
    facilityDetailsSubTitle: '',
    _successfacilityAdd: 'Facility added successfully.',
    _deleteFacilityConfirm: 'Would you like to delete Facility ?',
    _successDeleteFacility: 'Your Facility has been deleted successfully.',
    _cancelFacilityDelete: 'You decided to keep Facility.',
    _editFacilitySuccess: 'Facility Edited Successfully',
    _switchtootherfacility: 'Switch to other facility before deleting this facility.',
    //...........................................................................

    //.................Devices....................................................

    deviceTitle: 'Devices',
    primaryDevice: 'Primary',
    _deletePrimaryDevice: 'Would you like to delete device ?',
    _successdeleteDevice: 'Your device has been deleted successfully',
    _canceldevicedelete: 'You decided to keep device.',
    nomorerecords: 'No More Records',
    deviceviewUITitle: 'Device Details',
    dependentDevice: 'Dependent Device',
    deletedeviceconfirmationmessage: 'Are you sure you want to delete this device ?',
    deletedependentdeviceconfirmation: 'Would you like to delete dependent device ?',
    _successdeletedependentDevice: 'Your dependent device has been deleted successfully',
    _canceldependentdevicedelete: 'You decided to keep dependent device',
    editDeviceUiTitle: 'Edit Device',
    settings: 'Settings',

    //............................................................................


    //..............Devices Settings..............................................

    deviceSettings: {
        commonGetAPIData: { type: 'gen', typeadv: 'adv' },
        accessgrantkey: 'access-grant-key',
        lockoutmode: 'lockout-mode',
        videorecordingaccess: 'video-recording-access',
        picturesnapshotsaccess: 'picture-snapshot-access',
        camerasetup: 'camera-setup',
        snapshotsstatus: 'snapshot-status',
        recordingstatus: 'recording-status',
        talktimesetup: 'talk-time-setup',
        talktime: 'talk-time',
        realtimeclock: 'real-time-clock',
        starttime: 'start-time',
        endtime: 'end-time',
        ledsetup: 'led-setup',
        keypadsetup: 'keypad-setup',
        keypadbrightness: 'keypad-brightness',
        courtesylightsetup: 'courtesy-light-setup',
        courtesybrightness: 'courtesy-brightness',
        speakermicrophonesetup: 'speaker-microphone-setup',
        speakerbeeper: 'speaker-beeper',
        microphonebeeper: 'microphone-beeper',
        speakervolume: 'speaker-volume',
        microphonesensitivity: 'microphone-sensitivity',
        lockout: 'lockout',
        maxtries: 'max-tries',
        lockoutperiod: 'lockout-period',
        mastercode: 'master-code',
        clocksettings: 'clock-settings',
        timezone: 'time-zone',
        latchcode: 'latch-code',
        accessgates: 'access-gates',
        diagnostics: 'diagnostics',
        description: 'description',
        callbuttonsetup: 'call-button-setup',
        callbutton: 'call-button',
        wiegandSetting: 'wiegand-device-setting',
        welcomesetting: 'welcome-setting',
        welcomemessagekey: 'welcome-message-key',
        callsetting: 'call-setting',
        voipcallsettingkey: 'voip-call-setting-key'
    },


    _successaccessgrantkeychangesmessage: 'Access Granted key changed successfully',
    _successCameraConfigured: 'Camera Configured successfully',
    _successTaltimeConfigured: 'Talk Time Configured successfully',
    _successledConfigured: 'LED Configured successfully',
    _successrelayanddoorsetupconfigured: 'Relay & Door Setup configured successfully',
    _successspeakerandmicrophoneconfigured: 'Speaker and Microphone configured successfully',
    _successlockoutmodeconfigured: 'Lockout Mode Configured successfully',
    _successmastercodeconfigured: 'Master Code Configured successfully',
    _successclockconfigured: 'Clock Configured successfully',
    _successlatchcodeconfigured: 'Latch Code Configured successfully',
    _successdiagnosticsconfigured: 'Diagnostics Configured successfully',
    _successcallbuttonconfigured: 'Call Button Setup Configured successfully',
    //............................................................................


    //.................Activities....................................................

    activitiesTitle: 'Activity',

    //............................................................................

    //.................Admin....................................................

    admintitle: 'Admin',
    _messagedeleteadmin: 'Would you like to delete admin?',

    //............................................................................


    //..................Doors....................................................

    doorsgroupUiTitle: 'Door Groups',
    doorsdeleteconfirmationmessage: 'Would you like to delete Door ?',
    _messageoncanceltodeletedoors: 'You decided to keep Door',
    _successfuldoorsdelete: 'Your Door has been deleted successfully',
    doorsUITitle: 'Doors',
    _successfulldoorsadded: 'Door added successfully',
    viewdoordetailsUITitle: 'Doors Details',
    editdoorUiTitle: 'Edit Door',

    //..................Doors Group....................................................

    
    doorGroupdeleteconfirmationmessage:'Would you like to delete Door Group ?',
    _messageoncanceltodeletedoorGroup:'You decided to keep Door Group' ,
    _successfuldoorsdelete:'Your Door Group has been deleted successfully',
    doorsGroupUITitle:'Door Group',
    _successfulldoorsGroupadded:'Door Group added successfully',
    viewdoorGroupdetailsUITitle:'Doors Group Details',
    editdoorGroupUiTitle:'Edit Door Group',

    //...........................................................................

    //...........Technician.......................................................

    technicianUiTitle: 'Technician',
    deletetechnicianconfirmationmessage: 'Would you like to delete Technician',
    deleteuserconfirmationmessage: 'Would you like to delete your user',
    _successfullyuserdeletedmessage: 'Your user has been deleted successfully',
    _successfullytechniciandeletedmessage: 'Technician has been deleted successfully',
    _canceluserfromdelete: 'You decided to keep your users',
    _canceltechnicianfromdelete: 'You decided to keep Technician',
    technicianProfileUiTitle: 'Technician',
    _successfullyuserupdatemessage: 'Technician updated successfully.',

    //............................................................................


    //.................Camera DVR.................................................

    cameraDVRtitle: 'Camera DVR',
    cameraGroupButtonTitle: 'Add Camera group',
    _deleteCameraGroupMessage: 'Would you like to delete camera group ?',
    _successfullCameraGroupDeleted: 'Camera group has been deleted successfully',
    _failedTodeleteCameraGroup: 'Unable to delete Camera Group',
    _canceltoDeleteCameraGroup: 'You decided to keep camera group',
    onecamlayout: 'onecam',
    twocamlayout: 'twocam',
    fourcamlayout: 'fourcam',
    sixcamlayout: 'sixcam',
    onecamgrid: 'onegrid',
    twocamgrid: 'twogrid',
    fourcamgrid: 'fourgrid',
    sixcamgrid: 'sixgrid',

    nocamerafoundonfilter: 'No camera found for this filter',
    norecordedFeedfound: 'No Recorded Feeds available for this camera',
    cameragroupcreated: 'Camera Group Created',


    //..................Schedule..................................................

    //............................................................................

    deleteSchedule: 'Your schedule groups has been deleted successfully.',
    _deleteScheduleGroupMessage: 'Would you like to delete schedule groups?',
    _successfullScheduleGroupDeleted: 'Schedule group has been deleted successfully',
    _failedTodeleteScheduleGroup: 'Unable to delete schedule groups.',
    _canceltoDeleteScheduleGroup: 'You decided to keep schedule groups.',



    //............................................................................


    //...........User.............................................................

    _successImageUpload: 'Image uploaded successfully',
    incompleteform: 'Please fill form',
    usertype: { admin: 'admin' },
    messageOncheckifpwdAndcnfrmpwdSame: 'Password and Confirm password should be same',

    _titleUserGroups: 'User Groups',
    _membersUserGroups: 'User Group Members',
    _deleteusergroupconfirmationmessage: 'Would you like to delete User Group ?',
    _cancelusergroupdeleteioonmessage: 'You decided to keep User Group',
    _successDeleteUserGroup: 'Your User Group has been deleted successfully',
    _successUserGroupRemoved: 'User group removed',
    _successUserRemoved: 'User removed',
    nomoredataavailable: 'No more data available',
    _titleviewUser: 'View User',
    _titleEditUser: 'Edit User',
    adduser: 'Add User',

    nousergroupassigned: 'No UserGroup Assigned',
    confirmationusergroupdeletemessage: 'Are you sure you want to Delete This User Group ?',
    _deleteuserconfirmationmessage: 'Would you like to delete User ?',
    _canceluserdeletionmessage: 'You decided to keep User',
    titleUsersUI: 'Users',
    rfidaddedsuccessfully: 'RFID Added Successfully',
    rfidupdatedsuccessfully: 'RFID Updated Successfully',
    phonecodeupdatedsuccessfully: 'Phone Code Updated Successfully',
    phonecodeaddedsuccessfully: 'Phone Code Added Successfully',
    blecodeupdatedsuccessfully: 'BLE Code Updated Successfully',
    blecodeaddedsuccessfully: 'BLE Code Added Successfully',
    nfccodeaddedsuccessfully: 'NFC Code Added Successfully',
    nfccodeupdatedsuccessfully: 'NFC Code Updated Successfully',
    accesscodeupdatedsuccessfully: 'Access Code Updated Successfully',
    accesscodeaddedsuccessfully: 'Access Code Added Successfully',
    wiegandaddedsuccessfully: 'Wiegand Code Added Successfully',
    wiegandupdatedsuccessfully: 'Wiegand Code Updated Successfully',



    //............................................................................

    //...............Profile Settings................................................

    titileProfileSettings: 'Profile Setting',
    _successemailIDchangesconfirmationmessage: 'your email ID has been changed successfully, you will get a varification email shortly with email varificationon link on your new registered email id. Please click on the link to login into the Facility Web Application ',

    //...............................................................................

    //..............Holiday Schedules.........................................................

    _titleHolidaySchedule: 'Holiday Schedule',
    _deleteholidayscheduleconfirmationmessage: 'Would you like to delete holiday schedule ?',
    _successdeleteholidayschedule: 'Your holiday schedule has been deleted successfully',
    _cancelholidayscheduledeletion: 'You decided to keep holiday schedule',
    _successholidayscheduleadded: 'Holiday Schedule added successfully',
    _successholidayscheduleedited: 'Holiday Schedule edited successfully',

    //........................................................................................

    //............................Administrator.......................................

    _successrolesadded: 'Roles added successfully',
    _successadminadded: 'Admin created successfully',

    //........................................................................................


    //............................SignUp.......................................

    _successsignup: 'You are successfully signed in.',
    _chktnc: 'Please agree Term and Conditions',


    //........................................................................................



    availableTimeZoneOptions: [
        {
            id: 'AKST',
            name: 'USA (Alaska)'
        },
        {
            id: 'UTC-11',
            name: 'USA (Samoa)'
        },
        {
            id: 'PST',
            name: 'USA (Pacific)'
        },
        {
            id: 'EST',
            name: 'USA (Eastern)'
        },
        {
            id: 'HST',
            name: 'USA (Hawaii-Aleutian)'
        },
        {
            id: 'MST',
            name: 'USA (Mountain)'
        },
        {
            id: 'AST',
            name: 'USA (Atlantic)'
        },
        {
            id: 'CST',
            name: 'USA (Central)'
        },
        {
            id: 'UTC+10',
            name: 'USA (Chamorro)'
        }
    ],

    timedropdown: [
        '00:00',
        '00:30',
        '01:00',
        '01:30',
        '02:00',
        '02:30',
        '03:00',
        '03:30',
        '04:00',
        '04:30',
        '05:00',
        '05:30',
        '06:00',
        '06:30',
        '07:00',
        '07:30',
        '08:00',
        '08:30',
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
        '18:00',
        '18:30',
        '19:00',
        '19:30',
        '20:00',
        '20:30',
        '21:00',
        '21:30',
        '22:00',
        '22:30',
        '23:00',
        '23:30'
    ],

    timedropdown2: [
        '0:00',
        '0:30',
        '1:00',
        '1:30',
        '2:00',
        '2:30',
        '3:00',
        '3:30',
        '4:00',
        '4:30',
        '5:00',
        '5:30',
        '6:00',
        '6:30',
        '7:00',
        '7:30',
        '8:00',
        '8:30',
        '9:00',
        '9:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
        '18:00',
        '18:30',
        '19:00',
        '19:30',
        '20:00',
        '20:30',
        '21:00',
        '21:30',
        '22:00',
        '22:30',
        '23:00',
        '23:30'
    ],

    monthNames: ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ],


    dashboardShortcutsList: [
        {
            shortcutID: 1,
            shortcutName: 'Facilities',
            shortcutUrl: 'app.admin.facility.facility',
            shortcutIcon: 'fa fa-question',
            status: false
        },
        {
            shortcutID: 2,
            shortcutName: 'Primary Devices',
            shortcutUrl: 'app.admin.device.devices',
            shortcutIcon: 'fa fa-question',
            status: false
        },
        {
            shortcutID: 3,
            shortcutName: 'Dependent Devices',
            shortcutUrl: 'app.admin.device.dependent-devices',
            shortcutIcon: 'fa fa-question',
            status: false
        },
        {
            shortcutID: 4,
            shortcutName: 'Users',
            shortcutUrl: 'app.admin.user.users',
            shortcutIcon: 'fa fa-question',
            status: false
        },
        {
            shortcutID: 5,
            shortcutName: 'Add User',
            shortcutUrl: 'app.admin.user.add-user',
            shortcutIcon: 'fa fa-question',
            status: false
        },
        {
            shortcutID: 6,
            shortcutName: 'User Groups',
            shortcutUrl: 'app.admin.user.user-groups',
            shortcutIcon: 'fa fa-question',
            status: false
        },
        {
            shortcutID: 7,
            shortcutName: 'Doors',
            shortcutUrl: 'app.admin.door.doors',
            shortcutIcon: 'fa fa-question',
            status: false
        },
        {
            shortcutID: 8,
            shortcutName: 'Door Groups',
            shortcutUrl: 'app.admin.door.door-groups',
            shortcutIcon: 'fa fa-question',
            status: false
        },
        {
            shortcutID: 9,
            shortcutName: 'Schedules',
            shortcutUrl: 'app.admin.schedule.schedule-groups',
            shortcutIcon: 'fa fa-question',
            status: false
        },
        {
            shortcutID: 10,
            shortcutName: 'Add Schedule',
            shortcutUrl: 'app.admin.schedule.add-schedule',
            shortcutIcon: 'fa fa-question',
            status: false
        },
        {
            shortcutID: 11,
            shortcutName: 'Holiday Schedules',
            shortcutUrl: 'app.admin.schedule.holiday-schedules',
            shortcutIcon: 'fa fa-question',
            status: false
        },
        {
            shortcutID: 12,
            shortcutName: 'Roles',
            shortcutUrl: 'app.admin.administrator.roles',
            shortcutIcon: 'fa fa-question',
            status: false
        },
        {
            shortcutID: 13,
            shortcutName: 'Add Roles',
            shortcutUrl: 'app.admin.administrator.add-roles',
            shortcutIcon: 'fa fa-question',
            status: false
        },
        {
            shortcutID: 14,
            shortcutName: 'Admin',
            shortcutUrl: 'app.admin.administrator.admin',
            shortcutIcon: 'fa fa-question',
            status: false
        },
        {
            shortcutID: 15,
            shortcutName: 'Live and Recorded Feeds',
            shortcutUrl: 'app.admin.camera.camera-dvr',
            shortcutIcon: 'fa fa-question',
            status: false
        },
        {
            shortcutID: 16,
            shortcutName: 'Camera Directory',
            shortcutUrl: 'app.admin.setup.camera-directory',
            shortcutIcon: 'fa fa-question',
            status: false
        }, {
            shortcutID: 17,
            shortcutName: 'DVR Directory',
            shortcutUrl: 'app.admin.setup.dvr-directory',
            shortcutIcon: 'fa fa-question',
            status: false
        }, {
            shortcutID: 18,
            shortcutName: 'DVR Camera Directory',
            shortcutUrl: 'app.admin.setup.dvrcamera-directory',
            shortcutIcon: 'fa fa-question',
            status: false
        },
        {
            shortcutID: 19,
            shortcutName: 'Activity',
            shortcutUrl: 'app.admin.activity',
            shortcutIcon: 'fa fa-question',
            status: false
        },
        {
            shortcutID: 20,
            shortcutName: 'History and Reports',
            shortcutUrl: 'NA',
            shortcutIcon: 'fa fa-question',
            status: false
        },
        {
            shortcutID: 21,
            shortcutName: 'Technicians',
            shortcutUrl: 'app.admin.support.technician',
            shortcutIcon: 'fa fa-question',
            status: false
        },
        {
            shortcutID: 22,
            shortcutName: 'Help and FAQs',
            shortcutUrl: 'app.admin.help.faqs',
            shortcutIcon: 'fa fa-question',
            status: false
        },
        {
            shortcutID: 23,
            shortcutName: 'Profile Settings',
            shortcutUrl: 'app.admin.profile-settings',
            shortcutIcon: 'fa fa-question',
            status: false
        }
    ],

    adminTypes: [
        {
            type: 'master',
            label: 'Master Administrator',
            value: false
        },
        {
            type: 'super',
            label: 'Super Administrator',
            value: true
        },
        {
            type: 'senior',
            label: 'Senior Administrator',
            value: true
        },
        {
            type: 'assistant',
            label: 'Assistant Administrator',
            value: true
        }
    ]





});