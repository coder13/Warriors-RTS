const Layer = module.exports = function (x, y, data) {
	this.map = [];
};

Layer.prototype.fill = function (v) {
	for (let i = 0; i < SIZE * SIZE; i++) {
		this.map[i] = v;
	}
};

Layer.prototype.get = function (x, y) {
	return this.map[y * SIZE + x];
};

Layer.prototype.getIndex = function (i) {
	return this.map[i];
};

Layer.prototype.set = function (x, y, v) {
	this.map[y * SIZE + x] = v;
};

Layer.prototype.setIndex = function (i, v) {
	this.map[i] = v;
};
