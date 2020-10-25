var app = angular.module('notification-module', ['ngMaterial', 'ngRoute', 'ngMessages']);

app.controller('notificationCTRL', function ($scope,$mdSidenav,$rootScope,coreService,notificationService) {

    if($mdSidenav('left').isOpen())
        $scope.toggleLeft();

    $rootScope.toolbar_name = 'Notification';

    $scope.initialize = function() {
        var profile = coreService.getUser().ProfileMaster.ProfileName;
        if(profile == 'PGOwner'){
            coreService.showInd();
            notificationService.getPGList(coreService.getPGID())
            .then(function (response) {
                coreService.hideInd();
                $scope.listOfNotiication = response.data;
            }, function (err) {
                coreService.hideInd();
                console.log(err.data);
            });
        }
            
        else  if(profile == 'Tenant'){
            coreService.showInd();
            notificationService.getTenantList(coreService.getTenant().TenantID)
            .then(function (response) {
                coreService.hideInd();
                $scope.listOfNotiication = response.data;
            }, function (err) {
                coreService.hideInd();
                console.log(err.data);
            });
        }

   
    }
 
});