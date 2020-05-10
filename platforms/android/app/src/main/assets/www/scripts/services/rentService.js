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
});