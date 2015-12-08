const Block = function (color) {
	this.color = color;
	this.friction = .5;
};

Block.prototype.draw = function (context, x, y) {
	context.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
	context.fillRect(x, y, 1, 1);
};

module.exports = function (color) {
	return new Block(color);
};
