var serv = angular.module('schedular-service', []);
serv.service('schedularService', function ($http, config) {

    this.sendEmailToPG = function () {
        return $http.get(config.baseUrl + '/Schedular/SendEmailToPG');
    };

    this.save_monthly_rentDetails_XL = function () {
        return $http.get(config.baseUrl + '/Schedular/Save_Monthly_RentDetails_XL');
    };

    this.rentCalculation = function () {
        return $http.get(config.baseUrl + '/Schedular/RentCalculation');
    };

    this.sendNotification = function () {
        return $http.get(config.baseUrl + '/Schedular/SendNotification');
    };
});