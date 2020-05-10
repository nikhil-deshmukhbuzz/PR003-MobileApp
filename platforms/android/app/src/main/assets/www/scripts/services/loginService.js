var serv = angular.module('login-service', []);
serv.service('loginService', function ($http, config) {

    this.validateUser = function (oLogin) {
        return $http.post(config.baseUrl + '/Authenticate/ValidateUser',oLogin);

    };

    this.signOff = function () {
        return $http.post('/Authenticate/SignOff');

    };

    this.test = function () {
        return $http.get(config.baseUrl);

    };
});