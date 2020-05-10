var app = angular.module('MobileApp', ['ngMaterial', 'ngMessages','ngRoute',
'home-module','core-service','request-module','roomsharing-module','room-module','tenant-module','noticeperiod-module','rent-module','pay-module','success-module',
'login-service','registration-service','request-service','roomsharing-service','room-service','tenant-service','noticeperiod-service','rent-service','dashboard-service','pay-service','suscription-service'
]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/home", { templateUrl : "view/home.html" })
    .when("/request", { templateUrl : "view/request.html" })
    .when("/tetant", { templateUrl : "view/tetant.html" })
    .when("/roomsharing", { templateUrl : "view/roomsharing.html" })
    .when("/roomsharing/:id", { templateUrl : "view/roomsharing_add.html" })
    .when("/room", { templateUrl : "view/room.html" })
    .when("/room/:id", { templateUrl : "view/room_add.html" })
    .when("/tenant", { templateUrl : "view/tenant.html" })
    .when("/tenant/:id", { templateUrl : "view/tenant_add.html" })
    .when("/noticeperiod", { templateUrl : "view/noticeperiod.html" })
    .when("/noticeperiod/:id", { templateUrl : "view/noticeperiod_add.html" })
    .when("/rent", { templateUrl : "view/rent.html" })
    .when("/rent/:id", { templateUrl : "view/rent_add.html" })
    .when("/pay", { templateUrl : "view/pay.html" })
    .when("/success", { templateUrl : "view/success.html" })
    .when("/error", { templateUrl : "view/error.html" });
});


app.run(function($rootScope,$location,coreService) {
    $rootScope.$on("$locationChangeStart", function(event, next, current) { 
        
        var oStr = next.split("#!");

        if(oStr.length > 1){
            if(oStr[1] != '/pay'){
                if(!coreService.getPaymentStatusPaid())
                    $location.path('/pay');
            }
        }
   
    });
});

