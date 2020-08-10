var app = angular.module('pay-module', ['ngMaterial', 'ngRoute', 'ngMessages']);

app.controller('payCTRL', function ($scope,$rootScope, $location,$routeParams,$mdSidenav,coreService,payService,suscriptionService) {


    if($mdSidenav('left').isOpen())
    $scope.toggleLeft();

    $scope.productCode = 'PR003';
    $scope.expireOn = null;
    $scope.payment_id = null;
    $scope.error_reference = null;

    $scope.subscriptionScreen = false;
    $scope.payScreen = false;
    $scope.successScreen = false;
    $scope.errorScreen = false;


    var showScreen = function(scr){
        switch(scr){
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
       $scope.TransactionSessionID = new Date().getTime();
       
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
                    $scope.expireOn = response.data.LastDateOfSuscription;
                    showScreen('pay');
                  }
                  else{
                        coreService.showInd();
                        suscriptionService.verify(request)
                            .then(function (response) {
                                coreService.hideInd();
                                if(response.data != null){
                                    if(response.data.Status == 'valid' || response.data.Status == 'trial'){
                                        $scope.expireOn = response.data.LastDateOfSuscription;
                                      }
                                      else{
                                        $scope.expireOn = null;
                                      }
                                      showScreen('pay');
                                }
                                else{
                                   addTransactionLog('1.3');
                                }
                            }, function (err) {
                                coreService.hideInd();
                                console.log(err.data);
                               addTransactionLog('1.2');
                            });
                  }
               }
               else{
               addTransactionLog('1.1');
                }
            }, function (err) {
                coreService.hideInd();
                console.log(err.data);
               addTransactionLog('1');
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
           addTransactionLog('2.1');
        }
    }, function (err) {
        coreService.hideInd();
        console.log(err.data);
       addTransactionLog('2');
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
            $scope.payee_email = "deshmukhnikhil100@gmail.com";//pending
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
           addTransactionLog('5');
            console.log(err.data);
        });


  }
  
  var cancelCallback = function(error) {
    coreService.showToast('Transaction Failed');
    addTransactionLog('6');
  }

  var addTransaction = function(){
      var request = {};
      request.CustomerCode = $scope.pg.PGNo;
      request.ProductCode = $scope.productCode;

    suscriptionService.addTransaction(request)
        .then(function (response) {

        }, function (err) {
            console.log(err.data);
           addTransactionLog('7');
        });
  };

  $scope.done = function(){
    $location.path('/home');
  };

  var addTransactionLog = function(errCode){

        coreService.showToast(coreService.message.wrong + ' error code : ' + errCode);

        var request = {};
         request.PGID = coreService.getPGID();
         request.TransactionSessionID = $scope.TransactionSessionID;
         request.ErrorCode = errCode;

        suscriptionService.transactionErrorLog(request)
        .then(function (response) {

        }, function (err) {
            console.log(err.data);
        });
    };
    
    try {
        RazorpayCheckout.on('payment.success', successCallback)
        RazorpayCheckout.on('payment.cancel', cancelCallback)
      }
      catch(err) {
        coreService.showToast('Please try again later');
        console.log(err.message);
      }
   
});

app.controller('transerrorCTRL', function ($scope, $location) {
    $scope.home = function(){
        $location.path('/home');
      };
});