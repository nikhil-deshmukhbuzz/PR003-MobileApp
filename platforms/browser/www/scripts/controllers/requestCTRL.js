var app = angular.module('request-module', ['ngMaterial', 'ngRoute', 'ngMessages']);

app.controller('requestCTRL', function ($scope,$rootScope, $location,coreService,requestService) {

    $rootScope.toolbar_name = 'Request';
    
    $scope.initialize = function(){

        coreService.showInd();
        requestService.registrationList()
            .then(function (response) {
                coreService.hideInd();
                $scope.listOfRegistration = response.data;
            }, function (err) {
                coreService.hideInd();
                console.log(err.data);
            });
    };

    $scope.activation =function(registration){

        var r = confirm("Are you Sure!");
        if (r == true) {
            coreService.showInd();
            requestService.activation(registration)
            .then(function (response) {
                coreService.hideInd();
                $scope.initialize();
            }, function (err) {
                coreService.hideInd();
                console.log(err.data);
            });
        } 
    };
});