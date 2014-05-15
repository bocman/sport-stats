'use strict';

/* Services */

angular.module('stats.services', []).
  factory('ergastAPIservice', function($http) {

    var ergastAPI = {};
   
    ergastAPI.getDrivers = function() {
      return $http ({
        method: 'JSONP', 
        url: 'http://ergast.com/api/f1/2013/driverStandings.json?callback=JSON_CALLBACK'
      });
    };

    ergastAPI.getTeams = function(){
      return $http({
        method: 'JSONP',
        url: 'http://ergast.com/api/f1/2013/constructorStandings.json?callback=JSON_CALLBACK'

      });
    };

    ergastAPI.getRaces = function(){
      return $http({
        method: 'JSONP',
        url: 'http://ergast.com/api/f1/2013/results/1.json?callback=JSON_CALLBACK'

      });
    };


    ergastAPI.getDriverDetails = function(id) {
          return $http({
            method: 'JSONP', 
            url: 'http://ergast.com/api/f1/2013/drivers/'+ id +'/driverStandings.json?callback=JSON_CALLBACK'
          });
        };

        ergastAPI.getDriverRaces = function(id) {
          return $http({
            method: 'JSONP', 
            url: 'http://ergast.com/api/f1/2013/drivers/'+ id +'/results.json?callback=JSON_CALLBACK'
          });
        };

        ergastAPI.getDriverResults = function(id){
          return $http({
            method : 'JSONP',
            //url: 'http://ergast.com/api/f1/drivers/'+id+'/results.json?callback=JSON_CALLBACK'
            url: 'http://ergast.com/api/f1/drivers/'+id+'/results.json?limit=1100&callback=JSON_CALLBACK'
          });
        };

        ergastAPI.getDriverTitles = function(id){
          return $http({
            method: 'JSONP',
            url: 'http://ergast.com/api/f1/drivers/'+id + '/driverStandings/1.json?limit=30&callback=JSON_CALLBACK'
          });
        }

        ergastAPI.getRaceQualyResults = function(round){
          return $http({
            method: 'JSONP',
            url: "http://ergast.com/api/f1/2013/"+round+"/qualifying.json?callback=JSON_CALLBACK"
        });
        };

        ergastAPI.getRaceResults = function(round){
          return $http({
            method: 'JSONP',
            url: "http://ergast.com/api/f1/2013/"+round+"/results.json?callback=JSON_CALLBACK"
          });
        };

        ergastAPI.getTeamInfo = function(id){
          return $http({
            method: 'JSONP', 
            url: 'http://ergast.com/api/f1/2013/constructors/' + id +'/constructorStandings.json?callback=JSON_CALLBACK'
          });
        };

        ergastAPI.getTeamResults = function(id){
          return $http({
            method: 'JSONP',
            url: 'http://ergast.com/api/f1/2013/constructors/'+ id + '/results.json?callback=JSON_CALLBACK'
          });
        };

        ergastAPI.getTeamRaces = function(id){
          return $http({
            method: 'JSONP',
            url: 'http://ergast.com/api/f1/constructors/'+id+'/results.json?limit=3300&callback=JSON_CALLBACK'
          });
        };



    return ergastAPI;
  }).value('version', '0.1');