var app = angular.module('room-module', ['ngMaterial', 'ngRoute', 'ngMessages']);

app.controller('roomCTRL', function ($scope,$rootScope, $location,$routeParams,coreService,roomService,roomsharingService) {

    $rootScope.toolbar_name = 'Room';
    if(coreService.getMasters() != null){
        $rootScope.listOfRoom = coreService.getMasters().Rooms;
        $rootScope.roomSharing = coreService.getMasters().RoomSharings;
    }

    if($routeParams.id != undefined){
        
        if($routeParams.id != 0){
            //edit
            $scope.headline = 'EDIT'
            var obj =  $.grep($rootScope.listOfRoom, function (a) { return a.RoomID === parseInt($routeParams.id); });
            $scope.oRoom = obj[0];
        }
        else{
             //add
             $scope.headline = 'ADD'
            $scope.oRoom  = {};
            $scope.oRoom.RoomID  = 0;
            $scope.oRoom.IsActive = true;
        }
    }


    $scope.add = function(){
        $location.path('/room/0');
    }
    
    $scope.initialize = function(){
        ddlRoomSharing();
        if($rootScope.listOfRoom == undefined || $rootScope.listOfRoom == null){
            coreService.showInd();
            roomService.getList(coreService.getPGID())
                .then(function (response) {
                    coreService.hideInd();
                    $rootScope.listOfRoom = response.data;
                }, function (err) {
                    coreService.hideInd();
                    console.log(err.data);
            });
        }
    };

    var ddlRoomSharing = function(){
        if($rootScope.roomSharing == undefined || $rootScope.roomSharing == null){
            roomsharingService.getList(coreService.getPGID())
            .then(function (response) {
                $rootScope.roomSharing = response.data;
            }, function (err) {
                console.log(err.data);
            });
        }
    };

    $scope.edit = function(id){
        $location.path('/room/'+id);
    };

    $scope.cancel = function(){
        $location.path('/room');
    };

    $scope.submit = function(){
        if($scope.oRoom.RoomID == 0)
        {
            coreService.showInd();
            $scope.oRoom.PGID = coreService.getPGID();
            roomService.add($scope.oRoom)
                .then(function (response) {
                    $rootScope.listOfRoom = null;
                    coreService.setMastersToNull();
                    coreService.setMasters();
                    coreService.hideInd();
                    coreService.showToast(coreService.message.added);
                    $location.path('/room');
                }, function (err) {
                    coreService.hideInd();
                    console.log(err.data);
            });
        }
        else{
            coreService.showInd();
            $scope.oRoom.PGID = coreService.getPGID();
            roomService.update($scope.oRoom)
                    .then(function (response) {
                        $rootScope.listOfRoom = null;
                        coreService.setMastersToNull();
                        coreService.setMasters();
                        coreService.hideInd();
                        coreService.showToast(coreService.message.updated);
                        $location.path('/room');
                    }, function (err) {
                        coreService.hideInd();
                        console.log(err.data);
                });
        }
    };
});