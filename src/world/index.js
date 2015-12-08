const Vec2 = require('../lib/vec2');
const Chunk = require('./chunk');
const util = require('../util');
const mod = util.mod;

const World = module.exports = function (data) {
	data = data || {};
	this.age = data.age || 0;
	this.objects = data.objects || [];

	this.width = 5;		// For rendering
	this.height = 3;	// ^^
	this.map = {};

	this.activeChunks = [];
	this.generate(0, 0);
	this.load(0, 0);
};

World.prototype.generate = function (X, Y, width, height) {
	X = X || 0;
	Y = Y || 0;

	for (let x = -width; x < width; x++) {
		for (let y = -height; y < height; y++) {
			if (!this.map[`${x + X},${y + Y}`]) {
				this.map[`${x + X},${y + Y}`] = Chunk.generate(x + X, y + Y);
			}
		}
	}

	this.load(X, Y, width, height);
};

World.prototype.load = function (X, Y, width, height) {
	X = X || 0;
	Y = Y || 0;

	this.activeChunks = [];
	for (let x = -width; x < width; x++) {
		for (let y = -height; y < height; y++) {
			this.activeChunks.push(this.map[`${x + X},${y + Y}`]);
		}
	}
};

World.prototype.get = function (x, y) {
	let X = Math.floor(x / SIZE);
	let Y = Math.floor(y / SIZE);
	let chunk = this.map[`${X},${Y}`];

	if (chunk) {
		return chunk.get(mod(x, SIZE), mod(y, SIZE));
	}
	return undefined;
};

World.prototype.set = function (x, y, v) {
	let X = Math.floor(x / SIZE);
	let Y = Math.floor(y / SIZE);
	let chunk = this.map[`${X},${Y}`];

	if (chunk) {
		chunk.set(mod(x, SIZE), mod(y, SIZE), v);
	}
	return undefined;
};

World.prototype.addObject = function (obj) {
	this.objects.push(obj);
};

World.prototype.tick = function (delta) {
	// this.generate(Math.round(this.player.pos.x / SIZE), Math.round(this.player.pos.y / SIZE));
	// this.load(Math.round(this.player.pos.x / SIZE), Math.round(this.player.pos.y / SIZE));
};

World.prototype.draw = function	 (context) {
	this.activeChunks.forEach(function (chunk, index) {
		chunk.draw(context);
	}, this);
};
