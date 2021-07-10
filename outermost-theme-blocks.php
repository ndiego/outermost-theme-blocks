<?php
/**
 * Plugin Name:         Outermost Theme Blocks
 * Plugin URI:          https://www.nickdiego.com
 * Description:         Custom blocks for the Outermost theme.
 * Version:             0.1.0
 * Requires at least:   5.5
 * Requires PHP:        5.6
 * Author:              Nick Diego
 * Author URI:          https://www.nickdiego.com
 * License:             GPLv2
 * License URI:         https://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * Text Domain:         outermost-theme-blocks
 * Domain Path:         /languages
 *
 * GitHub Plugin URI:   ndiego/outermost-theme-blocks
 *
 * @package outermost-edd-utilities
 */

defined( 'ABSPATH' ) || exit;


function otb_register_editor_scripts_styles() {

	// Scripts.
	$asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php');

	wp_enqueue_script(
		'otb-editor-scripts',
		plugins_url( 'build/index.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version']
	);

	// Styles.
	//$asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php');

	wp_enqueue_style(
		'otb-editor-styles',
		plugins_url( 'build/index.css', __FILE__ ),
		array()
	);
}
add_action( 'enqueue_block_editor_assets', 'otb_register_editor_scripts_styles' );

//require_once plugin_dir_path( __FILE__ ) . 'src/blocks/user-info/index.php';
include_once dirname( __FILE__ ) . '/src/blocks/post-modified-date/index.php';
