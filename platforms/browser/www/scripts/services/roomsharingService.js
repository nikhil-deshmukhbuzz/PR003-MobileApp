var serv = angular.module('roomsharing-service', []);
serv.service('roomsharingService', function ($http, config) {

    this.add = function (roomSharing) {
        return $http.post(config.baseUrl + '/RoomSharing',roomSharing);

    };

    this.update = function (roomSharing) {
        return $http.post(config.baseUrl + '/RoomSharing/Update',roomSharing);

    };

    this.getList = function (pgId) {
        return $http.get(config.baseUrl + '/RoomSharing/GetList?pgId='+pgId);

    };
});