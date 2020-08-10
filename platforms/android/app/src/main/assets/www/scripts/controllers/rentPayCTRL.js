var app = angular.module('rentPay-module', ['ngMaterial', 'ngRoute', 'ngMessages']);

app.controller('rentPayCTRL', function ($scope,$rootScope, $location,$routeParams,$mdSidenav,coreService,payService,rentService) {


    if($mdSidenav('left').isOpen())
    $scope.toggleLeft();

    var tenant = coreService.getTenant();
    var pg = coreService.getTenant().PG;

    $scope.productCode = 'PR003';
    $scope.payment_id = null;
    $scope.error_reference = null;
    $scope.payScreen = false;
    $scope.successScreen = false;

    var showScreen = function(scr){
        switch(scr){
            case 'pay':
                $scope.payScreen = true;
                $scope.successScreen = false;
            break;
            case 'success':
                $scope.payScreen = false;
                $scope.successScreen = true;
            break;
        }
    }

   $scope.initialize = function(){
        coreService.showInd();
        rentService.getTenantReceipts(tenant.TenantID,pg.PGID)
        .then(function (response) {
            coreService.hideInd();

            $scope.objRent = null;
            $scope.rentList = [];
            for(var i= 0; i<response.data.length;i++)
            {
                if(response.data[i].PaymentStatus.Status == 'Unpaid'){
                    $scope.rentList.push(response.data[i]);
                }
            }
            showScreen('pay');
        }, function (err) {
            coreService.hideInd();
            console.log(err.data);
        });
   };

   $scope.verify = function(data){

    var request = {};
    request.ProductCode = $scope.productCode;
    request.CustomerCode =  tenant.TenantNo;
    request.InvoiceNumber =  data.InvoiceNumber;

    $scope.objRentDetails =  data; 

    coreService.showInd();
    rentService.checkInvoiceTransaction(request)
    .then(function (response) {
        coreService.hideInd();

       if(response.data){
        updateRentPaymnetStatusToPaid();
        $scope.initialize ();
       }
       else{
        $scope.checkout();
       }
    }, function (err) {
        coreService.hideInd();
        console.log(err.data);
    });
   }

   $scope.checkout  = function()
   {
       var orderRequest = {};
        orderRequest.PayeeName = tenant.FullName + '-(' + pg.Name + ')';
        orderRequest.MobileNo = '91' + tenant.MobileNo;
        orderRequest.Email = 'nikhil.deshmukhbuzz@gmail.com';
        orderRequest.CustomerCode =tenant.TenantNo;
        orderRequest.ProductCode = 'PR003';
        orderRequest.Amount = $scope.objRentDetails.TotalAmount;
        orderRequest.ApplicationUrl = "NA";
        orderRequest.SucessUrl = "NA";
        orderRequest.ErrorUrl = "NA";
        orderRequest.SuscriptionNumber = null;
        orderRequest.InvoiceNumber = $scope.objRentDetails.InvoiceNumber;

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
    payService.c_pay(orderRequest)
        .then(function (response) {
            coreService.hideInd();
            var result = response.data;
          
            if (result.Status === 'SUCCESS') {
                addTransaction();
                updateRentPaymnetStatusToPaid();
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

  var addTransaction = function(){
      var request = {};
      request.CustomerCode = tenant.TenantNo;
      request.ProductCode = $scope.productCode;
      request.InvoiceNumber = $scope.objRentDetails.InvoiceNumber;

    rentService.addTransaction(request)
        .then(function (response) {

        }, function (err) {
            console.log(err.data);
           addTransactionLog('7');
        });
  };

  var updateRentPaymnetStatusToPaid = function()
  {

    rentService.updateRentPaymnetStatusToPaid($scope.objRentDetails)
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
