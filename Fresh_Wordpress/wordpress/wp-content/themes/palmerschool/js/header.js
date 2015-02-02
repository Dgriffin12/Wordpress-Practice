jQuery(document).ready(function($){
	$("#font_larger").click(function(){
		
	});
	$("#font_smaller").click(function(){
		
	});
	
	var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	var weekday = new Array(7);
	weekday[0]=  "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";
	
	var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];
    
	var date_string = (weekday[currentTime.getDay()] + ", " + monthNames[month] + " " + day + ", " + year);
	$("#date_field").html(date_string);
});
