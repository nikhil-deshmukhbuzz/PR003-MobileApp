var app = angular.module('home-module', ['ngMaterial', 'ngRoute', 'ngMessages']);

app.controller('homeCTRL', function ($scope,$rootScope,$mdSidenav, $location,coreService,dashboardService) {

    $rootScope.toolbar_name = 'Dashboard';

    if($mdSidenav('left').isOpen())
        $scope.toggleLeft();

    $scope.vDashboardPGOwner = false;
    $scope.vDashboardPTenant = false;
    $scope.vDashboardAdmin = false;    

    $scope.initialize = function(){
        var profile = coreService.getUser().ProfileMaster.ProfileName;
        if(profile == 'PGOwner'){
            $scope.vDashboardPGOwner = true;

            if(coreService.getMasters() != null){
                $scope.dashboard = coreService.getMasters().PGOwnerDashboard;
                showDashboardDetails('isAvailableBed');
                $scope.bedAvailable = $scope.dashboard.BedAvailable;
            }
            else{
                dashboardPgOwner();
            }
        }
            
        else  if(profile == 'Tenant'){
            $scope.vDashboardPTenant = true;
            dashboardTenant();
        }
           
        else{
            $scope.vDashboardAdmin = true;
            dashboardAdmin();  
        }
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
            case 'isTotalPG':
                $scope.isPgs = true;
                $scope.isActivePgs = false;
                $scope.isInActivePgs = false;
                $scope.isIssue = true;
                break;
            case 'isActivePG':
                $scope.isPgs = false;
                $scope.isActivePgs = true;
                $scope.isInActivePgs = false;
                $scope.isIssue = true;
            break;
            case 'isInActivePG':
                $scope.isPgs = false;
                $scope.isActivePgs = false;
                $scope.isInActivePgs = true;
                $scope.isIssue = true;
            break;
        }
    };


    var dashboardPgOwner = function(){
        if($scope.dashboard == undefined || $scope.dashboard == null){
            dashboardService.pgOwner(coreService.getPGID())
            .then(function (response) {
                coreService.hideInd();
                $scope.dashboard = response.data;
                $scope.availableBedClk();
            }, function (err) {
                coreService.hideInd();
                console.log(err.data);
            });
        }
    };

    var dashboardTenant = function(){
       $scope.tenant = coreService.getTenant();
       $scope.pg = coreService.getTenant().PG;
    };

    var dashboardAdmin = function(){
        if($scope.dashboard == undefined || $scope.dashboard == null){
            dashboardService.admin()
            .then(function (response) {
                coreService.hideInd();
                $scope.dashboard = response.data;
                $scope.pgClk();
            }, function (err) {
                coreService.hideInd();
                console.log(err.data);
            });
        }
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

    $scope.pgClk = function(){
        showDashboardDetails('isTotalPG');
        $scope.pgs = $scope.dashboard.PGs;
    };

    $scope.activePgClk = function(){
        showDashboardDetails('isActivePG');
        $scope.activePgs = $scope.dashboard.ActivePGs;
    };

    $scope.inActivePgClk = function(){
        showDashboardDetails('isInActivePG');
        $scope.inActivePgs = $scope.dashboard.InActivePGs;
    };
});