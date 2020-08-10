var serv = angular.module('noticeperiod-service', []);
serv.service('noticeperiodService', function ($http, config) {

    this.cancellation = function (noticePeriod) {
        return $http.post(config.baseUrl + '/NoticePeriod/Cancellation',noticePeriod);

    };

    this.update = function (noticePeriod) {
        return $http.post(config.baseUrl + '/NoticePeriod/Update',noticePeriod);

    };

    this.checkout = function (noticePeriod) {
        return $http.post(config.baseUrl + '/NoticePeriod/Checkout',noticePeriod);

    };

    this.getList = function (pgId) {
        return $http.get(config.baseUrl + '/NoticePeriod/GetList?pgId='+pgId);

    };
});