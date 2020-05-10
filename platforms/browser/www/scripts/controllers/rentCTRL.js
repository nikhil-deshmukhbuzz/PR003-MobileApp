var app = angular.module('rent-module', ['ngMaterial', 'ngRoute', 'ngMessages']);

app.controller('rentCTRL', function ($scope,$rootScope, $location,$routeParams,coreService,rentService,tenantService) {

    $scope.isEditable = false;
    $scope.isPaid = false;
    $scope.oRentFilter = {};

    if($routeParams.id != undefined){
        
        if($routeParams.id != 0){
            //edit
        $scope.isEditable = true;
        var obj =  $.grep($rootScope.listOfRent, function (a) { return a.RentID === parseInt($routeParams.id); });
        $scope.oRent = obj[0];

        if($scope.oRent.PaymentStatus.Status == 'Paid'){
            $scope.isPaid = true;
        }
        }
        else{
             //add
             $scope.isEditable = false;
            $scope.oRent  = {};
            $scope.oRent.RentID  = 0;
        }
    }

    $scope.add = function(){
        $location.path('/rent/0');
    }

    $scope.search = function(){
        coreService.showInd();
        rentService.getFilterList(coreService.getPGID(),$scope.oRentFilter.MonthID,$scope.oRentFilter.Year)
            .then(function (response) {
                coreService.hideInd();
                $rootScope.listOfRent = response.data;
            }, function (err) {
                coreService.hideInd();
                console.log(err.data);
        });
    };
    
    $scope.initialize = function(){
        ddlTenant();
        ddlYear();
        ddlPaymentStatus();

        coreService.showInd();
        rentService.getList(coreService.getPGID())
            .then(function (response) {
                coreService.hideInd();
                $rootScope.listOfRent = response.data;
            }, function (err) {
                coreService.hideInd();
                console.log(err.data);
        });
    };

    var ddlTenant = function(id){
        tenantService.getList(coreService.getPGID())
        .then(function (response) {
                $rootScope.tenant = response.data;
        }, function (err) {
            console.log(err.data);
        });
    };

    var ddlYear = function(){
        $rootScope.year = [];
        $rootScope.yearF = [];
        for(var i=2020; i<= new Date().getFullYear(); i++){
            $rootScope.year.push(i);
            $rootScope.yearF.push(i);
        }        
        $scope.oRentFilter.Year = new Date().getFullYear();
        $scope.oRentFilter.MonthID = new Date().getMonth() + 1;
    };

    var ddlPaymentStatus = function(){
        rentService.getPaymentStatus()
        .then(function (response) {
                $rootScope.payment = response.data;
        }, function (err) {
            console.log(err.data);
        });
    };

    $scope.edit = function(id){
        $location.path('/rent/'+id);
    };

    $scope.cancel = function(){
        $location.path('/rent');
    };

    $scope.submit = function(){
        if($scope.oRent.RentID == 0)
        {
            // coreService.showInd();
            // $scope.oRent.PGID = coreService.getPGID();
            // rentService.add($scope.oRent)
            //     .then(function (response) {
            //         coreService.hideInd();
            //         coreService.showToast(coreService.message.added);
            //         $location.path('/rent');
            //     }, function (err) {
            //         coreService.hideInd();
            //         console.log(err.data);
            // });
        }
        else{
            coreService.showInd();
            $scope.oRent.PGID = coreService.getPGID();
            rentService.update($scope.oRent)
                    .then(function (response) {
                        coreService.hideInd();
                        coreService.showToast(coreService.message.updated);
                        $location.path('/rent');
                    }, function (err) {
                        coreService.hideInd();
                        console.log(err.data);
                });
        }
    };
});