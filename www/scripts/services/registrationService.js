var serv = angular.module('registration-service', []);
serv.service('registrationService', function ($http, config) {

    this.registrationCheck = function (mobileNo) {
        return $http.get(config.baseUrl + '/Registration/RegistrationCheck?mobileNo='+mobileNo);

    };

    this.registration = function (registration) {
        return $http.post(config.baseUrl + '/Registration',registration);

    };

});