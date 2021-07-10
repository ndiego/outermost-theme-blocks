/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useEntityProp } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import { __experimentalGetSettings, dateI18n } from '@wordpress/date';
import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	ToolbarButton,
	ToggleControl,
	Popover,
	DateTimePicker,
	PanelBody,
	PanelRow,
	CustomSelectControl,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { edit } from '@wordpress/icons';

export default function PostModifiedDateEdit( {
	attributes: { textAlign, format, isLink, hasLabel, labelAfterDate, dateLabel },
	context: { postId, postType, queryId },
	setAttributes,
} ) {
	const isDescendentOfQueryLoop = !! queryId;
	const [ siteFormat ] = useEntityProp( 'root', 'site', 'date_format' );
	const [ date, setDate ] = useEntityProp(
		'postType',
		postType,
		'modified',
		postId
	);

	const settings = __experimentalGetSettings();
	// To know if the current time format is a 12 hour time, look for "a".
	// Also make sure this "a" is not escaped by a "/".
	const is12Hour = /a(?!\\)/i.test(
		settings.formats.time
			.toLowerCase() // Test only for the lower case "a".
			.replace( /\\\\/g, '' ) // Replace "//" with empty strings.
			.split( '' )
			.reverse()
			.join( '' ) // Reverse the string and test for "a" not followed by a slash.
	);
	const formatOptions = Object.values( settings.formats ).map(
		( formatOption ) => ( {
			key: formatOption,
			name: dateI18n( formatOption, date ),
		} )
	);
	const resolvedFormat = format || siteFormat || settings.formats.date;
	const blockProps = useBlockProps( {
		className: classnames( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
	} );

	let postDate = date ? (
		<time dateTime={ dateI18n( 'c', date ) }>
			{ dateI18n( resolvedFormat, date ) }
		</time>
	) : (
		__( 'No Modified Date' )
	);
	if ( isLink && date ) {
		postDate = (
			<a
				href="#post-modified-date-pseudo-link"
				onClick={ ( event ) => event.preventDefault() }
			>
				{ postDate }
			</a>
		);
	}

	const renderDateLabel = (
		<RichText
			className="wp-block-otb-post-modified-date__date-label"
			tagName="span"
			aria-label={ __( 'Modified date label' ) }
			placeholder={ __( 'Modified on' ) }
			value={ dateLabel }
			onChange={ ( newDateLabel ) =>
				setAttributes( { dateLabel: newDateLabel } )
			}
		/>
	);

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={ textAlign }
					onChange={ ( nextAlign ) => {
						setAttributes( { textAlign: nextAlign } );
					} }
				/>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={ __( 'Format settings' ) }>
					<CustomSelectControl
						hideLabelFromVision
						label={ __( 'Date Format' ) }
						options={ formatOptions }
						onChange={ ( { selectedItem } ) =>
							setAttributes( {
								format: selectedItem.key,
							} )
						}
						value={ formatOptions.find(
							( option ) => option.key === resolvedFormat
						) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Label settings' ) }>
					<PanelRow>
						<ToggleControl
							label={ __( 'Add date label' ) }
							onChange={ () =>
								setAttributes( { hasLabel: ! hasLabel } )
							}
							checked={ hasLabel }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={ __( 'Display label after date' ) }
							onChange={ () =>
								setAttributes( { labelAfterDate: ! labelAfterDate } )
							}
							checked={ labelAfterDate }
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody title={ __( 'Link settings' ) }>
					<ToggleControl
						label={ sprintf(
							// translators: %s: Name of the post type e.g: "post".
							__( 'Link to %s' ),
							postType
						) }
						onChange={ () => setAttributes( { isLink: ! isLink } ) }
						checked={ isLink }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				{ hasLabel && ! labelAfterDate && renderDateLabel }
				{ hasLabel && ! labelAfterDate && ' ' }
				{ postDate }
				{ hasLabel && labelAfterDate && ' ' }
				{ hasLabel && labelAfterDate && renderDateLabel }
			</div>
		</>
	);
}
