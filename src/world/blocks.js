var Block = require('./block');

module.exports = {
	0: null, // air
	1: Block(0xFF0000),	// Black
	2: Block(0x00FF00),	// Grass
	3: Block(0x0000FF),	// Water
	4: Block(0x404040)	// Mountain
};
