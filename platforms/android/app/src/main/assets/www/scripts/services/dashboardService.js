var serv = angular.module('dashboard-service', []);
serv.service('dashboardService', function ($http, config) {

    this.pgOwner = function (pgId) {
        return $http.get(config.baseUrl + '/Dashboard/PGOwner?pgId=' + pgId);

    };
});