'use strict';

/* Controllers */
var stats = angular.module('stats.controllers', ['firebase']);

// Login controller 
stats.controller("LoginController", ["$scope", "$firebase", "$firebaseSimpleLogin",
        function($scope, $firebase, $firebaseSimpleLogin) 
        {
            var ref = new Firebase("https://glowing-fire-8759.firebaseio.com/");
            $scope.auth = $firebaseSimpleLogin(ref);

            // function to register user
            $scope.signUp = function(userEmail, userPassword) {
                $scope.auth.$createUser(userEmail, userPassword, function(error, user) {                   
                    if (!error) {
                        console.log("USER CREATED");
                    } 
                    else {
                        console.log("ERROR");
                    }
                });
            }

            var auth = new FirebaseSimpleLogin(ref, function(error, user) {
                if (error) {
                    // an error occurred while attempting login
                    console.log(error);
                } 
                else if (user) {
                    // user authenticated with Firebase
                    var currentPath = window.location.pathname.split('/').pop();

                    if (currentPath === 'sign-in.html' || currentPath === 'register.html') {
                        // create a user reference
                        var userRef = ref.child('users/' + user.uid);

                        // check wheather the user is already registered
                        userRef.on('value', function(snapshot) {
                            if(snapshot.val() === null) {
                                // the user hasn't joined yet

                                // get current date
                                var date = new Date();
                                var dd = date.getDate();
                                var mm = date.getMonth()+1; // january is 0!
                                var yyyy = date.getFullYear();

                                if(dd < 10) {
                                    dd = '0' + dd;
                                } 

                                if(mm < 10) {
                                    mm= '0' + mm;
                                } 

                                date = dd+'/'+mm+'/'+yyyy;
                                console.log("DISPLAY NAME = " + user.displayName);
                                // write new user name and joined date to database
                                userRef.child('name').set(user.displayName === undefined ? user.email : user.displayName);
                                userRef.child('joined').set(date);
                            } else {
                                // the user is already registered
                            }
                            // redirect to main page
                            window.location.href = "index.html";
                        });
                    }
                } else {
                    // user is logged out
                }
            });
        }
    ]);

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
    $scope.DriverData = {
        'firstPlaces' : 0,
        'secondPlaces' : 0,
        'thirdPlaces' : 0,
        'polePositions': 0,
        'races' : 0,
        'careerPoints' : 0,
        'finishedRaces' : 0,
        'podiums' : 0,
        'titles' : 0,
        'titleYears' : []

    };

    $scope.titleYears="";

    $scope.driverRaces = [];



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

    

    ergastAPIservice.getDriverResults($scope.id).success(function(response){
        $scope.driverRaces = response.MRData.RaceTable.Races;
        $scope.DriverData.races = $scope.driverRaces.length;

        var stringToInt;
        var points = 0;
        for(var i = 0; i<$scope.driverRaces.length; i++){
            switch ($scope.driverRaces[i].Results[0].position){
                case '1':
                $scope.DriverData.firstPlaces++;
                break;

                case '2':
                $scope.DriverData.secondPlaces++;
                break;

                case '3':
                $scope.DriverData.thirdPlaces++;
            }

            if($scope.driverRaces[i].Results[0].grid == '1'){
                $scope.DriverData.polePositions++;
            }

            if($scope.driverRaces[i].Results[0].status == "Finished"){
                $scope.DriverData.finishedRaces++;
            }

            stringToInt = parseInt($scope.driverRaces[i].Results[0].points);
            points += stringToInt;
        }

        

        $scope.DriverData.podiums =  $scope.DriverData.firstPlaces + $scope.DriverData.secondPlaces + $scope.DriverData.thirdPlaces;
        $scope.DriverData.careerPoints = points;

        /*

        console.log("1st:" + $scope.DriverData.firstPlaces);
        console.log("2nd: " + $scope.DriverData.secondPlaces);
        console.log("3rd: " + $scope.DriverData.thirdPlaces);
        console.log("Poles: " + $scope.DriverData.polePositions);
        console.log("Races: " +$scope.DriverData.races);
        console.log("Finished races: " + $scope.DriverData.finishedRaces);
        console.log("Podiums: " + $scope.DriverData.podiums);
        console.log("Career points: " + $scope.DriverData.careerPoints);

        */
        
        
    });

        ergastAPIservice.getDriverTitles ($scope.id).success(function(response){
            $scope.DriverData.titles = response.MRData.total;
            var data = response.MRData;
            console.log("Titles: " + $scope.DriverData.titles);
            for(var i = 0; i<data.StandingsTable.StandingsLists.length; i++){
                $scope.DriverData.titleYears.push(data.StandingsTable.StandingsLists[i].season);
            }

            for(var f = 0; f<$scope.DriverData.titleYears.length; f++){
                $scope.titleYears += $scope.DriverData.titleYears[f] + " ";
            }
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


        $scope.TeamData = {
            'races' : 0,
            'podiums' : 0,
            'firstPlaces' : 0,
            'secondPlaces' : 0,
            'thirdPlaces' : 0,
            'polePositions' : 0,
            'titles' : 0


        };

        var teamData = {};

        ergastAPIservice.getTeamRaces($scope.id).success(function(response){
            teamData = response.MRData;

            $scope.TeamData.races = teamData.RaceTable.Races.length;
            for(var i = 0; i<teamData.RaceTable.Races.length; i++){
                if(teamData.RaceTable.Races[i].Results[0].position == '1' || teamData.RaceTable.Races[i].Results[1].position == '1'){
                    $scope.TeamData.firstPlaces++;
                }

                if(teamData.RaceTable.Races[i].Results[0].position == '2' || teamData.RaceTable.Races[i].Results[1].position == '2'){
                    $scope.TeamData.secondPlaces++;
                }

                if(teamData.RaceTable.Races[i].Results[0].position == '3' || teamData.RaceTable.Races[i].Results[1].position == '3'){
                    $scope.TeamData.thirdPlaces++;
                }

                if(teamData.RaceTable.Races[i].Results[0].grid == '1' || teamData.RaceTable.Races[i].Results[1].grid == '1'){
                    $scope.TeamData.polePositions++;
                }

            }

            console.log($scope.TeamData.polePositions);
            /*
            console.log($scope.TeamData.firstPlaces);
            console.log($scope.TeamData.secondPlaces);
            console.log($scope.TeamData.thirdPlaces);
            */
            //console.log(teamData.total);
            //console.log(teamData.RaceTable.Races.length);

            $scope.TeamData.podiums = $scope.TeamData.firstPlaces + $scope.TeamData.secondPlaces + $scope.TeamData.thirdPlaces;
            //console.log($scope.TeamData.podiums);
        });

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


stats.controller('nbaNews', function ($scope, $http) {
    $scope.test="dela";
    
	  $scope.Novice=[];
		$http({method: 'GET', url: 'http://api.espn.com/v1/now/popular?apikey=u7ypns6uch5j8pjrep9jq54y'}).success(function(data)
		{
		$scope.posts = data; // response data 
		for(var i=0; i<10; i++){
		  var naslov= data.feed[i].headline;
		  var objavljenoOb=data.feed[i].lastModified;
		  var datum=objavljenoOb.substring(0, 10);
		  var ura=objavljenoOb.substring(12, 19);
		  var slika=data.feed[i].images[0].url;
		  var opis=data.feed[i].description;
		  if(opis.length>100){
		     opis=opis.substring(0,100)+"...";
		  }
		  //var povezava=data.feed[i].links.web.href;
		 // document.write(data.feed[i].links);

		  var povezava= data.feed[i].links.web.href;
		  
		 if(naslov.length>38){
		    naslov=naslov.substring(0,38)+" ...";
		 }

		 

		  var novica={
		      title : naslov,
			  date : datum,
			  clock : ura,
			  picture :slika,
			  //link=povezava,
			  opis: opis
			 	  
			  
		  };
		  $scope.Novice.push(novica);
		  
		  
		}
		
		});
   
});




stats.controller('nbaTeams', function ($scope, $http) {
    $scope.test="dela";
    		   $scope.Ekipe=[];
		$http({method: 'GET', url: 'http://api.espn.com/v1/sports/basketball/nba/teams?apikey=u7ypns6uch5j8pjrep9jq54y'}).success(function(data)
		{
		$scope.posts = data; // response data 
		for(var i=0; i<30; i++){
	     	//document.write(data.sports[0].leagues[0].teams[i].name+"<br>");		
		    var ekipa={
			  id : data.sports[0].leagues[0].teams[i].id,
		      name : data.sports[0].leagues[0].teams[i].name,
			  location : data.sports[0].leagues[0].teams[i].location,
			  abbreviation: data.sports[0].leagues[0].teams[i].abbreviation,
			  leauges: data.sports[0].leagues[0].name
		  };
		 $scope.Ekipe.push(ekipa);
		}

		
		});
});


stats.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/drivers', {templateUrl: 'partials/driversstandings.html', controller: 'driversStandingsController'});
  $routeProvider.when('/', {templateUrl: 'partials/driversstandings.html', controller: 'driversStandingsController'});
  $routeProvider.when("/drivers/:id", {templateUrl: "partials/driver.html", controller: "driverDetailsController"});
  $routeProvider.when('/teams', {templateUrl: 'partials/teamsstandings.html', controller: 'teamsStandingsController'});
  $routeProvider.when('/races', {templateUrl: 'partials/races.html', controller: 'racesController' });
  $routeProvider.when('/races/:round', {templateUrl: 'partials/results.html', controller: 'racesQualyResultsController' });
  $routeProvider.when('/teams/:id', {templateUrl: 'partials/team.html', controller: 'constructorResultsController'});
$routeProvider.when('/lap-chart', {templateUrl: 'partials/times.html', controller: ''});
  $routeProvider.when('/nbaNews', {templateUrl: 'partials/News.html', controller: 'nbaNews'});
  $routeProvider.when('/nbaTeams', {templateUrl: 'partials/Teams.html', controller: 'nbaTeams'});

  $routeProvider.otherwise({redirectTo: '/f1.html'});
}]);




