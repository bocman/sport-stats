<?php 

include 'database.php';

if(isset($_GET['round']) && isset($_GET['year'])){
	$round = trim($_GET['round']);
	$year = trim($_GET['year']);

	$data = array();
	$raceId;
	$mysqli = new mysqli($localhost, $user, $password, $database);
	$query1 = "SELECT raceId FROM races WHERE year='$year' AND round='$round' ";

	$result1 = $mysqli->query($query1) or die($msqli->error.__LINE__);
	if($result1->num_rows > 0){
		while($row = $result1->fetch_assoc()){
			$raceId = utf8_encode($row['raceId']);		
		}
	}

	$query2 = "
			SELECT
			drivers.forename, drivers.surname, drivers.code,pitstops.*
			FROM
				pitstops
				INNER JOIN (
					SELECT
						pitstops.raceId
					,	pitstops.driverId
					,	pitstops.milliseconds
					,	MIN(pitstops.lap) AS lap
					FROM
						pitstops
						INNER JOIN (
							select
								raceId
							,	driverId
							,	MIN(milliseconds) AS milliseconds
							from
								pitstops
							where
								pitstops.raceId = '$raceId'
							group by
								raceId
							,	driverId
						) min_laptimes ON (pitstops.raceId = min_laptimes.raceId AND pitstops.driverId = min_laptimes.driverId AND pitstops.milliseconds = min_laptimes.milliseconds)
					GROUP by
						pitstops.raceId
					,	pitstops.driverId
					,	pitstops.milliseconds
				)	min_lap_time ON (pitstops.raceId = min_lap_time.raceId AND pitstops.driverId = min_lap_time.driverId AND pitstops.milliseconds = min_lap_time.milliseconds AND pitstops.lap = min_lap_time.lap)  LEFT JOIN drivers ON pitstops.driverId = drivers.driverId
			ORDER BY
				pitstops.milliseconds,
			    pitstops.driverId

	";

	$result2 = $mysqli->query($query2) or die($msqli->error.__LINE__);
	if($result2->num_rows > 0){
		while($row = $result2->fetch_assoc()){
			$data[] = array("FirstName" => utf8_encode($row['forename']), "LastName" => utf8_encode($row['surname']), "Stop" => $row['stop'], "Lap" => $row['lap'], "Duration" => $row['duration'], "Code" => $row['code']);
		}
	}

		mysqli_close($mysqli);

	echo json_encode($data);

}


 ?>