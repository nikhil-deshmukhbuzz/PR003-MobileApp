var app = angular.module('MobileApp', ['ngMaterial', 'ngMessages','ngRoute',
'home-module','core-service','request-module','roomsharing-module','room-module','tenant-module','noticeperiod-module','rent-module','pay-module','success-module',
'login-service','registration-service','request-service','roomsharing-service','room-service','tenant-service','noticeperiod-service','rent-service','dashboard-service','pay-service'
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


app.run(function($rootScope) {
    $rootScope.$on("$locationChangeStart", function(event, next, current) { 
        
        // $rootScope.isDashboard = false;
        // var oStr = next.split("#!");

        // if(oStr[1] == '/request'){
        //     $rootScope.toolbar_name = 'Request';
        //     $rootScope.backUrl = '/home';
        // }
        // else{
        //     $rootScope.isDashboard = true;
        //     $rootScope.toolbar_name = 'Home';
        //     $rootScope.backUrl = '';
        // }
        


        // console.log(next+' : '+current);
    });
});

app.controller('indexCTRL', function ($scope,$rootScope, coreService, loginService,$mdSidenav,$location,registrationService,rentService) {

    $scope.isProcessing = false;
    coreService.setHostURL(window.location.href);

    var templates = function(name){
        switch(name){
            case 'login':
                $scope.login = true;
                $scope.registration = false;
                $scope.home = false;
                break;
            case 'registration':
                $scope.login = false;
                $scope.registration = true;
                $scope.home = false;
                break;
            case 'home':
                $scope.login = false;
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
    templates('login');
    $scope.doLogin = function () {

        if(!$scope.isProcessing){
            $scope.isProcessing = true;
            loginService.validateUser($scope.objUser)
            .then(function (response) {
                $scope.isProcessing = false;
                if(response.data != undefined || response.data != null)
                {
                    if(response.data.Status == 'Success' ){
                        var result = response.data;
                        /*menu*/
                        $scope.menu = result.ListOfMenuMaster;

                        coreService.setPGID(result.User.PGID);

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
    };

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