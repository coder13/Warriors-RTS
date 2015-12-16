const Noise = require('noisejs').Noise;
const terrain = require('./blocks');
const Layer = require('./layer');

const noise = new Noise(Math.random());

const Chunk = function (x, y, data) {
	data = data || {};

	this.x = x;
	this.y = y;
	this.view = new Pixi.Graphics();
	this.outline = new Pixi.Graphics();
	this.view.addChild(this.outline);

	this.terrain = data.terrain || (new Layer());
	this.ground = data.ground || (new Layer());
	this.air = data.air || (new Layer());
	this.heightMap = data.heightMap || (new Layer());
	this.temperatureMap = data.temperatureMap || (new Layer());
};

Chunk.prototype._buildLayer = function (layer, blocks) {
	for (let i = 0; i < SIZE * SIZE; i++) {
		let x = i % SIZE;
		let y = (i - x) / SIZE;
		let v = layer.map[i];

		if (layer.map[i]) {
			blocks[layer.map[i]].draw(this.view, this.x * SIZE + x, this.y * SIZE + y);
		}
	}
};

Chunk.prototype._buildOutline = function () {
	this.outline.clear();
	this.outline.beginFill(0, 0);
	this.outline.lineStyle(1.5 / Scale, 0);
	this.outline.moveTo( this.x 	  * SIZE,  this.y	   * SIZE);
	this.outline.lineTo((this.x + 1) * SIZE,  this.y	   * SIZE);
	this.outline.lineTo((this.x + 1) * SIZE, (this.y + 1) * SIZE);
	this.outline.lineTo( this.x	  * SIZE, (this.y + 1) * SIZE);
	this.outline.endFill();
};

Chunk.prototype.build = function () {
	this.view.clear();
	this._buildLayer(this.terrain, terrain);
	this._buildLayer(this.ground, terrain);

	this._buildOutline();
};

module.exports.new = function (x, y, data) {
	return new Chunk(x, y, data);
};

module.exports.generate = function (X, Y) {
	let chunk = new Chunk(X, Y);

	for (let i = 0; i < SIZE * SIZE; i++) {
		let x = i % SIZE;
		let y = (i - x) / SIZE;

		let rx = chunk.x * SIZE + x;
		let ry = chunk.y * SIZE + y;

		let scale = 1 / 128;
		let value = noise.simplex2(rx * scale, ry * scale);
		let f = 2, w = 1 / 16;
		for (let current_f = 1, i = 1; i < 4; i++) {
			current_f *= f;
			value *= (1 - w);
			value += noise.simplex2(rx * current_f, ry * current_f) * w;
		}

		value += 1 / 2;

		if (value < 0.0125 ? value * value < 0.025 : value < 0.025) {
			chunk.terrain.map[i] = 3;
		} else if (value < .98) {
			chunk.terrain.map[i] = 2;
		} else {
			chunk.terrain.map[i] = 4;
		}
	}

	return chunk;
};
