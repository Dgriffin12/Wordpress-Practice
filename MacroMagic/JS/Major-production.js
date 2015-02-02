var logged_in = false;
var cur_user = "";
var cur_day = 0;

$(window).load(function(){	
	cookie_login_attempt();
});

function check_form()
{
        var pw_notify = document.getElementById("pw_notify");
        var acc = document.getElementById("account_name_field");
        var pwd1 = document.getElementById("password");
        var pwd2 = document.getElementById("password2");
        if(acc.value == "Username") 
        {
            pw_notify.innerHTML = "Error: Username cannot be blank!";
            acc.focus();
            return false;
        }
        if(pwd1.value != "********")
        {
               if(pwd1.value == pwd2.value)
               {
                     pw_notify.innerHTML = "";
                     create_account(acc.value, pwd1.value);
                     return true;
               }else
               {
                     pw_notify.innerHTML = "Error: Passwords must match!";
                     pwd1.focus();
                     return false;
               }
        }else
        {
                pw_notify.innerHTML = "Error: A password is required!";
                pwd1.focus();
                return false;
        }
        if(pwd2.value != "********")
        {
               if(pwd1.value == pwd2.value)
               {
                     pw_notify.innerHTML = "";
                     create_account(acc.value, pwd1.value);
                     return true;
               }else
               {
                         pw_notify.innerHTML = "Error: Passwords must match!";
                         pwd1.focus();
                         return false;
               }
        }else
        {
                pw_notify.innerHTML = "Error: A password is required!";
                pwd2.focus();
                return false;
        }
}



function create_account(username, password)
{
	logout(); //ensure we logout if we already are logged in to an account.
	$.ajax({
		method: 'post',
		url: 'http://localhost/WP/MacroMagic/PHP/create_acc.php',
		data: {
			'username' : username,
			'password' : password,
		},
		success: function(data){
			var array = jQuery.parseJSON(data);
			if(array['status'] == "good")
			{
				$("#results").css("color", "green");
				$("#results").html(array['text']);
				login(username, password);
			}else
			{
				$("#results").css("color", "red");
				$("#results").html(array['text']);
			}
			
		},
		error: function(data){
			//shouldn't happen
		}
	});
}

function login(acc, pw){
	var username;
	var password;
	if(acc === "" || pw === "")
	{
		username = $("#username_login").val();
		password = $("#password_login").val();
	}else
	{
		username = acc;
		password = pw;
	}

	$.ajax({
		method: 'get',
		url: 'http://localhost/WP/MacroMagic/PHP/login.php',
		data: {
			'username' : username,
			'password' : password,
		},
		success: function(data){
			var array = jQuery.parseJSON(data);
			if(array['status'] == "good")
			{
				logged_in = true;
				reload_menu();
				cur_user = array['username'];
				$("#login").html('<div><span id = "login_results"></span><button id = "logout_button" onclick = "logout()">Logout</button></div>');
				var width = $(".logo > a > img").width();
				$("#logout_button").css("margin-left", width-165);
				$("#login_results").css("color", "blue");
				$("#login_results").html("Logged in as "+ array['username'] + '.');
				document.cookie =  Math.floor(Math.random()*9223372036854775807) + '|' + array['username'];
				//window.location = "http://localhost/WP/MacroMagic/my-food-journal";
				create_and_store_cookie();
			}else
			{
				$("#login_results").css("color", "red");
				$("#login_results").html(array['text']);
			}
		}
	});
	
}

function create_and_store_cookie()
{
	var cookie = document.cookie;
	$.ajax({
		method: 'get',
		url: 'http://localhost/WP/MacroMagic/PHP/store_cookie.php',
		data: {
			'cookie' : cookie
		},
		success: function()
		{
		}
	});
}


