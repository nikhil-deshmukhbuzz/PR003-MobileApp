var app = angular.module('roomsharing-module', ['ngMaterial', 'ngRoute', 'ngMessages']);

app.controller('roomsharingCTRL', function ($scope,$rootScope, $location,$routeParams,coreService,roomsharingService) {

   

    if($routeParams.id != undefined){
        
        if($routeParams.id != 0){
            //edit
        console.log('id: '+ $routeParams.id);
        var obj =  $.grep($rootScope.listOfRoomSharing, function (a) { return a.RoomSharingID === parseInt($routeParams.id); });
        $scope.oRoomSharing = obj[0];
        }
        else{
            $scope.oRoomSharing  = {};
            $scope.oRoomSharing.RoomSharingID  = 0;
            //add
        }
    }

    $scope.add = function(){
        $location.path('/roomsharing/0');
    }
    
    $scope.initialize = function(){
        coreService.showInd();
        roomsharingService.getList(coreService.getPGID())
            .then(function (response) {
                coreService.hideInd();
                $rootScope.listOfRoomSharing = response.data;
            }, function (err) {
                coreService.hideInd();
                console.log(err.data);
        });
    };

    $scope.edit = function(id){
        $location.path('/roomsharing/'+id);
    }

    $scope.cancel = function(){
        $location.path('/roomsharing');
    }

    $scope.submit = function(){
        if($scope.oRoomSharing.RoomSharingID == 0)
        {
        coreService.showInd();
        $scope.oRoomSharing.PGID = coreService.getPGID();
        roomsharingService.add($scope.oRoomSharing)
                .then(function (response) {
                    coreService.hideInd();
                    coreService.showToast(coreService.message.added);
                    $location.path('/roomsharing');
                }, function (err) {
                    coreService.hideInd();
                    console.log(err.data);
            });
        }
        else{
            coreService.showInd();
            $scope.oRoomSharing.PGID = coreService.getPGID();
            roomsharingService.update($scope.oRoomSharing)
                    .then(function (response) {
                        coreService.hideInd();
                        coreService.showToast(coreService.message.updated);
                        $location.path('/roomsharing');
                    }, function (err) {
                        coreService.hideInd();
                        console.log(err.data);
                });
        }
    };
});