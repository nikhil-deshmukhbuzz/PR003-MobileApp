var serv = angular.module('suscription-service', []);
serv.service('suscriptionService', function ($http, config) {

    this.getList = function (pgId) {
        return $http.get(config.baseUrl + '/Suscription/GetList');

    };

    this.verify = function (request) {
        return $http.post(config.baseUrl + '/Suscription/Verify',request);

    };

    this.expireOn = function (request) {
        return $http.post(config.baseUrl + '/Suscription/ExpireOn',request);

    };

});