var serv = angular.module('pay-service', []);
serv.service('payService', function ($http, config) {

    this.createOrder = function (orderRequest) {
        return $http.post(config.payUrl + '/Payment/CreateOrder',orderRequest);

    };

    this.getOrder = function (orderRequest) {
        return $http.post(config.payUrl + '/Payment/GetOrder', orderRequest);

    };

    this.pay = function (orderRequest) {
        return $http.post(config.payUrl + '/Payment/Pay', orderRequest);

    };
});