//Search function, ajax lookup for names of foods, paramater data used for coming back from nutrition facts(re-searching on the search_string IF back is pressed)
//data = true : re-search initiated from pressing back after viewing nutrition facts on an item.
//data = false : search from main page
function search(data)
{
	$("#results").css("color", "black");
	if(!data)
	{
		search_string = $("#search_field").val();
	}
	if (search_string=="" || search_string == "Search for Food") 
	{
    	$("#results").html("");
    	return;
  	} 
  	$.ajax({
  		method: 'GET',
  		url: 'http://localhost/WP/MacroMagic/PHP/search.php',
  		data:{	
  			'q' : search_string,
  			'k' : logged_in
  		},
  		success: function(data){
  			if(data === "No matches found.")
  			{
  				$("#results").css("color", "red");
  				$("#results").html(data);
  			}else
  			{
  				$("#results").css("color", "");
  				$("#results").html("<br>" + data);
  				$("#results").css("color", "black");
    			$("#search_table th").css("font-weight", "bold");
				$("#search_table").css("border-collapse", "collapse");
				$("#search_table td").css("padding-top", ".5em");
				$("#search_table td").css("padding-bottom", ".5em");
				$("#search_table tr").css("border", "solid");
				$("#search_table tr").css("border-width", "1px 0");
				$("#search_table tr").css("border-color", "#034c81");
  			}
  		}
   	});
   
    
}

//Provides nutrition label style data for the food.
function info(food_NDB_No, weight)
{
	$.ajax({
		method: 'get',
		url: 'http://localhost/WP/MacroMagic/PHP/food_data_lookup.php',
		data: {
			'NDB_No' : food_NDB_No,
			'logged_in': logged_in,
			'weight' : weight
		},
		success: function(data){
			var back_to_search = "<button id = 'back_to_search_button' onclick = 'back_to_search()'>Back</button>";
			$("#buttons").html('<button id = "search_button" onclick = "search(false)">Search </button>' + back_to_search);
			
			$("#results").html(data);
			var width = $("#Nutrition_Facts").width();
			$("#back_to_search_button").css("margin-left", width-100);
			$("#Food_Amount").change(function(){
				nutrition_update(food_NDB_No, $("#Food_Amount").val());
			});
		}
	});
	
}

//Updates if a different weight of the food is selected.
function nutrition_update(food_NDB_No, food_weight)
{
	var multiplier = food_weight / 100; //food_weight in grams divided by 100g(which is what the nut_vals are based upon)
	$.ajax({
		method: 'get',
		url: '/WP/WP_Nutrition_Site/PHP/nutrition_update.php',
		data: {
			'NDB_No' : food_NDB_No
		},
		success:function(data){
			var array = jQuery.parseJSON(data);
			$("#calories").html((array['calories']*multiplier).toFixed(2));
			$("#total_fat").html((array['total_fat']*multiplier).toFixed(2) + "g");
			$("#sat_fat").html((array['sat_fat']*multiplier).toFixed(2) + "g");
			$("#trans_fat").html((array['trans_fat']*multiplier).toFixed(2) + "g");
			$("#mono_fat").html((array['mono_fat']*multiplier).toFixed(2) + "g");
			$("#poly_fat").html((array['poly_fat']*multiplier).toFixed(2) + "g");
			$("#cholesterol").html((array['cholesterol']*multiplier).toFixed(2) + "mg");
			$("#sodium").html((array['sodium']*multiplier).toFixed(2) + "mg");
			$("#carbs").html((array['carbs']*multiplier).toFixed(2) + "g");
			$("#fiber").html((array['fiber']*multiplier).toFixed(2) + "g");
			$("#sugar").html((array['sugar']*multiplier).toFixed(2) + "g");
			$("#protein").html((array['protein']*multiplier).toFixed(2) + "g");
		}
	});
}

function set_search_handlers()
{       
          
        $("#search_field").keypress(function(e){
        	     if(e.which == '13')
			          search(false);
        });
        if($("#search_field").val() == 'Search for Food')
        {
             $("#search_field").val('');
        }
         
}

function back_to_search()
{
	$("#buttons").html('<button id = "search_button" onclick = "search(false)">Search </button>');
	search(true);
}

function set_username_handlers()
{       
          
        $("#username_login").keypress(function(e){
        	     if(e.which == '13')
			          login('', '');
        });
        if($("#username_login").val() == 'username')
        {
             $("#username_login").val('');
        }
}

function set_password_handlers()
{
	$("#password_login").keypress(function(e){
        	     if(e.which == '13')
			          login('', '');
        });
    if($("#password_login").val() == '********')
    {
         $("#password_login").val('');
    }
}

