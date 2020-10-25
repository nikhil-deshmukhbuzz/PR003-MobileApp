var app = angular.module('schedular-module', ['ngMaterial', 'ngRoute', 'ngMessages']);

app.controller('schedularCTRL', function ($scope,$rootScope, $location,$routeParams,coreService,schedularService) {

    $scope.sendEmailToPG = function(){
        coreService.showInd();
        schedularService.sendEmailToPG()
        .then(function (response) {
            coreService.hideInd();
            coreService.showToast('sent mail to pg completed');
        }, function (err) {
            coreService.hideInd();
            console.log(err.data);
        });
    };

    $scope.save_monthly_rentDetails_XL = function(){
        coreService.showInd();
        schedularService.save_monthly_rentDetails_XL()
        .then(function (response) {
            coreService.hideInd();
            coreService.showToast('saving monthly excel completed');
        }, function (err) {
            coreService.hideInd();
            console.log(err.data);
        });
    };

    $scope.rentCalculation = function(){
        coreService.showInd();
        schedularService.rentCalculation()
        .then(function (response) {
            coreService.hideInd();
            coreService.showToast('rent calculation completed');
        }, function (err) {
            coreService.hideInd();
            console.log(err.data);
        });
    };
});