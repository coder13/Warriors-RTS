const Entity = module.exports = function (x, y, radius, color) {
	this.pos = {x, y};
	this.radius = radius || 1;
	this.color = color || 'black';
	this.destination = undefined;
};

Entity.prototype.command = function (command) {};

Entity.prototype.tick = function (delta) {};

Entity.prototype.build = function (graphics) {
	graphics.beginFill(this.color);
	graphics.lineStyle(1.5 / Scale, 0);
	graphics.drawCircle(this.x, this.y, this.radius);
	graphics.endFill();
};
