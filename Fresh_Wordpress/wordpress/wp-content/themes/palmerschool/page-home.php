<?php
/*
Template Name: Home
*/

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
		<div class = 'home_container'>
			<div class = 'gallery_background'>
				<?php echo do_shortcode('[wonderplugin_slider id="1"]'); ?>
			</div>
		</div>
		</main><!-- #main -->
	</div><!-- #primary -->

<?php get_sidebar(); ?>
<?php get_footer(); ?>
