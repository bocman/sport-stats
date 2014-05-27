<?php 

	include 'database.php';

	$data1 = array();
	$data2 = array();
	

	$query1 = "select drivers.forename, drivers.surname, drivers.code, laptimes.lap, laptimes.position, laptimes.time, laptimes.milliseconds
				from laptimes left join drivers on drivers.driverId = laptimes.driverId
				where laptimes.driverId = 1 and laptimes.raceId = 841";

	$query2 = "select drivers.forename, drivers.surname, drivers.code, laptimes.lap, laptimes.position, laptimes.time, laptimes.milliseconds
				from laptimes left join drivers on drivers.driverId = laptimes.driverId
				where laptimes.driverId = 816 and laptimes.raceId = 841";


	$mysqli = new mysqli($localhost, $user, $password, $database);
	$result1 = $mysqli->query($query1) or die($msqli->error.__LINE__);
	if($result1->num_rows > 0){
		while($row = $result1->fetch_assoc()){
			$data1[] = array('FirstName' => utf8_encode($row['forename']), 'LastName' => utf8_encode($row['surname']), 'Code' => $row['code'], 'Lap' => $row['lap'], 'Position'
				=> $row['position'], 'Time' => $row['time'], 'Milliseconds' => $row['milliseconds']);	
		}
	}


	$result2 = $mysqli->query($query2) or die($msqli->error.__LINE__);
	if($result2->num_rows > 0){
		while($row = $result2->fetch_assoc()){
			$data2[] = array('FirstName' => utf8_encode($row['forename']), 'LastName' => utf8_encode($row['surname']), 'Code' => $row['code'], 'Lap' => $row['lap'], 'Position'
				=> $row['position'], 'Time' => $row['time'], 'Milliseconds' => $row['milliseconds']);	
		}
	}

	mysqli_close($mysqli);

    
	echo json_encode(array('data1'=> $data1, 'data2' => $data2));

	



 ?>