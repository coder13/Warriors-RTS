const Noise = require('noisejs').Noise;
const Blocks = require('./blocks');

const noise = new Noise(Math.random());

const Chunk = function (x, y, data) {
	this.x = x;
	this.y = y;

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

Chunk.prototype.draw = function (context) {
	context.save();
	context.translate(this.x * SIZE, this.y * SIZE);

	for (let i = 0; i < SIZE * SIZE; i++) {
		let x = i % SIZE;
		let y = (i - x) / SIZE;
		let v = this.map[i];

		if (this.map[i]) {
			Blocks[this.map[i]].draw(context, x, y);
		}
	}

	context.lineWidth = 1 / 4;
	context.beginPath();
	context.rect(this.x, this.y, SIZE + 1, SIZE + 1);
	context.stroke();

	context.restore();
};

module.exports.new = function (x, y, data) {
	return new Chunk(x, y, data);
};

module.exports.generate = function (x, y) {
	let chunk = new Chunk(x, y);

	for (let i = 0; i < SIZE * SIZE; i++) {
		let x = i % SIZE;
		let y = (i - x) / SIZE;

		let rx = chunk.x * SIZE + x;
		let ry = chunk.y * SIZE + y;

		chunk.map[i] = noise.simplex2(rx / 16, ry / 16) < 0 ? 0 : 2;
	}

	return chunk;
};

module.exports.noise = function (x, y) {
	let chunk = new Chunk(x, y);

	for (let i = 0; i < SIZE * SIZE; i++) {
		let x = i % SIZE;
		let y = (i - x) / SIZE;

		let rx = chunk.x * SIZE + x;
		let ry = chunk.y * SIZE + y;

		chunk.map[i] = noise.simplex2(rx / 8, ry / 8) < 0 ? 0 : 1;
	}

	return chunk;
};
