var serv = angular.module('notification-service', []);
serv.service('notificationService', function ($http, config) {

    this.getTenantList = function (tenantId) {
        return $http.get(config.baseUrl + '/Notification/GetTenantList?tenantId='+tenantId);

    };

    this.getPGList = function (pgId) {
        return $http.get(config.baseUrl + '/Notification/GetPGList?pgId='+pgId);

    };

});