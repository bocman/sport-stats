'use strict';

/* Controllers */
var stats = angular.module('stats.controllers', []);
stats.controller('driversStandingsController', ['$scope', 'ergastAPIservice' , function ($scope,ergastAPIservice) {

    $scope.driversList = [];
    $scope.searchFilter = function (driver) {
    var keyword = new RegExp($scope.nameFilter, 'i');
    return !$scope.nameFilter || keyword.test(driver.Driver.givenName) || keyword.test(driver.Driver.familyName);
};
    
    $scope.nameFilter = null;
    $scope.flags = {};
	
	ergastAPIservice.getDrivers().success(function (response) {
        $scope.driversList = response.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    });
      
    
}]);

stats.controller('driverDetailsController', ['$scope', '$routeParams', 'ergastAPIservice', function ($scope, $routeParams, ergastAPIservice) {
    $scope.id = $routeParams.id;
    $scope.races = [];
    $scope.driver = null;

    ergastAPIservice.getDriverDetails($scope.id).success(function (response) {
        $scope.driver = response.MRData.StandingsTable.StandingsLists[0].DriverStandings[0]; 
    });

    ergastAPIservice.getDriverRaces($scope.id).success(function (response) {
        $scope.races = response.MRData.RaceTable.Races; 
    });
}]);

stats.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/drivers', {templateUrl: 'partials/driversstandings.html', controller: 'driversStandingsController'});
  $routeProvider.when('/', {templateUrl: 'partials/driversstandings.html', controller: 'driversStandingsController'});
  $routeProvider.when("/drivers/:id", {templateUrl: "partials/driver.html", controller: "driverDetailsController"});
  $routeProvider.otherwise({redirectTo: '/f1.html'});
}]);





