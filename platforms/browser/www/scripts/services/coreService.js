﻿var serv = angular.module('core-service', []);
serv.constant('config', {
    baseUrl: 'http://localhost:64432/api/Mobile',
    //payUrl: 'http://localhost:58803/api'
    //baseUrl: 'https://eymh4odut4.execute-api.ap-south-1.amazonaws.com/Prod/api/Mobile',
     payUrl: 'https://pess1g5cy5.execute-api.ap-south-1.amazonaws.com/Prod/api'
});
serv.service('coreService', function ($http, $rootScope, $timeout,$mdToast,config) {

    this.showToast = function(msg){
        $mdToast.show(
        $mdToast.simple()
        .textContent(msg)
        .position('bottom center')
        .hideDelay(3000))
      .then(function() {
       
      }).catch(function() {
        console.log('Toast failed or was forced to close early by another toast.');
      });
    }
    this.message = {
        alreadyRegistered: 'user already registered',
        registered: 'successfully added',
        added: 'successfully added',
        userNotExists: 'user not exists',
        updated: 'successfully updated',
        passwordchanged: 'password changed successfully',
        deleted: 'successfully deleted',
        licenceExceed: 'selected product licence exceed',
        limitExceed: 'Maximum limit exceed',
        outOfStock: 'Out of stock',
        error: 'please contact to administrator due to error in application',
        wrong: 'something went wrong',
        defaultSetting: 'default setting updated successfully'
    };

    this.hideInd = function () {
        $rootScope.isProgress = false;
       // document.getElementById("overlay").style.display = "none";
    };

    this.showInd = function () {
        $rootScope.isProgress = true;
       // document.getElementById("overlay").style.display = "block";
    };

    this.success = function (msg) {
        $rootScope.successMsg = msg;
        $rootScope.success = true;
        $timeout(function () {
            $rootScope.success = false;
        }, 5000);
    };

    this.error = function (msg) {
        $rootScope.errorMsg = msg;
        $rootScope.error = true;
        $timeout(function () {
            $rootScope.error = false;
        }, 5000);
    };

    this.setHostURL= function (data) {
        localStorage.HostURL = angular.toJson(data);
    };
    
    this.getHostURL = function () {
        return angular.fromJson(localStorage.HostURL);
    };

    this.setPaymentStatusPaid= function (data) {
        localStorage.PaymentStatusPaid = angular.toJson(data);
    };
    
    this.getPaymentStatusPaid = function () {
        return angular.fromJson(localStorage.PaymentStatusPaid);
    };


    this.setMobileNo = function (data) {
        localStorage.MobileNo = angular.toJson(data);
    };

    this.getMobileNo = function () {
        return angular.fromJson(localStorage.MobileNo);
    };

    this.setMenu = function (data) {
        localStorage.Menu = angular.toJson(data);
    };

    this.getMenu = function () {
        return angular.fromJson(localStorage.Menu);
    };

    this.setPGID = function (data) {
        localStorage.pgID = angular.toJson(data);
    };

    this.getPGID = function () {
        return angular.fromJson(localStorage.pgID);
    };

    this.setPG = function (data) {
        localStorage.PG = angular.toJson(data);
    };

    this.getPG = function () {
        return angular.fromJson(localStorage.PG);
    };

    this.setUser = function (data) {
        localStorage.User = angular.toJson(data);
    };

    this.getUser = function () {
        return angular.fromJson(localStorage.User);
    };

    this.setUserManagement = function (data) {
        localStorage.UserManagement = angular.toJson(data);
    };

    this.getUserManagement = function () {
        return angular.fromJson(localStorage.UserManagement);
    };

    this.setCoOrdinatorID = function (data) {
        localStorage.CoOrdinatorID = angular.toJson(data);
    };

    this.getCoOrdinatorID = function () {
        return angular.fromJson(localStorage.CoOrdinatorID);
    };

    this.setTenant = function (data) {
        localStorage.Tenant = angular.toJson(data);
    };

    this.getTenant = function () {
        return angular.fromJson(localStorage.Tenant);
    };

    this.setTenants = function (data) {
        localStorage.Tenants = angular.toJson(data);
    };

    this.getTenants = function () {
        return angular.fromJson(localStorage.Tenants);
    };


    this.validateUser = function (parentMenu, subMenu) {
        var menuList = this.getMenu();
        var isValid = false;

        if (menuList !== undefined) {
            var menu = $.grep(menuList, function (a) { return a.MenuName === parentMenu; })[0];

            if (menu !== null) {
                for (var i = 0; i < menu.Menu.length; i++) {
                    if (subMenu === menu.Menu[i].MenuName) {
                        isValid = true;
                    }
                }
            }
        }
        if (isValid)
            return isValid;
        else
            window.location.href = 'login.html';
    };

    this.logout = function () {
        localStorage.clear();
        window.location.href = 'login.html';
    };

    this.setMasters = function(){
        $http.get(config.baseUrl + '/Master/Load?pgId=' + this.getPGID())
        .then(function (response) {
            localStorage.Masters = angular.toJson(response.data);
        }, function (err) { 
        });
    };

    this.setMastersToNull = function(){
        localStorage.Masters = null;
    };

    this.getMasters = function(){
        return angular.fromJson(localStorage.Masters);
    };

});

serv.directive('onlyDigits', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    var digits = val.replace(/[^0-9]/g, '');

                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseInt(digits, 10);
                }
                return undefined;
            }
            ctrl.$parsers.push(inputValue);
        }
    };
});


serv.filter('INR', function () {
    return function (input) {
        if (!isNaN(input)) {
            //var output = Number(input).toLocaleString('en-IN');   <-- This method is not working fine in all browsers!           
            var result = input.toString().split('.');

            var lastThree = result[0].substring(result[0].length - 3);
            var otherNumbers = result[0].substring(0, result[0].length - 3);
            if (otherNumbers != '')
                lastThree = ',' + lastThree;
            var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

            if (result.length > 1) {
                output += "." + result[1];
            }

            return output;
        }
    }
});