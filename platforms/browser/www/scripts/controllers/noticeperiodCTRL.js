var app = angular.module('noticeperiod-module', ['ngMaterial', 'ngRoute', 'ngMessages']);

app.controller('noticeperiodCTRL', function ($scope,$rootScope, $location,$routeParams,coreService,noticeperiodService,roomService,tenantService) {

    if($routeParams.id != undefined){
        
        if($routeParams.id != 0){
            //edit
            $scope.headline = 'EDIT'
            $scope.isEdit = true;
            var obj =  $.grep($rootScope.listOfTenant, function (a) { return a.TenantID === parseInt($routeParams.id); });
            $scope.oTenant = obj[0];
        }
        else{
             //add
             $scope.headline = 'ADD'
            $scope.isEdit = false;
            $scope.oTenant  = {};
            $scope.oTenant.TenantID  = 0;
        }
    }

    $scope.add = function(){
        $location.path('/noticeperiod/0');
    }
    
    $scope.initialize = function(){
        ddlRoom();
        ddlTenant(0);
        coreService.showInd();
        noticeperiodService.getList(coreService.getPGID())
            .then(function (response) {
                coreService.hideInd();
                $rootScope.listOfTenant = response.data;
            }, function (err) {
                coreService.hideInd();
                console.log(err.data);
        });
    };

    var ddlRoom = function(){
        roomService.getList(coreService.getPGID())
        .then(function (response) {
            $rootScope.room = response.data;
        }, function (err) {
            console.log(err.data);
        });
    };

    var ddlTenant = function(id){
        tenantService.getList(coreService.getPGID())
        .then(function (response) {
                $rootScope.tenant = response.data;
                $rootScope.tenantList = response.data;
            
        }, function (err) {
            console.log(err.data);
        });
    };

    $scope.roomNoChangedEvent = function(data){
        $rootScope.tenant =  $.grep($rootScope.tenantList, function (a) { return a.RoomID === data.RoomID; }); 
    };

    $scope.edit = function(id){
        $location.path('/noticeperiod/'+id);
    };

    $scope.cancel = function(){
        $location.path('/noticeperiod');
    };

    $scope.submit = function(){

        coreService.showInd();
        $scope.oTenant.PGID = coreService.getPGID();
        noticeperiodService.update($scope.oTenant)
                .then(function (response) {
                    coreService.hideInd();
                    coreService.showToast(coreService.message.updated);
                    $location.path('/noticeperiod');
                }, function (err) {
                    coreService.hideInd();
                    console.log(err.data);
            });
    };
});