//Logout Function, gets rid of cookie in database
function logout()
{
	var full = document.cookie.split(';', 1);
	var results = full[0].split('|');
	var username = results[1];
	var long_num = results[0];
	$.ajax({
		method: 'get',
		url: 'http://localhost/WP/MacroMagic/PHP/cookie_logout.php',
		data: {
			'username' : username,
			'long_num' : long_num
		}
	});
	logged_in = false;
	reload_menu();
	cur_user = "";
	$("#login").html('Login: <div id = "login_results"></div><input id = "username_login" onblur="if (this.value == \'\') {this.value = \'username\';}" onfocus="set_username_handlers()" type = "text" value = "username"/><input id = "password_login" onblur="if (this.value == \'\') {this.value = \'********\';}" onfocus="set_password_handlers()" type = "password" value = "********"/><button id = "login_button" onclick = "login(\'\', \'\')">Login </button>');
	
	document.cookie = "";
	location.reload(true);
}

//attempts to login with the document.cookie, should be called from document.ready only(when the user first loads the page)
function cookie_login_attempt(data1)
{
	if(!logged_in)
	{
	full = document.cookie.split(';', 1);
	results = full[0].split('|');
	var username = results[1];
	var long_num = results[0];
	var return_val = "not logged in, ajax starting";
	$.ajax({
		method: 'get',
		url: 'http://localhost/WP/MacroMagic/PHP/cookie_login.php',
		data: {
			'username' : username,
			'long_num' : long_num,
		},
		async: false,
		success: function(data){
			var array = jQuery.parseJSON(data);			
			if(array['status'] == "good")
			{
				logged_in = true;
				reload_menu();
				cur_user = array['username'];
				$("#login").html('<div><span id = "login_results"></span><button id = "logout_button" onclick = "logout()">Logout</button></div>');
				var width = $(".logo > a > img").width();
				$("#logout_button").css("margin-left", width-165);
				$("#login_results").css("color", "blue");
				$("#login_results").html("Logged in as "+ array['username'] + '.');
				intake_table_update();
				if(data1 === "diary")
				{
					display_diary(0);
				}
			}else
			{
				return_val = "fail";
			}
			
		}, failure: function(){
			$("#login_results").html("Fail");
			return_val = "ajax fail";
		}
	});
	}else
	{
		return_val = "already logged in";
	}
	//alert("called cookielogin with cur_user = " + cur_user);
}

function is_user_logged_in()
{
	return logged_in;
}

function reload_menu()
{
	$("#logged_in").css("display", "none");
	$("#logged_out").css("display", "none");
	if(logged_in)
	{
		$("#logged_in").css("display", "block");
	}else
	{
		$("#logged_out").css("display", "block");
	}
}

function check_login_create_acc_page()
{
	$(window).load(function(){
		if(logged_in)
		{
			$("#results").css("color", "blue");
			$("#results").html("You're already logged in to " + cur_user + ". Creating a new account will log you out of your current account.");
		}
	});
	
}

function display_diary(day)
{
	if(logged_in)
	{
	     $.ajax({
	     	method: 'get',
	     	url: 'http://ec2-54-68-63-145.us-west-2.compute.amazonaws.com/PHP/show_diary.php',
	     	data: {
	     		'day' : day,
	     		'username' : cur_user
	     	},
	     	async: false,
	     	success: function(data){
	     		$("#Diary").html(data);   		
	     		$("#Diary_Entries_Table th").css("width", "100px");
	     		var width = $("#Diary_Entries_Table th").width();
				$("#date_buttons").css("margin-left", width-460);
				$("#date_buttons").css("margin-bottom", 30);
				$("#Diary").css("color", "black");
				$("#Diary_Entries_Table th").css("font-weight", "bold");
				$("#Diary_Entries_Table").css("border-collapse", "collapse");
				$("#Diary_Entries_Table td").css("padding-top", ".5em");
				$("#Diary_Entries_Table td").css("padding-bottom", ".5em");
				$("#Diary_Entries_Table tr").css("border", "solid");
				$("#Diary_Entries_Table tr").css("border-width", "1px 0");
				$("#Diary_Entries_Table tr").css("border-color", "#034c81");
	     	}
	     });	
	}else
	{
		$("#Diary").html('Please Log in above or <a href="http://localhost/WP/wordpress/macromagic/create-account" title="Create Account">create an account</a> to view your food diary!');
	}	
}

