app.constant("appConstants", {

    //........API URLs...........................................................

    userDashboard:'user/dashboard',
    facilityAdd:'facility/add',
    facilitylist:'facility/list',
    facilityview:'facility/view/',
    devicelistmaster:'device/list-master-device',
    deviceadd:'device/add',
    facilityedit:'facility/edit',
    listeventtype:'event/list-event-type',
    listevent:'event/list-event',
    adminadd:'admin/add',
    cameralist:'camera/list',
    cameragrouplist:'cameragroup/list',
    deletecameragroup:'cameragroup/delete',
    s3list:'s3/list',
    cameragroupadd:'cameragroup/add',
    devicedelete:'device/delete',
    doorlistnotassigntodevice:'door/list-door-not-assigned-to-device',
    doorlist:'door/list',
    technicianlist:'technician/list',
    devicemodellist:'device/models-list',
    deviceview:'device/view',
    listslaveofmasterdevice:'device/list-slave-of-master-device',
    userdetailsbydevice:'device/user-details-by-device',
    deviceedit:'device/edit',
    devicelistslave:'device/list-slave-device',
    deviceaddsettings:'device/add-settings',
    devicegetsettings:'device/get-settings',
    doorlistfordeviceid:'door/list-door-for-deviceid',
    getdevicerelay:'device/get-device-relay',
    doorassigndevice:'door/assign-device',
    doorgroupadd:'doorgroup/add',
    doorgrouplist:'doorgroup/list',
    doorgroupedit:'doorgroup/edit',
    doorgroupdelete:'doorgroup/delete',
    doordelete:'door/delete/',
    dooradd:'door/add',
    doorview:'door/view',
    dooredit:'door/edit',

    scheduleadd:'schedule/add',
    scheduleDelete:'schedule/delete',
    scheduleList:'schedule/list',
    listSecretQuestions:'list-secret-ques',
    forgetPassword:'user/forget-password',

    userpicupload:'user/pic-upload',
    useradd:'user/add',
    useredit:'user/edit',
    manageaccount:'manage-account',
    listuserbyusergroup:'usergroup/list-user-by-usergroup',
    usergroupdelete:'usergroup/delete',
    removeusergroup:'user/remove-usergroup',
    usergroupadd:'usergroup/add',
    usergroupeditdoorschedule:'usergroup/edit-door-schedule',
    usergrouplistdoorschedule:'usergroup/list-door-schedule',
    usergrouplist:'usergroup/list',
    usergroupedit:'usergroup/edit',
    listsecretquestions:'list-secret-ques',
    updatesecretquestions:'update-secret-ques',





    //...........................................................................

    //........Methods............................................................
    getMethod:'GET',
    postMethod:'POST',
    putMethod:'PUT',
    deleteMethod:'DELETE',
    //...........................................................................


    //..............Generics.....................................................
    oops: "Oops !! ",
    error: "Error !! ",
    success:"Success !! ",
    info:'Info',
    none:"none",
    block:'block',
    inlineblock:'inline-block',
    empty:'',
    questionMark:'?',
    null:null,
    gridLayout:'grid',
    listLayout:'list',
    gridviewClass:'gridview',
    listviewClass:'listview',
    imagePath:'elika/images/',
    content:'The standard chunk of Lorem Ipsum used.',
    active:'Active',
    inactive:'In-Active',
    reset:'Reset',
    search:'Search',
    submitSuccessfully:'Submit Successfully',
    somethingwrong:'Something went wrong',

    //...........................................................................

    //....................HTTP Consts..........................................
    facilitycookieID:'facility',
    sessionTokenCookieID:'token',
    contentType:'application/json',
    dataType:'JSON',
    sessionExp:'Session Expired',

    //............................................................................

    //.....Modals................................................................

    cancel:'Cancel',
    delete:'Delete',
    ok:'OK',
    yes:'Yes',
    no:'No',
    dangerstatusClass:'alert alert-danger alert-dismissable',
    successstatusClass:'alert alert-success alert-dismissable',
    disabled:'disabled',



    //...........................................................................


    //.........Home/Dashboard....................................................
    dashboardTitle:'Dashboard',
    dashboardSubTitle:'So much more to see at a glance.',
    //...........................................................................

    //.........Facilities..........................................................
    facilityTitle:'Facility',
    facilitySubTitle:'',
    facilityDetailsTitle:'Facility Details',
    facilityDetailsSubTitle:'',
    _successfacilityAdd:'Facility added successfully.',
    _deleteFacilityConfirm:'Would you like to delete Facility ?',
    _successDeleteFacility:'Your Facility has been deleted successfully.',
    _cancelFacilityDelete:'You decided to keep Facility.',
    _editFacilitySuccess:'Facility Edited Successfully',
    //...........................................................................

    //.................Devices....................................................

    deviceTitle:'Devices',
    primaryDevice:'Primary',
    _deletePrimaryDevice:'Would you like to delete device ?',
    _successdeleteDevice:'Your device has been deleted successfully',
    _canceldevicedelete:'You decided to keep device.',
    nomorerecords:'No More Records',
    deviceviewUITitle:'Device Details',
    dependentDevice:'Dependent Device',
    deletedeviceconfirmationmessage:'Are you sure you want to delete this device ?',
    deletedependentdeviceconfirmation:'Would you like to delete dependent device ?',
    _successdeletedependentDevice:'Your dependent device has been deleted successfully',
    _canceldependentdevicedelete:'You decided to keep dependent device',
    editDeviceUiTitle:'Edit Device',
    settings:'Settings',

    //............................................................................


    //..............Devices Settings..............................................

    deviceSettings:{
        commonGetAPIData:{type:'gen',typeadv:'adv'},
        accessgrantkey:'access-grant-key',
        lockoutmode:'lockout-mode',
        videorecordingaccess:'video-recording-access',
        picturesnapshotsaccess:'picture-snapshot-access',
        camerasetup:'camera-setup',
        snapshotsstatus:'snapshot-status',
        recordingstatus:'recording-status',
        talktimesetup:'talk-time-setup',
        talktime:'talk-time',
        realtimeclock:'real-time-clock',
        starttime:'start-time',
        endtime:'end-time',
        ledsetup:'led-setup',
        keypadsetup:'keypad-setup',
        keypadbrightness:'keypad-brightness',
        courtesylightsetup:'courtesy-light-setup',
        courtesybrightness:'courtesy-brightness',
        speakermicrophonesetup:'speaker-microphone-setup',
        speakerbeeper:'speaker-beeper',
        microphonebeeper:'microphone-beeper',
        speakervolume:'speaker-volume',
        microphonesensitivity:'microphone-sensitivity',
        lockout:'lockout',
        maxtries:'max-tries',
        lockoutperiod:'lockout-period',
        mastercode:'master-code',
        clocksettings:'clock-settings',
        timezone:'time-zone',
        latchcode:'latch-code',
        accessgates:'access-gates',
        diagnostics:'diagnostics',
        description:'description',
        callbuttonsetup:'call-button-setup',
        callbutton:'call-button'
    },


    _successaccessgrantkeychangesmessage:'Access Granted key changed successfully',
    _successCameraConfigured:'Camera Configured successfully',
    _successTaltimeConfigured:'Talk Time Configured successfully',
    _successledConfigured:'LED Configured successfully',
    _successrelayanddoorsetupconfigured:'Relay & Door Setup configured successfully',
    _successspeakerandmicrophoneconfigured:'Speaker and Microphone configured successfully',
    _successlockoutmodeconfigured:'Lockout Mode Configured successfully',
    _successmastercodeconfigured:'Master Code Configured successfully',
    _successclockconfigured:'Clock Configured successfully',
    _successlatchcodeconfigured:'Latch Code Configured successfully',
    _successdiagnosticsconfigured:'Diagnostics Configured successfully',
    _successcallbuttonconfigured:'Call Button Setup Configured successfully',
    //............................................................................


    //.................Activities....................................................

    activitiesTitle:'Activity',

    //............................................................................

    //.................Admin....................................................

    admintitle:'Admin',

    //............................................................................


    //..................Doors....................................................

    doorsgroupUiTitle:'Door Groups',
    doorsdeleteconfirmationmessage:'Would you like to delete Door ?',
    _messageoncanceltodeletedoors:'You decided to keep Door',
    _successfuldoorsdelete:'Your Door has been deleted successfully',
    doorsUITitle:'Doors',
    _successfulldoorsadded:'Door added successfully',
    viewdoordetailsUITitle:'Doors Details',
    editdoorUiTitle:'Edit Door',

    //...........................................................................

    //...........Technician.......................................................

    technicianUiTitle:'Technician',
    deleteuserconfirmationmessage:'Would you like to delete your user',
    _successfullyuserdeletedmessage:'Your user has been deleted successfully',
    _canceluserfromdelete:'You decided to keep your users',
    technicianProfileUiTitle:'Technician',

    //............................................................................


    //.................Camera DVR.................................................

    cameraDVRtitle:'Camera DVR',
    cameraGroupButtonTitle:'Add Camera group',
    _deleteCameraGroupMessage:'Would you like to delete camera group ?',
    _successfullCameraGroupDeleted:'Camera group has been deleted successfully',
    _failedTodeleteCameraGroup:'Unable to delete Camera Group',
    _canceltoDeleteCameraGroup:'You decided to keep camera group',
    onecamlayout:'onecam',
    twocamlayout:'twocam',
    fourcamlayout:'fourcam',
    sixcamlayout:'sixcam',
    onecamgrid:'onegrid',
    twocamgrid:'twogrid',
    fourcamgrid:'fourgrid',
    sixcamgrid:'sixgrid',

    nocamerafoundonfilter:'No camera found for this filter',
    norecordedFeedfound:'No Recorded Feeds available for this camera',
    cameragroupcreated:'Camera Group Created',


    //..................Schedule..................................................

    //............................................................................

    deleteSchedule:'Your schedule groups has been deleted successfully.',
    _deleteScheduleGroupMessage:'Would you like to delete schedule groups?',
    _successfullScheduleGroupDeleted:'Schedule group has been deleted successfully',
    _failedTodeleteScheduleGroup:'Unable to delete schedule groups.',
    _canceltoDeleteScheduleGroup:'You decided to keep schedule groups.',



    //............................................................................


    //...........User.............................................................

    _successImageUpload:'Image uploaded successfully',
    incompleteform:'Please fill form',
    usertype:{admin:'admin'},
    messageOncheckifpwdAndcnfrmpwdSame:'Password and Confirm password should be same',

    _titleUserGroups:'User Groups',
    _membersUserGroups:'User Groups Members',
    _deleteusergroupconfirmationmessage:'Would you like to delete User Group ?',
    _cancelusergroupdeleteioonmessage:'You decided to keep User Group',
    _successDeleteUserGroup:'Your User Group has been deleted successfully',
    _successUserGroupRemoved:'User group removed',
    nomoredataavailable:'No more data available',

    //............................................................................

    //...............Profile Settings................................................

    titileProfileSettings:'Profile Setting',

    //...............................................................................






    availableTimeZoneOptions:[
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
    ]

});