var serv = angular.module('login-service', []);
serv.service('loginService', function ($http, config) {


    this.userExist = function (oLogin) {
        return $http.post(config.baseUrl + '/Authenticate/UserExist',oLogin);
    };

    this.validateUser = function (oLogin) {
        return $http.post(config.baseUrl + '/Authenticate/ValidateUser',oLogin);
    };

    this.validateUser2 = function (oLogin) {
        return $http.post(config.baseUrl + '/Authenticate/ValidateUser2',oLogin);
    };

    this.signOff = function () {
        return $http.post('/Authenticate/SignOff');
    };

    this.test = function () {
        return $http.get(config.baseUrl);
    };
});