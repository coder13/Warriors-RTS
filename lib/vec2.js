var Vec2 = module.exports = function (x, y) {
	this.x = x;
	this.y = y;
};

Vec2.prototype.add = function (b) {
	return new Vec2(this.x + b.x, this.y + b.y);
};

Vec2.prototype.scale = function (k) {
	return new Vec2(this.x * k, this.y * k);
};

Vec2.prototype.norm = function () {
	var length = Math.sqrt(this.x * this.x + this.y * this.y);
	return new Vec2(this.x / length, this.y / length);
};
