'use strict';

/* Controllers */
var stats = angular.module('stats.controllers', []);
stats.controller('driversStandingsController', ['$scope', 'ergastAPIservice' , function ($scope,ergastAPIservice) {

    $scope.driversList = [];
    var chartData=[];
    $scope.colors = [
        "#FF0F00", "#FF6600", "#FF9E01", "#FCD202", "#F8FF01", "#B0DE09", "#04D215", "#0D8ECF", "#0D52D1",
        "#2A0CD0", "#8A0CCF", "#CD0D74", "#754DEB", "#DDDDDD", "#999999", "#333333", "#000000", "#000000",
        "#000000", "#000000", "#000000", "#000000", "#000000"
    ];
    $scope.searchFilter = function (driver) {
    var keyword = new RegExp($scope.nameFilter, 'i');
    return !$scope.nameFilter || keyword.test(driver.Driver.givenName) || keyword.test(driver.Driver.familyName) || keyword.test(driver.Constructors[0].name);
};
    
    $scope.nameFilter = null;
    $scope.flags = {};
    
    ergastAPIservice.getDrivers().success(function (response) {
        $scope.driversList = response.MRData.StandingsTable.StandingsLists[0].DriverStandings;

        for(var i=0; i<$scope.driversList.length; i++){
            var driver = {
                driverName : $scope.driversList[i].Driver.givenName + " " + $scope.driversList[i].Driver.familyName,
                points : $scope.driversList[i].points
            };
            chartData.push(driver);
        }

        for(var j=0; j<chartData.length; j++){
            chartData[j].color = $scope.colors[j];
        }
    });



     
    
}]);

stats.controller('driverDetailsController', ['$scope', '$routeParams', 'ergastAPIservice', function ($scope, $routeParams, ergastAPIservice) {
    $scope.id = $routeParams.id;
    $scope.races = [];
    $scope.driver = null;

    $scope.searchFilter = function (race) {
    var keyword = new RegExp($scope.nameFilter, 'i');
    return !$scope.nameFilter || keyword.test(race.Circuit.circuitName) || keyword.test(race.raceName);
};
    
    $scope.nameFilter = null;
    $scope.flags = {};

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

        $scope.nameFilter = null;
        $scope.flags = {};
        $scope.searchFilter = function (result) {
        var keyword = new RegExp($scope.nameFilter, 'i');
        return !$scope.nameFilter || keyword.test(result.Driver.givenName) || keyword.test(result.Driver.familyName) || keyword.test(result.Constructor.name) ;
        };
        
        ergastAPIservice.getRaceQualyResults($scope.round).success(function (response){
        $scope.qualyResults = response.MRData.RaceTable.Races[0].QualifyingResults;
        });

        ergastAPIservice.getRaceResults($scope.round).success(function (response){
        $scope.raceResults = response.MRData.RaceTable.Races[0].Results;
        });
}]);

stats.controller('constructorResultsController', ['$scope', '$routeParams' ,'ergastAPIservice', function ($scope,$routeParams,ergastAPIservice) {
        $scope.constructorInfo = null;
        $scope.resultsData = [];
        $scope.id = $routeParams.id;
        $scope.test = "test";
        $scope.driver1 = null;
        $scope.driver2 = null;
        $scope.points = [];
        var sum;
        var point1;
        var point2;

        $scope.nameFilter = null;
        $scope.flags = {};
        $scope.searchFilter = function (result) {
        var keyword = new RegExp($scope.nameFilter, 'i');
        return !$scope.nameFilter || keyword.test(result.raceName);
        };
       
        

        ergastAPIservice.getTeamInfo($scope.id).success(function(response){
        $scope.constructorInfo = response.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[0];
        });

        ergastAPIservice.getTeamResults($scope.id).success(function(response){
        $scope.resultsData = response.MRData.RaceTable.Races;

        $scope.driver1 = $scope.resultsData[0].Results[0].Driver.givenName + " " + 
                         $scope.resultsData[0].Results[0].Driver.familyName;

        $scope.driver2 = $scope.resultsData[0].Results[1].Driver.givenName + " " + 
                         $scope.resultsData[0].Results[1].Driver.familyName; 

        for(var i = 0; i<$scope.resultsData.length; i++){
           point1 = $scope.resultsData[i].Results[0].points;
           point2 = $scope.resultsData[i].Results[1].points;
           sum = parseInt(point1, 10) + parseInt(point2,10);
            $scope.points.push(sum);

        }
                         
        });

        

                        
        
}]);




stats.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/drivers', {templateUrl: 'partials/driversstandings.html', controller: 'driversStandingsController'});
  $routeProvider.when('/', {templateUrl: 'partials/driversstandings.html', controller: 'driversStandingsController'});
  $routeProvider.when("/drivers/:id", {templateUrl: "partials/driver.html", controller: "driverDetailsController"});
  $routeProvider.when('/teams', {templateUrl: 'partials/teamsstandings.html', controller: 'teamsStandingsController'});
  $routeProvider.when('/races', {templateUrl: 'partials/races.html', controller: 'racesController' });
  $routeProvider.when('/races/:round', {templateUrl: 'partials/results.html', controller: 'racesQualyResultsController' });
  $routeProvider.when('/teams/:id', {templateUrl: 'partials/team.html', controller: 'constructorResultsController'});
  $routeProvider.otherwise({redirectTo: '/f1.html'});
}]);




