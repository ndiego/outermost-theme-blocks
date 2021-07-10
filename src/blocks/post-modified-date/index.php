<?php
/**
 * Server-side rendering of the `otb/post-modified-date` block.
 *
 * @package Outermost Theme Blocks
 */

/**
 * Renders the `otb/post-modified-date` block on the server.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 * @return string  Returns the filtered post modified date for the current post wrapped inside "time" tags and with an optional label.
 */
function render_block_post_modified_date( $attributes, $content, $block ) {
	if ( ! isset( $block->context['postId'] ) ) {
		return '';
	}

	$post_ID            = $block->context['postId'];
	$align_class_name   = empty( $attributes['textAlign'] ) ? '' : "has-text-align-{$attributes['textAlign']}";
	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $align_class_name ) );
	$formatted_date     = get_the_modified_date( isset( $attributes['format'] ) ? $attributes['format'] : '', $post_ID );
	if ( isset( $attributes['isLink'] ) && $attributes['isLink'] ) {
		$formatted_date = sprintf( '<a href="%1s">%2s</a>', get_the_permalink( $post_ID ), $formatted_date );
	}

	$date_string = sprintf(
		'<time datetime="%1$s">%2$s</time>',
		get_the_modified_date( 'c', $post_ID ),
		$formatted_date
	);

	if ( isset( $attributes['hasLabel'] ) && $attributes['hasLabel'] ) {
		$date_label =
			empty( $attributes['dateLabel'] )
				? __( 'Modifed on', 'outermost-theme-blocks' )
				: esc_html( $attributes['dateLabel'] );

		if (
			isset( $attributes['labelAfterDate'] )
			&& $attributes['labelAfterDate']
		) {
			$date_string = $date_string . ' ' . $date_label;
		} else {
			$date_string = $date_label . ' ' . $date_string;
		}
	}

	return sprintf(
		'<div %1$s>%2$s</div>',
		$wrapper_attributes,
		$date_string
	);
}

function register_block_post_modified_date() {

	register_block_type_from_metadata(
		__DIR__, // This needs to target the directory that the block.json is in.
		array(
			'render_callback' => 'render_block_post_modified_date'
		)
	);
}
add_action( 'init', 'register_block_post_modified_date' );
