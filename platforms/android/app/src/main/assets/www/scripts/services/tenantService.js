var serv = angular.module('tenant-service', []);
serv.service('tenantService', function ($http, config) {

    this.add = function (tenant) {
        return $http.post(config.baseUrl + '/Tenant',tenant);

    };

    this.update = function (tenant) {
        return $http.post(config.baseUrl + '/Tenant/Update',tenant);

    };

    this.getList = function (pgId) {
        return $http.get(config.baseUrl + '/Tenant/GetList?pgId='+pgId);

    };
});