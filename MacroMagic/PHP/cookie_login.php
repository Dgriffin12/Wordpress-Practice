<?php

	$con=mysqli_connect("localhost","dougyfresh","Football12#$","nutrient_database");
	
	if (mysqli_connect_errno()) {
  		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	
	mysqli_select_db($con,"nutrient_database");
	
	$long_num = $_GET['long_num'];
	$username = $_GET['username'];
	
	$result = mysqli_query($con,'SELECT * FROM session WHERE (large_num LIKE ' . $long_num . ' AND user_name LIKE "' . $username . '")');

	if($result && $row = mysqli_fetch_array($result))
	{
		$responseText = array('status' => "good", 'text' =>'Logged in as ' . $username . '', 'username' => $username, 'results' => "");	
		echo json_encode($responseText);
	}else
	{
		$responseText = array('status' => "bad", 'text' => 'Failed to cookie login with username ' . $username . ' and long num ' . $long_num . '');
		echo json_encode($responseText);
	}
	
?>