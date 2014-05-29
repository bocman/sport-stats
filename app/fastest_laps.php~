<?php 

	//$d = array("a" =>"Jérôme", "b" => 2);
	//echo json_encode($d);
	
	$replace = array("é", "ô", "ä");
	$data = array();
	$mysqli = new mysqli("localhost", "root", "", "ergast");
	$query = "
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
								laptimes.raceId = 841
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
	$result = $mysqli->query($query) or die($msqli->error.__LINE__);
	if($result->num_rows > 0){
		while($row = $result->fetch_assoc()){
			$data[] = array("FirstName" => utf8_encode($row['forename']), "LastName" => utf8_encode($row['surname']), "Position" => $row['position'], "Lap" => $row['lap'], "Time" => $row['time'], "Milliseconds" => $row['milliseconds'], "Code" => $row['code']);
		}
	}

		mysqli_close($mysqli);

	echo json_encode($data);


 ?>