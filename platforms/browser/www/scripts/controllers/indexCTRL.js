var app = angular.module('MobileApp', ['ngMaterial', 'ngMessages','ngRoute',
'home-module','core-service','request-module','roomsharing-module','room-module','tenant-module','np-module','rent-module','pay-module','success-module','receipt-module','rentPay-module','schedular-module','notification-module',
'login-service','registration-service','request-service','roomsharing-service','room-service','tenant-service','noticeperiod-service','rent-service','dashboard-service','pay-service','suscription-service','schedular-service','notification-service'
]);

app.config(function($routeProvider,$mdThemingProvider) {

    $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
    $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
    $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
    $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();

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
    .when("/noticeperiod", { templateUrl : "view/np.html" })
    .when("/noticeperiod/:id", { templateUrl : "view/np_add.html" })
    .when("/rent", { templateUrl : "view/rent.html" })
    .when("/rent/:id", { templateUrl : "view/rent_add.html" })
    .when("/pay", { templateUrl : "view/pay.html" })
    .when("/success", { templateUrl : "view/success.html" })
    .when("/error", { templateUrl : "view/error.html" })
    .when("/transerror", { templateUrl : "view/trans_error.html" })
    .when("/receipt", { templateUrl : "view/receipt.html" })
    .when("/rent_pay", { templateUrl : "view/rent_pay.html" })
    .when("/schedular", { templateUrl : "view/schedular.html" })
    .when("/notification", { templateUrl : "view/notification.html" });
});


app.run(function($rootScope,$location,coreService) {
    $rootScope.$on("$locationChangeStart", function(event, next, current) { 
        if(coreService.getUser().ProfileMaster.ProfileName == 'PGOwner'){
            var oStr = next.split("#!");

            if(oStr.length > 1){
                if(oStr[1] != '/pay'){
                    if(!coreService.getPaymentStatusPaid())
                        $location.path('/pay');
                }
            }
        }
   
    });
});

