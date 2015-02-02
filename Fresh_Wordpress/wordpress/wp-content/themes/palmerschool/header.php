<?php
/**
 * The header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package PalmerSchool
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
	<div class = 'top_wrap clearfix'>
		<div class = 'top_header clearfix'>
			<p id = 'date_field' class = 'date'>Date</p>
			<p class = 'text'>Text Size <button id = 'font_larger' class = 'font_button'>+</button><button id = 'font_smaller' class = 'font_button'>-</button></p>
		</div>
	</div>
<div id="page" class="hfeed site">
	<a class="skip-link screen-reader-text" href="#content"><?php _e( 'Skip to content', 'palmerschool' ); ?></a>

	<header id="masthead" class="site-header" role="banner">
		<div class = 'logo_head_container clearfix'>
			<div class = 'logo_head clearfix'>
				<div class = 'logo'></div>
				<div class = 'title'><a href = '/'>Palmer School</a></div>
				<div class = 'small_title'><a href = '/' >A Co-Educational Day School For Junior Kindergarten Through Eighth Grades</a></div>
			</div>			
		</div>
	<div class = "nav-wrap">
		<nav id="site-navigation" class="main-navigation" role="navigation">
			<button class="menu-toggle" aria-controls="menu" aria-expanded="false"><?php _e( '<a href="#menu" class="box-shadow-menu"></a>', 'palmerschool' ); ?></button>
			<?php wp_nav_menu( array( 'theme_location' => 'primary' ) ); ?>
		</nav><!-- #site-navigation -->
	</div>
	</header><!-- #masthead -->

	<div id="content" class="site-content">
