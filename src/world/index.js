const Vec2 = require('../lib/vec2');
const Chunk = require('./chunk');
const util = require('../util');
const mod = util.mod;

const World = module.exports = function (data) {
	data = data || {};
	this.age = data.age || 0;
	this.entities = data.entities || [];

	this.entityLayer = new Pixi.Container();
	this.view = new Pixi.Graphics();

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
				let chunk = Chunk.generate(x + X, y + Y);
				chunk.build();
				this.map[`${x + X},${y + Y}`];
			}
		}
	}

	this.load(X, Y, width, height);
};

World.prototype.load = function (X, Y, width, height) {
	X = X || 0;
	Y = Y || 0;

	this.activeChunks = [];
	this.view.clear();
	for (let x = -width; x < width; x++) {
		for (let y = -height; y < height; y++) {
			let rx = Math.round(X + x), ry = Math.round(Y + y);
			if (!this.map[`${rx},${ry}`]) {
				let chunk = Chunk.generate(rx, ry);
				chunk.build();
				this.map[`${rx},${ry}`] = chunk;
			}

			this.view.addChild(this.map[`${rx},${ry}`].view);
			this.activeChunks.push(this.map[`${rx},${ry}`]);
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

World.prototype.spawn = function (entity) {
	this.entities.push(entity);
	entity.build();
	this.entityLayer.addChild(entity.view);
};

World.prototype.tick = function (delta) {
	this.entities.forEach(function (entity) {
		entity.tick(delta);
	});
	// this.generate(Math.round(this.player.pos.x / SIZE), Math.round(this.player.pos.y / SIZE));
	// this.load(Math.round(this.player.pos.x / SIZE), Math.round(this.player.pos.y / SIZE));
};

World.prototype.build = function () {
	this.view.clear();
	this.activeChunks.forEach(function (chunk, index) {
		chunk.build();
	}, this);
};
