'use strict';


// Declare app level module which depends on filters, and services
angular.module('stats', [
  'ngRoute',
  'stats.filters',
  'stats.services',
  'stats.directives',
  'stats.controllers'
]).config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/drivers', {templateUrl: 'partials/driversStandings.html', controller: 'driversStandingsController'});
  $routeProvider.otherwise({redirectTo: '/f1.html'});
}]);