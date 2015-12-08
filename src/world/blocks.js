var Block = require('./block');

module.exports = {
	0: null, // air
	1: Block({r:   0, g:   0, b:   0}), // Black
	2: Block({r:   0, g: 255, b:   0})  // Grass
};
