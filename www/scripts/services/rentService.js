var serv = angular.module('rent-service', []);
serv.service('rentService', function ($http, config) {

    this.getList = function (pgId) {
        return $http.get(config.baseUrl + '/Rent/GetList?pgId='+pgId);

    };

    this.getFilterList = function (pgId,monthId,year) {
        return $http.get(config.baseUrl + '/Rent/GetFilterList?pgId='+pgId+'&monthId='+monthId+'&year='+year);

    };

    this.getPaymentStatus = function () {
        return $http.get(config.baseUrl + '/Rent/GetPaymentStatus');

    };

    this.update = function (rent) {
        return $http.post(config.baseUrl + '/Rent/Update',rent);

    };

    this.calculateForPG = function (pgId) {
        return $http.post(config.baseUrl + '/Rent/CalculateForPG?pgId='+pgId);

    };

    this.getTenantReceipts = function (tenantId,pgId) {
        return $http.get(config.baseUrl + '/Rent/GetTenantReceipts?tenantId='+tenantId+'&pgId='+pgId);

    };

    this.checkInvoiceTransaction = function (request) {
        return $http.post(config.baseUrl + '/Rent/CheckInvoiceTransaction',request);

    };

    this.addTransaction = function (request) {
        return $http.post(config.baseUrl + '/Rent/AddTransaction',request);

    };

    
    this.updateRentPaymnetStatusToPaid = function (rent) {
        return $http.post(config.baseUrl + '/Rent/UpdateRentPaymnetStatusToPaid',rent);

    };
});