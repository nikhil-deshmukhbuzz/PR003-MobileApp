var app = angular.module('np-module', ['ngMaterial', 'ngRoute', 'ngMessages']);

app.controller('npCTRL', function ($scope,$rootScope, $location,$routeParams,coreService,noticeperiodService,roomService,tenantService) {
    
    $rootScope.toolbar_name = 'Notice Period';
    if(coreService.getMasters() != null){
        $rootScope.listOfTenant = coreService.getMasters().NoticePeriods;
        $rootScope.room = coreService.getMasters().Rooms;
        $rootScope.tenant = coreService.getMasters().Tenants;
        $rootScope.tenantList = coreService.getMasters().Tenants;
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
        $location.path('/noticeperiod/0');
    }
    
    $scope.initialize = function(){
        ddlRoom();
        ddlTenant(0);
        if($rootScope.listOfTenant == undefined || $rootScope.listOfTenant == null){
            coreService.showInd();
            noticeperiodService.getList(coreService.getPGID())
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
        if($rootScope.room == undefined || $rootScope.room == null){
            roomService.getList(coreService.getPGID())
            .then(function (response) {
                $rootScope.room = response.data;
            }, function (err) {
                console.log(err.data);
            });
        }
    };

    var ddlTenant = function(id){
        if($rootScope.tenant == undefined || $rootScope.tenant == null){
            tenantService.getList(coreService.getPGID())
            .then(function (response) {
                    $rootScope.tenant = response.data;
                    $rootScope.tenantList = response.data;
                
            }, function (err) {
                console.log(err.data);
            });
        }
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
                $rootScope.listOfTenant = null;
                coreService.setMastersToNull();
                coreService.setMasters();
                coreService.hideInd();
                coreService.showToast(coreService.message.updated);
                $location.path('/noticeperiod');
            }, function (err) {
                coreService.hideInd();
                console.log(err.data);
            });
    };

    $scope.checkout = function(){
        coreService.showInd();
        $scope.oTenant.PGID = coreService.getPGID();
        noticeperiodService.checkout($scope.oTenant)
            .then(function (response) {
                $rootScope.listOfTenant = null;
                coreService.setMastersToNull();
                coreService.setMasters();
                coreService.hideInd();
                coreService.showToast(coreService.message.updated);
                $location.path('/noticeperiod');
            }, function (err) {
                coreService.hideInd();
                console.log(err.data);
            });
    };
});