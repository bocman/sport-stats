'use strict';

/* Controllers */
var stats = angular.module('stats.controllers', []);
stats.controller('driversStandingsController', ['$scope', function ($scope) {
    $scope.driversList = [
      
    ];
}]);

stats.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/drivers', {templateUrl: 'partials/driversStandings.html', controller: 'driversStandingsController'});
  $routeProvider.when('/', {templateUrl: 'partials/driversStandings.html', controller: 'driversStandingsController'});
  $routeProvider.otherwise({redirectTo: '/f1.html'});
}]);





