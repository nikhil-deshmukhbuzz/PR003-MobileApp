var app = angular.module('receipt-module', ['ngMaterial', 'ngRoute', 'ngMessages']);

app.controller('receiptCTRL', function ($scope,$rootScope,$location,coreService,rentService) {

    $rootScope.toolbar_name = 'Receipt';
    var tenant = coreService.getTenant();
    var pg = coreService.getTenant().PG;


    $scope.initialize = function() {
        coreService.showInd();
        rentService.getTenantReceipts(tenant.TenantID,pg.PGID)
        .then(function (response) {
            coreService.hideInd();
            $scope.listOfReceipt = response.data;
        }, function (err) {
            coreService.hideInd();
            console.log(err.data);
        });
    }
 
});