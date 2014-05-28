<?php 

	include 'database.php';

	if(isset($_GET['driver1']) && isset($_GET['driver2']) && isset($_GET['season']) && isset($_GET['race'])){
		$driver1 = trim($_GET['driver1']);
		$driver2 = trim($_GET['driver2']);
		$season = trim($_GET['season']);
		$race = trim($_GET['race']);
		$raceId;

		$laptimes1 = array();
		$laptimes2 = array();

		$query1 = "SELECT raceId FROM races WHERE year = '$season' AND round='$race'";

		$mysqli = new mysqli($localhost, $user, $password, $database);

		$result1 = $mysqli->query($query1) or die($msqli->error.__LINE__);
		if($result1->num_rows > 0){
		while($row = $result1->fetch_assoc()){
			$raceId = $row['raceId'];	
		}
	}

		$query2="select drivers.forename, drivers.surname, drivers.code, laptimes.lap, laptimes.position, laptimes.time, laptimes.milliseconds
				from laptimes left join drivers on drivers.driverId = laptimes.driverId
				where laptimes.driverId = '$driver1' and laptimes.raceId = '$raceId'";

		$result2 = $mysqli->query($query2) or die($msqli->error.__LINE__);
		if($result2->num_rows > 0){
		while($row = $result2->fetch_assoc()){
			$laptimes1[] = array('FirstName' => utf8_encode($row['forename']), 'LastName' => utf8_encode($row['surname']), 'Lap' => $row['lap'], 'Position' => $row['position'], 'Time' => $row['time'], 'Milliseconds' => $row['milliseconds']);	
		}
	}		

		$query3 = "select drivers.forename, drivers.surname, drivers.code, laptimes.lap, laptimes.position, laptimes.time, laptimes.milliseconds
				from laptimes left join drivers on drivers.driverId = laptimes.driverId
				where laptimes.driverId = '$driver2' and laptimes.raceId = '$raceId'";

		$result3 = $mysqli->query($query3) or die($msqli->error.__LINE__);
		if($result3->num_rows > 0){
		while($row = $result3->fetch_assoc()){
			$laptimes2[] = array('FirstName' => utf8_encode($row['forename']), 'LastName' => utf8_encode($row['surname']), 'Lap' => $row['lap'], 'Position' => $row['position'], 'Time' => $row['time'], 'Milliseconds' => $row['milliseconds']);	
		}
	}		



		mysqli_close($mysqli);
		echo json_encode(array('laptimes1' => $laptimes1, 'laptimes2' => $laptimes2 ));


	}


 ?>