app.controller('indexCTRL', function ($scope,$rootScope,$timeout,$interval, coreService, loginService,$mdSidenav,$location,registrationService,rentService) {

    document.getElementById("app").style.visibility = "visible";
    coreService.setHostURL(window.location.href);
    $scope.isProcessing = false;

    $scope.objUser = {};
    $scope.objUser.MobileNo = '';
    $scope.objUser.OTP = '';
    
    var templates = function(name){
        switch(name){
            case 'login':
                $scope.login = true;
                $scope.otp = false;
                $scope.registration = false;
                $scope.prelogin = false; 
                $scope.home = false;
                break;
            case 'registration':
                $scope.login = false;
                $scope.otp = false;
                $scope.registration = true;
                $scope.prelogin = false; 
                $scope.home = false;
                break;
            case 'otp':
                $scope.login = false;
                $scope.otp = true;
                $scope.registration = false;
                $scope.prelogin = false; 
                $scope.home = false;
                break;
            case 'home':
                $scope.login = false;
                $scope.otp = false;
                $scope.registration = false;
                $scope.prelogin = false; 
                $scope.home = true;
                break;
            case 'prelogin':
                $scope.login = false;
                $scope.otp = false;
                $scope.registration = false;
                $scope.prelogin = true; 
                $scope.home = false;
                break;
        }
    };

    $scope.showMenu = function(url){
        $scope.toggleLeft();
        $location.path(url);
    };

    $scope.showNotification = function(url){
        $location.path(url);
    };

    $scope.initialize = function() {
       var mobileNo = coreService.getMobileNo();
       var pgId = coreService.getPGID();

       if (mobileNo == undefined || mobileNo == null ){
            templates('login');
       }
       else{
            $scope.objUser.MobileNo = mobileNo;
            $scope.objUser.PGID = pgId;
            $scope.doLogin2();
       }
    };

    $scope.doLogin = function(){
        if($scope.objUser.MobileNo == '' || $scope.objUser.MobileNo == undefined)
            coreService.showToast('Please enter the Mobile No');
        else if(!$scope.isProcessing)
        {
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
    };

    $scope.doLogin2 = function(){
        templates('prelogin');
        $scope.isProcessing = true;
        loginService.validateUser2($scope.objUser)
        .then(function (response) {
            $scope.isProcessing = false;
            $scope.userLoginInSuccess(response.data);
        }, function (err) {
            $scope.isProcessing = false;
            coreService.showToast(coreService.message.error);
        });
    }

    $scope.doVerify = function () {
        if($scope.objUser.OTP == '' || $scope.objUser.OTP == undefined)
            coreService.showToast('Please enter the OTP');
        else if(!$scope.isProcessing)
        {
            $scope.isProcessing = true;
            loginService.validateUser($scope.objUser)
            .then(function (response) {
                $scope.isProcessing = false;
                coreService.setMastersToNull();
                $scope.userLoginInSuccess(response.data);
            }, function (err) {
                $scope.isProcessing = false;
                coreService.showToast(coreService.message.error);
            });
            }
        else{
            coreService.showToast(coreService.message.userNotExists);
        }
    };

    $scope.userLoginInSuccess = function(result){
        if(result != undefined || result != null)
        {
            if(result.Status == 'success' || result.Status == 'expire'){
                
                $scope.updatePushNotifyToken(result.User);
                $rootScope.toolbar_name = 'Dashboard';
                if(result.User.ProfileMaster.ProfileName == 'PGOwner')
                {
                    $scope.sidenav_username = result.User.PG.Name + ' (' + result.User.PG.PGNo + ')';
                    if(result.Status == 'expire')
                    {
                        $rootScope.toolbar_name = 'Suscription';
                        coreService.setPaymentStatusPaid(false);
                    }
                    else
                    {
                        coreService.setPaymentStatusPaid(true);
                        calculateRentForPG(result.User.PGID);
                    }
                }
                else if(result.User.ProfileMaster.ProfileName == 'Tenant')
                {
                    $scope.sidenav_username = result.User.Name;
                    coreService.setTenants(result.Tenants);
                    coreService.setTenant(result.Tenants[0]);
                }
                else{
                    $scope.sidenav_username = 'Administrator';
                }

                /*set master data*/
                $scope.menu = result.ListOfMenuMaster;

                coreService.setUser(result.User);
                coreService.setMobileNo($scope.objUser.MobileNo);
                coreService.setPGID(result.User.PGID);
                coreService.setPG(result.User.PG);

                coreService.setMasters();

                templates('home');
                if($mdSidenav('left').isOpen())
                    $scope.toggleLeft();

                $rootScope.toolbar_name = 'Dashboard';
                $interval($scope.setToolbar, 1000);   
                $location.path('/home');
            }
            else if(result.Status == 'user_not_exists'){
                $scope.objUser.MobileNo = null;
                $scope.objUser.PGID = null;
                templates('login');
            }
            else{
                coreService.showToast(coreService.message.error);
            }
        }
        else
        {
            coreService.showToast(coreService.message.wrong);
        }
    };    

    $scope.updatePushNotifyToken = function(user){
        $scope.user = user;
        $timeout($scope.setDeviceId, 10000);
        try {
                if (window.FirebasePlugin == null)
                    return;
                
                window.FirebasePlugin.getToken(function (token) {
                user.PushNotificationToken = token;
                loginService.updatePushNotification(user)
                .then(function (response) { 
                    }, function (err) { });
                });
            }
        catch (e) { }
    };

    $scope.setToolbar = function(){
        var toolbar_nm =   $rootScope.toolbar_name;
        $rootScope.toolbar_name = toolbar_nm;
    };

    $scope.setDeviceId = function(){
        if(deviceId != null){
            $scope.user.DeviceID = deviceId;

            loginService.updateDeviceID($scope.user)
            .then(function (response) {
            }, function (err) {
            });
         }
    };

    $scope.logout =function(){

        if (confirm("Are you sure to logout?")) {
            $scope.objUser.MobileNo = '';
            $scope.objUser.OTP = '';
            $scope.objUser.PGID = '';
            coreService.setMastersToNull();

            var refresh = coreService.getHostURL();
            localStorage.clear();
            window.location = refresh;
          } else {
          }
    };

    var calculateRentForPG = function(rentId){
        rentService.calculateForPG(rentId)
        .then(function (response) {
        }, function (err) {
        });
    };

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

app.controller("registrationCTRL",function($scope,coreService,registrationService,payService,requestService){


    $scope.oRegistration = {};
    $scope.oRegistration.RegistrationID = 0;
    $scope.productCode = 'PR003';
    $scope.payment_id = null;
    $scope.successScreen = false;

    $scope.registrationSubmit = function(){
        coreService.showInd();
        registrationService.registrationCheck($scope.oRegistration.MobileNo)
        .then(function (response) {
            if(response.data == 0)
            {
                console.log('new');
                registrationService.registration($scope.oRegistration)
                .then(function (response) {
                    coreService.hideInd();
                    if(response.data > 0)
                    {
                        $scope.oRegistration.RegistrationID = response.data;
                        $scope.checkout();
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
                console.log('alreay exists');
                $scope.oRegistration.RegistrationID = response.data;
                $scope.checkout();
            }
        }, function (err) {
            
            coreService.hideInd();
            coreService.showToast(coreService.message.error);
        });
    };

    $scope.cancel = function(){
        window.location = coreService.getHostURL();
    };


    $scope.checkout  = function()
    {
        $scope.initRazorPay();
        console.log($scope.oRegistration);
        $scope.invoice = 'CUST_NEW-' + new Date().getTime();
        var orderRequest = {};
         orderRequest.PayeeName = $scope.oRegistration.FullName + '-(' + $scope.oRegistration.PGName + ')';
         orderRequest.MobileNo = '91' + $scope.oRegistration.MobileNo;
         orderRequest.Email = $scope.oRegistration.Email;
         orderRequest.CustomerCode ='CUST_NEW';
         orderRequest.ProductCode = 'PR003';
         orderRequest.Amount = 50;
         orderRequest.ApplicationUrl = "NA";
         orderRequest.SucessUrl = "NA";
         orderRequest.ErrorUrl = "NA";
         orderRequest.SuscriptionNumber = null;
         orderRequest.InvoiceNumber = $scope.invoice;
 
         coreService.showInd();
         payService.createOrder(orderRequest)
             .then(function (response) {
                 coreService.hideInd();
                 if(response.data != null){
                     if(response.data.Status == 'SUCCESS'){
                         if(response.data.TransactionStepID != null && response.data.TransactionStepID != 0){
                             $scope.TransactionStepID = response.data.TransactionStepID
                             getOrder();
                         }
                         else
                         {
                            addTransactionLog('4.3');
                         }    
                     }
                     else{
                        addTransactionLog('4.2');
                     }
                 }
                 else{
                    addTransactionLog('4.1');
                 }
                 
             }, function (err) {
                 coreService.hideInd();
                 console.log(err.data);
                 addTransactionLog('4');
          });
    }
 
   var getOrder = function(){
     var orderRequest = {};
     orderRequest.TransactionStepID = $scope.TransactionStepID;
     coreService.showInd();
     payService.getOrder(orderRequest)
         .then(function (response) {
             coreService.hideInd();
             var result = response.data;
             $scope.key = result.Key;
             $scope.success_url = result.Response.SucessUrl;
             $scope.amount = result.Response.RazorPay_Attribute.amount;
             $scope.order_id = result.Response.RazorPay_Attribute.id;
             $scope.org_name = result.Response.PayeeName;
             $scope.description = ""; //pending
             $scope.img = ""; //pending
             $scope.payee_name = result.Response.PayeeName;
             $scope.payee_email = $scope.oRegistration.Email;
             $scope.payee_mobno = result.Response.MobileNo;
 
             pay();
 
         }, function (err) {
             coreService.hideInd();
             console.log(err.data);
            addTransactionLog('3');
         });
    };
 
    var pay = function(){
 
     var options = {
         description: '',
         image: '',
         currency: 'INR',
         key:  $scope.key,
         order_id:  $scope.order_id ,
         amount:  $scope.amount,
         name:  $scope.payee_name,
         prefill: {
         email: $scope.oRegistration.Email,
         contact:  $scope.payee_mobno,
         name:  $scope.payee_name
         },
         theme: {
         color: '#F37254'
         }
     }
 
     RazorpayCheckout.open(options)
 }
   
   var successCallback = function(success) {
    $scope.successScreen = true;
    $scope.activation();
     coreService.showToast(coreService.message.registered);
     var orderRequest = {};
     orderRequest.OrderID = success.razorpay_order_id;
     orderRequest.Signature = success.razorpay_signature;
     orderRequest.PaymentID = success.razorpay_payment_id;
     orderRequest.TransactionStepID = $scope.TransactionStepID;
 
     $scope.payment_id = success.razorpay_payment_id;
 
     coreService.showInd();
     payService.pay(orderRequest)
         .then(function (response) {
             coreService.hideInd();
             var result = response.data;
           
             if (result.Status === 'SUCCESS') {
                 addTransaction();
             }
             else {
                addTransactionLog('5.1');
                 console.log(result);
             }
         }, function (err) {
             coreService.hideInd();
            addTransactionLog('5');
             console.log(err.data);
         });
 
 
   }
   
   var cancelCallback = function(error) {
     coreService.showToast('Transaction Failed');
     addTransactionLog('6');
   }

   $scope.activation =function(){
    console.log('activation');
       console.log($scope.oRegistration);
        coreService.showInd();
        requestService.activation($scope.oRegistration)
        .then(function (response) {
            if(response.data)
                coreService.showToast('Your registered PG activated.');
            else
                coreService.showToast('Your will recieve activation message within an hour.');
        }, function (err) {
            coreService.hideInd();
            console.log(err.data);
        });
    };
 
   var addTransaction = function(){
       var request = {};
       request.CustomerCode ='CUST_NEW';
       request.ProductCode = $scope.productCode;
       request.InvoiceNumber = $scope.invoice;
   };

   $scope.initRazorPay = function(){
        try {
            RazorpayCheckout.on('payment.success', successCallback)
            RazorpayCheckout.on('payment.cancel', cancelCallback)
        }
        catch(err) {
            coreService.showToast('Please try again later');
            console.log(err.message);
        }
    }
 
   $scope.done = function(){
     window.location = coreService.getHostURL();
   };
 
   var addTransactionLog = function(errCode){
 
        //  coreService.showToast(coreService.message.wrong + ' error code : ' + errCode);
 
        //  var request = {};
        //   request.PGID = null;
        //   request.TransactionSessionID = $scope.TransactionSessionID;
        //   request.ErrorCode = errCode;
 
        //  suscriptionService.transactionErrorLog(request)
        //  .then(function (response) {
 
        //  }, function (err) {
        //      console.log(err.data);
        //  });
     };
 

});