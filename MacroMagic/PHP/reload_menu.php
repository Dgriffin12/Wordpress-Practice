<?php
	include_once "http://localhost/WP/wordpress/wp-content/themes/business-pro/functions/businesspro-functions.php";
    $logged_in = $_GET['logged_in'];
   
    //$html = String(businesspro_nav($logged_in));
    $html = "weee";
	$result_array = array($logged_in, $html);
	
	echo json_encode($result_array)
?>