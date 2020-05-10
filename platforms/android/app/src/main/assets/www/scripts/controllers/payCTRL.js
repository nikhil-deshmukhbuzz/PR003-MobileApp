var app = angular.module('pay-module', ['ngMaterial', 'ngRoute', 'ngMessages']);

app.controller('payCTRL', function ($scope,$rootScope, $location,$routeParams,coreService,payService) {

    $scope.isTransComplete = false;
   $scope.initialize = function(){
        var orderRequest = {};
        orderRequest.PayeeName = 'ABC-(Niikhil Deshmukh)';
        orderRequest.MobileNo = '918975120963';
        orderRequest.Email = 'nikhil.deshmukhbuzz@gmail.com';
        orderRequest.CustomerCode = 'PG-000002';
        orderRequest.ProductCode = 'PR003';
        orderRequest.Amount = '5000';
        orderRequest.ApplicationUrl = coreService.getHostURL();
        orderRequest.SucessUrl = coreService.getHostURL();
        orderRequest.ErrorUrl = window.location.hostname;

        coreService.showInd();
        payService.createOrder(orderRequest)
            .then(function (response) {
                getOrder(10);
               // window.open(encodeURI(response.data.RedirectUrl),'_self','location=yes');
                //window.location.href = response.data.RedirectUrl;
            }, function (err) {
                coreService.hideInd();
                console.log(err.data);
         });
   };

  $scope.getOrder = function(){
    var orderRequest = {};
    orderRequest.TransactionStepID = $scope.TransactionStepID;
    payService.getOrder(orderRequest)
        .then(function (response) {
            var result = response.data;
            $scope.key = result.Key;
            $scope.success_url = result.Response.SucessUrl;
            $scope.amount = result.Response.RazorPay_Attribute.amount;
            $scope.order_id = result.Response.RazorPay_Attribute.id;
            $scope.org_name = result.Response.PayeeName;
            $scope.description = ""; //
            $scope.img = ""; //
            $scope.payee_name = result.Response.PayeeName;
            $scope.payee_email = "deshmukhnikhil100@gmail.com";//
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
        contact: '918975120963',
        name:  $scope.payee_name
        },
        theme: {
        color: '#F37254'
        }
    }

    RazorpayCheckout.open(options)
}
  
  var successCallback = function(success) {
    var orderRequest = {};
    orderRequest.OrderID = success.razorpay_order_id;
    orderRequest.Signature = success.razorpay_signature;
    orderRequest.PaymentID = success.razorpay_payment_id;
    orderRequest.TransactionStepID = $scope.TransactionStepID;

    $scope.isTransComplete = true;
    payService.pay(orderRequest)
        .then(function (response) {
            var result = response.data;
          
            if (result.Status === 'SUCCESS') {
               alert("success");
            }
            else {
                console.log(result);
            }
        }, function (err) {
            console.log(err.data);
        });


  }
  
  var cancelCallback = function(error) {
    alert(error.description + ' (Error '+error.code+')')
  }
  
  RazorpayCheckout.on('payment.success', successCallback)
  RazorpayCheckout.on('payment.cancel', cancelCallback)


   
});