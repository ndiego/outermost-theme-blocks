/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

import * as postModifiedDate from './post-modified-date';

const allBlocks = [
	postModifiedDate
];

/**
 * Function to register an individual block.
 *
 * @param {Object} block The block to be registered.
 *
 */
const registerBlock = ( block ) => {
	if ( ! block ) {
		return;
	}
	const { metadata, settings, name } = block;
	registerBlockType( { name, ...metadata }, settings );
};

// Register all blocks.
allBlocks.forEach( registerBlock );