function add_entry(food_NDB_No)
{
	var weight = $("#Food_Amount").val();
	if(!weight)
	{
		weight = '0';
	}
	$.ajax({
		method: 'get',
		url: 'http://ec2-54-68-63-145.us-west-2.compute.amazonaws.com/PHP/add_entry.php',
		data: {
			'NDB_No' : food_NDB_No,
			'username': cur_user,
			'weight' : weight,
			'day' : cur_day
		},
		success: function(data){			
			if(data)
			{
				var check = $("#added_food").length;
				var back_button = $("#back_to_search_button").length;
				if(!check && !back_button)
				{
					$("#buttons").append("<span id = 'added_food'>  Successfully Added Food!</span>");
					$("#added_food").css("color", "green");
				}else if(check && !back_button)
				{
					$("#added_food").html("  Successfully Added Food!");
				}else if(!check && back_button)
				{
					$("#add_entry_button_p").append("<span id = 'added_food'>  Successfully Added Food!</span>");
					$("#added_food").css("color", "green");
				}else if(check && back_button)
				{
					$("#added_food").html("  Successfully Added Food!");
				}		
				intake_table_update();		
			}
		}
	});
}

function subtract_day()
{
	cur_day--;
	display_diary(cur_day);
	intake_table_update();
}

function add_day()
{
	cur_day++;
	display_diary(cur_day);
	intake_table_update();
}

function remove_entry(iddiary_entry)
{
	$.ajax({
		method: 'get',
		url: 'http://ec2-54-68-63-145.us-west-2.compute.amazonaws.com/PHP/remove_entry.php',
		data: {
			'id' : iddiary_entry,
			'day' : cur_day
		},
		success:function(data){
			if(data)
			{
				display_diary(cur_day);
				$("#food_journal_notify").html("Successfully removed entry.");
				$("#food_journal_notify").css("color", "green");
				intake_table_update();
			}
		}
	});
}

function view_goals()
{
	$.ajax({
		method: 'get',
		url: 'http://ec2-54-68-63-145.us-west-2.compute.amazonaws.com/PHP/fetch_goals.php',
		data: {
			'cur_user' : cur_user
		},
		success: function(data){
			var children = $(".post_title.single > span > a");
			children[0].text = cur_user + "'s Goals:";
			$("#Goal_Zone").html(data);
			$("#Goal_Zone").append("<div id = 'updated_goals_notify'><br></div>");
			$("#Goal_Zone").append("<div id = 'validate_goals_div'></div>");
			set_goal_on_clicks();
			if(($("#goal_calories").val() != "No Goal Set.") && ($("#goal_protein").val() != "No Goal Set.") && ($("#goal_fat").val() != "No Goal Set.") && ($("#goal_carbs").val() != "No Goal Set."))
			{
					validate_goals();
			}
			
		}
	});
}

function validate_goals()
{
	var checker = $("#goal_calories").val() - ($("#goal_protein").val()*4 + $("#goal_fat").val()*9 + $("#goal_carbs").val()*4);
			if(-50 > checker || checker > 50)
			{
				$("#updated_goals_notify").html("");
				$("#validate_goals_div").css("color", "red");
				$("#validate_goals_div").html("Goals for protein, fat, and carbohydrates do not add up to total calories. (If this is intentional, please ignore this message.)");
			}else
			{
				$("#validate_goals_div").css("background-color", "");
				$("#validate_goals_div").html("");
			}
}

function set_goal_on_clicks()
{
	$("#goal_calories").on("click", function(){
		$(this).val("");
	});
	
	$("#goal_carbs").on("click", function(){
		$(this).val("");
	});
	
	$("#goal_fat").on("click", function(){
		$(this).val("");
	});
	
	$("#goal_protein").on("click", function(){
		$(this).val("");
	});
	
}

function set_protein_goal(number_in_grams)
{
	$.ajax({
		method: 'get',
		url: 'http://ec2-54-68-63-145.us-west-2.compute.amazonaws.com/PHP/update_goals.php',
		data: {
			'type' : "protein",
			'goal' : number_in_grams,
			'user' : cur_user
		},
		success: function(data){
			var array = jQuery.parseJSON(data);
			if(array['status'] == "good")
			{
				$("#updated_goals_notify").css("color", "green");
				$("#updated_goals_notify").html("Successfully updated protein goal.");
				$("#updated_goals_notify").html();
				if(array['percentage'])
				{
					$("#goal_protein").val(array['updated_goal']);
				}
				if(($("#goal_calories").val() != "No Goal Set.") && ($("#goal_protein").val() != "No Goal Set.") && ($("#goal_fat").val() != "No Goal Set.") && ($("#goal_carbs").val() != "No Goal Set."))
				{
					validate_goals();
					$("#updated_goals_notify").css("color", "green");
					$("#updated_goals_notify").html("Successfully updated protein goal.");
				}
			}else
			{
				$("#updated_goals_notify").css("color", "");
				$("#updated_goals_notify").html("Failed to update protein goal.");
			}
		}
	});
}

