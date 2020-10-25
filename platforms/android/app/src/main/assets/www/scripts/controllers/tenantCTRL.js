var app = angular.module('tenant-module', ['ngMaterial', 'ngRoute', 'ngMessages']);

app.controller('tenantCTRL', function ($scope,$rootScope, $location,$routeParams,coreService,tenantService,roomService) {

    $rootScope.toolbar_name = 'Tenant';
    if(coreService.getMasters() != null){
        $rootScope.listOfTenant = coreService.getMasters().Tenants;
        $rootScope.room = coreService.getMasters().Rooms;
    }
    
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
        $location.path('/tenant/0');
    }
    
    $scope.initialize = function(){
        ddlRoom();
        if($rootScope.room == undefined || $rootScope.room == null){
            coreService.showInd();
            tenantService.getList(coreService.getPGID())
                .then(function (response) {
                    coreService.hideInd();
                    $rootScope.listOfTenant = response.data;
                }, function (err) {
                    coreService.hideInd();
                    console.log(err.data);
            });
        }
    };

    var ddlRoom = function(){
        if($rootScope.listOfTenant == undefined || $rootScope.listOfTenant == null){
            roomService.getList(coreService.getPGID())
            .then(function (response) {
                $rootScope.room = response.data;
            }, function (err) {
                console.log(err.data);
            });
        }
    };

    $scope.roomNoChangedEvent = function(data){
        $scope.oTenant.RentAmount = data.RentAmount;
        $scope.oTenant.DepositAmount = data.DepositAmount;
    };

    $scope.edit = function(id){
        $location.path('/tenant/'+id);
    };

    $scope.cancel = function(){
        $location.path('/tenant');
    };

    $scope.submit = function(){
        if($scope.oTenant.TenantID == 0)
        {
            coreService.showInd();
            $scope.oTenant.PGID = coreService.getPGID();
            tenantService.add($scope.oTenant)
                .then(function (response) {
                    $rootScope.listOfTenant = null;
                    coreService.setMastersToNull();
                    coreService.setMasters();
                    coreService.hideInd();
                    coreService.showToast(coreService.message.added);
                    $location.path('/tenant');
                }, function (err) {
                    coreService.hideInd();
                    console.log(err.data);
            });
        }
        else{
            coreService.showInd();
            $scope.oTenant.PGID = coreService.getPGID();
            tenantService.update($scope.oTenant)
                .then(function (response) {
                    coreService.setMastersToNull();
                    coreService.setMasters();
                    coreService.hideInd();
                    coreService.showToast(coreService.message.updated);
                    $location.path('/tenant');
                }, function (err) {
                    coreService.hideInd();
                    console.log(err.data);
            });
        }
    };
});