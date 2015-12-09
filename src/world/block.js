const Block = function (color) {
	this.color = color;
	this.friction = .5;
};

Block.prototype.draw = function (graphics, x, y) {
	graphics.beginFill(this.color);
	graphics.lineStyle(0, 0);
	graphics.drawRect(x, y, 1, 1);
};

module.exports = function (color) {
	return new Block(color);
};
