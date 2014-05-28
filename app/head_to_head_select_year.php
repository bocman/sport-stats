<?php 

include 'database.php';

if(isset($_GET['season']) && isset($_GET['round'])){

	$raceId;
	$drivers = array();
	$laptimes1 = array();
	$laptimes2 = array();
	$season = trim($_GET['season']);
	$round = trim($_GET['round']);
	$mysqli = new mysqli($localhost, $user, $password, $database);
	$query1 = "
			SELECT raceId FROM races WHERE year = '$season' and round = '$round'
     		";
	
	
	$result1 = $mysqli->query($query1) or die($msqli->error.__LINE__);
	if($result1->num_rows > 0){
		while($row = $result1->fetch_assoc()){
			$raceId = $row['raceId'];	
		}
	}

	$query2 = "
    			select distinct drivers.driverId,drivers.forename, drivers.surname from
				laptimes left join drivers on drivers.driverId = laptimes.driverId
				where laptimes.raceId = '$raceId'
    	";

	$result2 = $mysqli->query($query2) or die($msqli->error.__LINE__);
	if($result2->num_rows > 0){
		while($row = $result2->fetch_assoc()){
			$drivers[] = array('driverId' => $row['driverId'], 'FirstName' => utf8_encode($row['forename']), 'LastName' => utf8_encode($row['surname']));	
		}
	}	

    $firstDriverIdInArray = $drivers[0]['driverId'];
    $secondDriverIdInArray = $drivers[sizeOf($drivers)-1]['driverId'];

	$query3 = "select drivers.forename, drivers.surname, drivers.code, laptimes.lap, laptimes.position, laptimes.time, laptimes.milliseconds
				from laptimes left join drivers on drivers.driverId = laptimes.driverId
				where laptimes.driverId = '$firstDriverIdInArray' and laptimes.raceId = '$raceId'";

	$result3 = $mysqli->query($query3) or die($msqli->error.__LINE__);
	if($result3->num_rows > 0){
		while($row = $result3->fetch_assoc()){
			$laptimes1[] = array('FirstName' => utf8_encode($row['forename']), 'LastName' => utf8_encode($row['surname']), 'Lap' => $row['lap'], 'Position' => $row['position'], 'Time' => $row['time'], 'Milliseconds' => $row['milliseconds']);	
		}
	}	



	$query4 = "select drivers.forename, drivers.surname, drivers.code, laptimes.lap, laptimes.position, laptimes.time, laptimes.milliseconds
				from laptimes left join drivers on drivers.driverId = laptimes.driverId
				where laptimes.driverId = '$secondDriverIdInArray' and laptimes.raceId = '$raceId'";	

	$result4 = $mysqli->query($query4) or die($msqli->error.__LINE__);
	if($result4->num_rows > 0){
		while($row = $result4->fetch_assoc()){
			$laptimes2[] = array('FirstName' => utf8_encode($row['forename']), 'LastName' => utf8_encode($row['surname']), 'Lap' => $row['lap'], 'Position' => $row['position'], 'Time' => $row['time'], 'Milliseconds' => $row['milliseconds']);	
		}
	}				

 	
	mysqli_close($mysqli);

	echo json_encode(array('drivers'=> $drivers, 'laptimes1' => $laptimes1, 'laptimes2' => $laptimes2));

}


 ?>