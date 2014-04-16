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

stats.controller('teamsStandingsController', ['$scope', 'ergastAPIservice' , function ($scope,ergastAPIservice) {
        $scope.teamsList = [];
        $scope.nameFilter = null;
        $scope.flags = {};
        $scope.searchFilter = function (team) {
        var keyword = new RegExp($scope.nameFilter, 'i');
        return !$scope.nameFilter || keyword.test(team.Constructor.name);
        };
        
        ergastAPIservice.getTeams().success(function (response) {
        $scope.teamsList = response.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    });
    
}]);

stats.controller('racesController', ['$scope', 'ergastAPIservice', function ($scope,ergastAPIservice) {
        $scope.racesList = [];

        $scope.nameFilter = null;
        $scope.flags = {};
        $scope.searchFilter = function (race) {
        var keyword = new RegExp($scope.nameFilter, 'i');
        return !$scope.nameFilter || keyword.test(race.Circuit.circuitName) || keyword.test(race.raceName) || keyword.test(race.Results[0].Driver.givenName) || keyword.test(race.Results[0].Driver.familyName) ;
        };



        ergastAPIservice.getRaces().success(function(response){
        $scope.racesList = response.MRData.RaceTable.Races;

        });
}]);

stats.controller('racesQualyResultsController', ['$scope', '$routeParams' ,'ergastAPIservice', function ($scope,$routeParams,ergastAPIservice) {
        $scope.qualyResults = [];
        $scope.raceResults = [];
        $scope.round = $routeParams.round;
        
        ergastAPIservice.getRaceQualyResults($scope.round).success(function (response){
        $scope.qualyResults = response.MRData.RaceTable.Races[0].QualifyingResults;
        });

        ergastAPIservice.getRaceResults($scope.round).success(function (response){
        $scope.raceResults = response.MRData.RaceTable.Races[0].Results;
        });
}]);


stats.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/drivers', {templateUrl: 'partials/driversstandings.html', controller: 'driversStandingsController'});
  $routeProvider.when('/', {templateUrl: 'partials/driversstandings.html', controller: 'driversStandingsController'});
  $routeProvider.when("/drivers/:id", {templateUrl: "partials/driver.html", controller: "driverDetailsController"});
  $routeProvider.when('/teams', {templateUrl: 'partials/teamsstandings.html', controller: 'teamsStandingsController'});
  $routeProvider.when('/races', {templateUrl: 'partials/races.html', controller: 'racesController' });
  $routeProvider.when('/races/:round', {templateUrl: 'partials/results.html', controller: 'racesQualyResultsController' });
  $routeProvider.otherwise({redirectTo: '/f1.html'});
}]);




