const Noise = require('noisejs').Noise;
const Blocks = require('./blocks');

const noise = new Noise(Math.random());

const Chunk = function (x, y, data) {
	this.x = x;
	this.y = y;
	this.view = new Pixi.Graphics();

	if (data) {
		this.map = data;
	} else {
		this.map = [];
		this.fill(0);
	}

};

Chunk.prototype.fill = function (v) {
	for (let i = 0; i < SIZE * SIZE; i++) {
		this.map[i] = v;
	}
};

Chunk.prototype.get = function (x, y) {
	return this.map[y * SIZE + x];
};

Chunk.prototype.set = function (x, y, v) {
	this.map[y * SIZE + x] = v;
};

Chunk.prototype.build = function () {
	this.view.clear();
	for (let i = 0; i < SIZE * SIZE; i++) {
		let x = i % SIZE;
		let y = (i - x) / SIZE;
		let v = this.map[i];

		if (this.map[i]) {
			Blocks[this.map[i]].draw(this.view, this.x * SIZE + x, this.y * SIZE + y);
		}
	}

	// draw outline
	this.view.beginFill(0, 0);
	this.view.lineStyle(3 / Scale, 0);
	this.view.moveTo( this.x 	  * SIZE,  this.y	   * SIZE);
	this.view.lineTo((this.x + 1) * SIZE,  this.y	   * SIZE);
	this.view.lineTo((this.x + 1) * SIZE, (this.y + 1) * SIZE);
	this.view.lineTo( this.x	  * SIZE, (this.y + 1) * SIZE);
	this.view.endFill();
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

		let value = noise.simplex2(rx / 64, ry / 64);
		let f = 2, w = 1 / 32;
		for (let current_f = 1, i = 1; i < 4; i++) {
			current_f *= f;
			value *= (1 - w);
			value += noise.simplex2(rx * current_f, ry * current_f) * w;
		}

		value += 1 / 2;

		if (value < 0.05) {
			chunk.map[i] = 3;
		} else if (value < .96) {
			chunk.map[i] = 2;
		} else {
			chunk.map[i] = 4;
		}

		if (rx === 0 && ry === 0) {
			chunk.map[i] = 1;
		}
	}

	return chunk;
};
