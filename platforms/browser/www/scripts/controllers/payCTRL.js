var app = angular.module('pay-module', ['ngMaterial', 'ngRoute', 'ngMessages']);

app.controller('payCTRL', function ($scope,$rootScope, $location,$routeParams,$mdSidenav,coreService,payService,suscriptionService) {


    if($mdSidenav('left').isOpen())
    $scope.toggleLeft();

    $scope.productCode = 'PR003';

    $scope.subscriptionScreen = false;
    $scope.payScreen = false;
    $scope.successScreen = false;
    $scope.errorScreen = false;


    var showScreen = function(scr){
        switch(scr){
            case 'subscription':
                $scope.subscriptionScreen = true;
                $scope.payScreen = false;
                $scope.successScreen = false;
                $scope.errorScreen = false;
                coreService.setPaymentStatusPaid(true);
            break;
            case 'pay':
                $scope.subscriptionScreen = false;
                $scope.payScreen = true;
                $scope.successScreen = false;
                $scope.errorScreen = false;
                getSuscription();
            break;
            case 'success':
                $scope.subscriptionScreen = false;
                $scope.payScreen = false;
                $scope.successScreen = true;
                $scope.errorScreen = false;
                coreService.setPaymentStatusPaid(true);
            break;
            case 'error':
                $scope.subscriptionScreen = false;
                $scope.payScreen = false;
                $scope.successScreen = false;
                $scope.errorScreen = true;
            break;
        }
    }


   $scope.initialize = function(){
       $scope.pg = coreService.getPG();

       var request = {};
       request.PGID =  coreService.getPGID();
       request.ProductCode = $scope.productCode;
       request.CustomerCode =  $scope.pg.PGNo;
       $scope.CustomerCode =  $scope.pg.PGNo;
       
       coreService.showInd();
       suscriptionService.expireOn(request)
            .then(function (response) {
                coreService.hideInd();
               if(response.data != null){
                  if(response.data.Status == 'valid' || response.data.Status == 'trial'){
                    showScreen('subscription');
                  }
                  else{
                        coreService.showInd();
                        suscriptionService.verify(request)
                            .then(function (response) {
                                coreService.hideInd();
                                if(response.data != null){
                                    if(response.data.Status == 'valid' || response.data.Status == 'trial'){
                                        showScreen('subscription');
                                      }
                                      else{
                                        showScreen('pay');
                                      }
                                }
                                else{
                                    //error handling
                                }
                            }, function (err) {
                                coreService.hideInd();
                                console.log(err.data);
                            });
                  }
               }
               else{
                //error handling
                }
            }, function (err) {
                coreService.hideInd();
                console.log(err.data);
         });
   };

   
   var getSuscription = function(){
    coreService.showInd();
    suscriptionService.getList()
    .then(function (response) {
        coreService.hideInd();
        if(response.data != null){
            $scope.suscriptionList = response.data;
        }
        else{
            //error handling
        }
    }, function (err) {
        coreService.hideInd();
        console.log(err.data);
    });
};

   $scope.checkout  = function()
   {
       var orderRequest = {};
        orderRequest.PayeeName = $scope.pg.Name + '-(' + $scope.pg.OwnerName + ')';
        orderRequest.MobileNo = '91' + $scope.pg.MobileNo;
        orderRequest.Email = 'nikhil.deshmukhbuzz@gmail.com';
        orderRequest.CustomerCode = $scope.pg.PGNo;
        orderRequest.ProductCode = 'PR003';
        orderRequest.Amount = $scope.objSuscription.Amount;
        orderRequest.ApplicationUrl = "NA";
        orderRequest.SucessUrl = "NA";
        orderRequest.ErrorUrl = "NA";
        orderRequest.SuscriptionNumber = $scope.objSuscription.SerialNumber;

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
                                //error handling
                            }    
                    }
                    else{
                        //error handling
                    }
                }
                else{
                    //error handling
                }
                
            }, function (err) {
                coreService.hideInd();
                console.log(err.data);
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
            $scope.payee_email = "deshmukhnikhil100@gmail.com";//pending
            $scope.payee_mobno = result.Response.MobileNo;

            pay();

        }, function (err) {
            coreService.hideInd();
            console.log(err.data);
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
        email: 'deshmukhnikhil100@gmail.com',
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
    showScreen('success');
    var orderRequest = {};
    orderRequest.OrderID = success.razorpay_order_id;
    orderRequest.Signature = success.razorpay_signature;
    orderRequest.PaymentID = success.razorpay_payment_id;
    orderRequest.TransactionStepID = $scope.TransactionStepID;

    coreService.showInd();
    payService.pay(orderRequest)
        .then(function (response) {
            coreService.hideInd();
            var result = response.data;
          
            if (result.Status === 'SUCCESS') {
             
            }
            else {
                console.log(result);
            }
        }, function (err) {
            console.log(err.data);
        });


  }
  
  var cancelCallback = function(error) {
    showScreen('error');
  }
  
  RazorpayCheckout.on('payment.success', successCallback)
  RazorpayCheckout.on('payment.cancel', cancelCallback)


   
});