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
			drivers.forename, drivers.surname, drivers.code,laptimes.*
			FROM
				laptimes
				INNER JOIN (
					SELECT
						laptimes.raceId
					,	laptimes.driverId
					,	laptimes.milliseconds
					,	MIN(laptimes.lap) AS lap
					FROM
						laptimes
						INNER JOIN (
							select
								raceId
							,	driverId
							,	MIN(milliseconds) AS milliseconds
							from
								laptimes
							where
								laptimes.raceId = '$raceId'
							group by
								raceId
							,	driverId
						) min_laptimes ON (laptimes.raceId = min_laptimes.raceId AND laptimes.driverId = min_laptimes.driverId AND laptimes.milliseconds = min_laptimes.milliseconds)
					GROUP by
						laptimes.raceId
					,	laptimes.driverId
					,	laptimes.milliseconds
				)	min_lap_time ON (laptimes.raceId = min_lap_time.raceId AND laptimes.driverId = min_lap_time.driverId AND laptimes.milliseconds = min_lap_time.milliseconds AND laptimes.lap = min_lap_time.lap)  LEFT JOIN drivers ON laptimes.driverId = drivers.driverId
			ORDER BY
				laptimes.milliseconds,
			    laptimes.driverId

	";

	$result2 = $mysqli->query($query2) or die($msqli->error.__LINE__);
	if($result2->num_rows > 0){
		while($row = $result2->fetch_assoc()){
			$data[] = array("FirstName" => utf8_encode($row['forename']), "LastName" => utf8_encode($row['surname']), "Position" => $row['position'], "Lap" => $row['lap'], "Time" => $row['time'], "Milliseconds" => $row['milliseconds'], "Code" => $row['code']);
		}
	}

		mysqli_close($mysqli);

	echo json_encode($data);

}


 ?>