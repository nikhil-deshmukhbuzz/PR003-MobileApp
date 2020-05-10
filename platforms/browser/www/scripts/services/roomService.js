var serv = angular.module('room-service', []);
serv.service('roomService', function ($http, config) {

    this.add = function (room) {
        return $http.post(config.baseUrl + '/Room',room);

    };

    this.update = function (room) {
        return $http.post(config.baseUrl + '/Room/Update',room);

    };

    this.getList = function (pgId) {
        return $http.get(config.baseUrl + '/Room/GetList?pgId='+pgId);

    };
});