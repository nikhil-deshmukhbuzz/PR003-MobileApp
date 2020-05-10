var app = angular.module('home-module', ['ngMaterial', 'ngRoute', 'ngMessages']);

app.controller('homeCTRL', function ($scope,$rootScope,$mdSidenav, $location,coreService,dashboardService) {

    if($mdSidenav('left').isOpen())
        $scope.toggleLeft();

    $scope.initialize = function(){
        dashboardPgOwner();
    };

    var showDashboardDetails = function(ch){
        switch(ch){
            case 'isAvailableBed':
                $scope.isAvailableBed = true;
                $scope.isDueRent = false;
                $scope.isOnNotice = false;
                $scope.isIssue = false;
                break;
            case 'isDueRent':
                $scope.isAvailableBed = false;
                $scope.isDueRent = true;
                $scope.isOnNotice = false;
                $scope.isIssue = false;
                break;
            case 'isOnNotice':
                $scope.isAvailableBed = false;
                $scope.isDueRent = false;
                $scope.isOnNotice = true;
                $scope.isIssue = false;
                break;
            case 'isIssue':
                $scope.isAvailableBed = false;
                $scope.isDueRent = false;
                $scope.isOnNotice = false;
                $scope.isIssue = true;
                break;
            break;

        }
    };


    var dashboardPgOwner = function(){
        dashboardService.pgOwner(coreService.getPGID())
        .then(function (response) {
            coreService.hideInd();
            $scope.dashboard = response.data;
            $scope.availableBedClk();
        }, function (err) {
            coreService.hideInd();
            console.log(err.data);
        });
    };

    $scope.availableBedClk = function(){
        showDashboardDetails('isAvailableBed');
        $scope.bedAvailable = $scope.dashboard.BedAvailable;
    };

    $scope.dueRentClk = function(){
        showDashboardDetails('isDueRent');
        $scope.dueRent = $scope.dashboard.DueRent;
    };

    $scope.onNoticeClk = function(){
        showDashboardDetails('isOnNotice');
        $scope.notice = $scope.dashboard.OnNotice;
    };
});