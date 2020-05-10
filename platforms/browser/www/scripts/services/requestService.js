var serv = angular.module('request-service', []);
serv.service('requestService', function ($http, config) {

    this.registrationList = function () {
        return $http.get(config.baseUrl + '/PGActivation/RegistrationList');

    };

    this.activation = function (registration) {
        return $http.post(config.baseUrl + '/PGActivation/Activation',registration);

    };
});