app.controller('indexCTRL', function ($scope,$rootScope, coreService, loginService,$mdSidenav,$location,registrationService,rentService) {

    document.getElementById("app").style.visibility = "visible";
    $scope.isProcessing = false;
    
    var templates = function(name){
        switch(name){
            case 'login':
                $scope.login = true;
                $scope.otp = false;
                $scope.registration = false;
                $scope.home = false;
                break;
            case 'otp':
                $scope.login = false;
                $scope.otp = true;
                $scope.registration = false;
                $scope.home = false;
                break;
            case 'registration':
                $scope.login = false;
                $scope.otp = false;
                $scope.registration = true;
                $scope.home = false;
                break;
            case 'home':
                $scope.login = false;
                $scope.otp = false;
                $scope.registration = false;
                $scope.home = true;
                break;
        }
    };

    $scope.showMenu = function(url){
        
        $rootScope.isDashboard = false;
        var backUrl = '';

        switch(url){
            case '/home':
                $rootScope.isDashboard = true;
                $rootScope.toolbar_name = 'Home';
                $rootScope.backUrl = '';
                break;
            case '/request':
                $rootScope.toolbar_name = 'Request';
                $rootScope.backUrl = '/home';
                break;
            case '/room':
                $rootScope.toolbar_name = 'Room';
                $rootScope.backUrl = '/home';
                break;
            case '/tenant':
                $rootScope.toolbar_name = 'Tenant';
                $rootScope.backUrl = '/home';
                break;
            case '/noticeperiod':
                $rootScope.toolbar_name = 'Notice Period';
                $rootScope.backUrl = '/home';
                break;
            case '/rent':
                $rootScope.toolbar_name = 'Rent';
                $rootScope.backUrl = '/rent';
                break;
        }

        $scope.toggleLeft();
        $location.path(url);
    };

    $scope.objUser = {};


    $scope.initialize = function() {
       var pgId = coreService.getPGID();
       var mobileNo = coreService.getMobileNo();

       if(pgId == undefined || pgId == null || mobileNo == undefined || mobileNo == null ){
        templates('login');
       }
       else{
        $scope.objUser.MobileNo = mobileNo;
        $scope.objUser.PGID = pgId;
        $scope.doLogin2();
       }
    }

    $scope.doLogin = function(){
        if(!$scope.isProcessing){
            $scope.isProcessing = true;
            loginService.userExist($scope.objUser)
            .then(function (response) {
                $scope.isProcessing = false;
                if(response.data){
                    templates('otp');
                }
                else{
                    coreService.showToast(coreService.message.userNotExists);
                }
        }, function (err) {
            $scope.isProcessing = false;
            coreService.showToast(coreService.message.error);
        });
        }
    }

    $scope.doLogin2 = function(){
        $scope.isProcessing = true;
        loginService.validateUser2($scope.objUser)
        .then(function (response) {
            $scope.isProcessing = false;
            if(response.data != undefined || response.data != null)
            {
                if(response.data.Status == 'success' || response.data.Status == 'expire'){
                  
                    if(response.data.Status == 'expire')
                       coreService.setPaymentStatusPaid(false);
                    else
                        coreService.setPaymentStatusPaid(true);

                    var result = response.data;
                    /*menu*/
                    $scope.menu = result.ListOfMenuMaster;

                    coreService.setMobileNo($scope.objUser.MobileNo);
                    coreService.setPGID(result.User.PGID);
                    coreService.setPG(result.User.PG);

                    if(result.User.ProfileMaster.ProfileName == 'PGOwner'){
                        calculateRentForPG(result.User.PGID);
                    }

                    if($mdSidenav('left').isOpen())
                        $scope.toggleLeft();

                    templates('home');
                    $scope.showMenu('/home');
                }
                else{
                    coreService.showToast(response.data.Status);
                }
            }
            else
            {
                coreService.showToast(coreService.message.wrong);
            }
        }, function (err) {
            $scope.isProcessing = false;
            coreService.showToast(coreService.message.error);
        });
    }

    $scope.doVerify = function () {

        if(!$scope.isProcessing){
            $scope.isProcessing = true;
                loginService.validateUser($scope.objUser)
                .then(function (response) {
                    $scope.isProcessing = false;
                    if(response.data != undefined || response.data != null)
                    {
                        if(response.data.Status == 'success' || response.data.Status == 'expire'){
                          
                            if(response.data.Status == 'expire')
                               coreService.setPaymentStatusPaid(false);
                            else
                                coreService.setPaymentStatusPaid(true);

                            var result = response.data;
                            /*menu*/
                            $scope.menu = result.ListOfMenuMaster;

                            coreService.setMobileNo($scope.objUser.MobileNo);
                            coreService.setPGID(result.User.PGID);
                            coreService.setPG(result.User.PG);

                            if(result.User.ProfileMaster.ProfileName == 'PGOwner'){
                                calculateRentForPG(result.User.PGID);
                            }

                            if($mdSidenav('left').isOpen())
                                $scope.toggleLeft();

                            templates('home');
                            $scope.showMenu('/home');
                        }
                        else{
                            coreService.showToast(response.data.Status);
                        }
                    }
                    else
                    {
                        coreService.showToast(coreService.message.wrong);
                    }
                }, function (err) {
                    $scope.isProcessing = false;
                    coreService.showToast(coreService.message.error);
                });
            }
            else{
                coreService.showToast(coreService.message.userNotExists);
            }
        }


    var calculateRentForPG = function(rentId){
        console.log('call calculateRentForPG');
        rentService.calculateForPG(rentId)
        .then(function (response) {
 
        }, function (err) {
            coreService.showToast(coreService.message.error);
        });
    };
    


    $scope.back = function(){
        $rootScope.isDashboard = true;
        $rootScope.toolbar_name = 'Home';
        $rootScope.backUrl = '/home';
        $location.path($rootScope.backUrl);
    }

    $scope.register = function(){
        $scope.oRegistration = {};
        $scope.oRegistration.FullName = "";
        $scope.oRegistration.MobileNo = "";
        $scope.oRegistration.Email = "";
        $scope.oRegistration.Address = "";

        templates('registration');
    };


    $scope.registrationSubmit = function(form){

        coreService.showInd();
        registrationService.registrationCheck($scope.oRegistration.MobileNo)
        .then(function (response) {
            if(response.data)
            {
                registrationService.registration($scope.oRegistration)
                .then(function (response) {
                    coreService.hideInd();
                    if(response.data)
                    {
                        form.$setPristine();
                        form.$setUntouched();
                        coreService.showToast(coreService.message.registered);
                        templates('login');
                    }
                    else
                        coreService.showToast(coreService.message.wrong);
                    
                }, function (err) {
                    coreService.hideInd();
                    coreService.showToast(coreService.message.error);
                });
            }
            else
            {
                coreService.hideInd();
                coreService.showToast(coreService.message.alreadyRegistered);
            }
        }, function (err) {
            form.$setPristine();
            form.$setUntouched();
            coreService.hideInd();
            coreService.showToast(coreService.message.error);
        });
    };

    $scope.cancel = function(form){
        $scope.form.$setPristine();
        templates('login');
    };

    $scope.toggleLeft = buildToggler('left');

    $scope.closeSideNav = function(){
        if($mdSidenav('left').isOpen())
            $scope.toggleLeft();
    };
    
    function buildToggler(componentId) {
        return function() {
            $mdSidenav(componentId).toggle();
        };
    };
});

app.controller("registrationCTRL",function($scope,$rootScope, coreService,registrationService){

    $scope.Submit = function(){
        
                coreService.showInd();
                registrationService.registrationCheck($scope.oRegistration.MobileNo)
                .then(function (response) {
                    if(response.data)
                    {
                        registrationService.registration($scope.oRegistration)
                        .then(function (response) {
                            coreService.hideInd();
                            if(response.data)
                            {
                                coreService.showInd();
                                coreService.showToast(coreService.message.registered);
                                window.location = coreService.getHostURL();
                            }
                            else
                                coreService.showToast(coreService.message.wrong);
                            
                        }, function (err) {
                            coreService.hideInd();
                            coreService.showToast(coreService.message.error);
                        });
                    }
                    else
                    {
                        coreService.hideInd();
                        coreService.showToast(coreService.message.alreadyRegistered);
                    }
                }, function (err) {
                   
                    coreService.hideInd();
                    coreService.showToast(coreService.message.error);
                });
            };
        
            $scope.cancel = function(){
                window.location = coreService.getHostURL();
            };
});