function set_carb_goal(number_in_grams)
{
	$.ajax({
		method: 'get',
		url: 'http://ec2-54-68-63-145.us-west-2.compute.amazonaws.com/PHP/update_goals.php',
		data: {
			'type' : "carbs",
			'goal' : number_in_grams,
			'user' : cur_user
		},
		success: function(data){
			var array = jQuery.parseJSON(data);
			if(array['status'] == "good")
			{
				$("#updated_goals_notify").css("color", "green");
				$("#updated_goals_notify").html("Successfully updated carbohydrate goal.");
				if(array['percentage'])
				{
					$("#goal_carbs").val(array['updated_goal']);
				}
				if(($("#goal_calories").val() != "No Goal Set.") && ($("#goal_protein").val() != "No Goal Set.") && ($("#goal_fat").val() != "No Goal Set.") && ($("#goal_carbs").val() != "No Goal Set."))
				{
					validate_goals();
					$("#updated_goals_notify").css("color", "green");
					$("#updated_goals_notify").html("Successfully updated carbohydrate goal.");
				}
			}else
			{
				$("#updated_goals_notify").css("color", "");
				$("#updated_goals_notify").html("Failed to update carbohydrate goal.");
			}
		}
	});
}

function set_fat_goal(number_in_grams)
{
	$.ajax({
		method: 'get',
		url: 'http://ec2-54-68-63-145.us-west-2.compute.amazonaws.com/PHP/update_goals.php',
		data: {
			'type' : "fat",
			'goal' : number_in_grams,
			'user' : cur_user
		},
		success: function(data){
			var array = jQuery.parseJSON(data);
			if(array['status'] == "good")
			{
				$("#updated_goals_notify").css("color", "green");
				$("#updated_goals_notify").html("Successfully updated fat goal.");
				if(array['percentage'])
				{
					$("#goal_fat").val(array['updated_goal']);
				}
				if(($("#goal_calories").val() != "No Goal Set.") && ($("#goal_protein").val() != "No Goal Set.") && ($("#goal_fat").val() != "No Goal Set.") && ($("#goal_carbs").val() != "No Goal Set."))
				{
					validate_goals();
					$("#updated_goals_notify").css("color", "green");
					$("#updated_goals_notify").html("Successfully updated fat goal.");
				}
			}else
			{
				$("#updated_goals_notify").css("color", "");
				$("#updated_goals_notify").html("Failed to update fat goal.");
			}
		}
	});
}

function set_cal_goal(number)
{
	$.ajax({
		method: 'get',
		url: 'http://ec2-54-68-63-145.us-west-2.compute.amazonaws.com/PHP/update_goals.php',
		data: {
			'type' : "calories",
			'goal' : number,
			'user' : cur_user
		},
		success: function(data){
			var array = jQuery.parseJSON(data);
			if(array['status'] == "good")
			{
				$("#updated_goals_notify").css("color", "green");
				$("#updated_goals_notify").html("Successfully updated calorie goal.");
				if(($("#goal_calories").val() != "No Goal Set.") && ($("#goal_protein").val() != "No Goal Set.") && ($("#goal_fat").val() != "No Goal Set.") && ($("#goal_carbs").val() != "No Goal Set."))
				{
					validate_goals();
					$("#updated_goals_notify").css("color", "green");
					$("#updated_goals_notify").html("Successfully updated calorie goal.");
				}
			}else
			{
				$("#updated_goals_notify").css("color", "");
				$("#updated_goals_notify").html("Failed to update calorie goal.");
			}
		}
	});
}

function intake_table_update()
{
	if(cur_user !== "")
	{
		$.ajax({
			method: 'get',
			url: 'http://ec2-54-68-63-145.us-west-2.compute.amazonaws.com/PHP/daily_intake.php',
			data: {
				'username' : cur_user,
				'day' : cur_day
			},
			async: false,
			success: function(data){
				$("#daily_intake_div").html(data);
				$("#Daily_Intake_Table").css("width", "400px");
				$("#Daily_Intake_Table").css("text-align", "left");
			}
		});
	}
	
}