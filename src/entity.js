const Entity = module.exports = function (x, y, radius, color) {
	this.view = new Pixi.Graphics();
	this.x = x;
	this.y = y;
	this.radius = radius || 1;
	this.color = color || 'black';
	this.destination = undefined;
};

Entity.prototype.command = function (command) {};

Entity.prototype.tick = function (delta) {
	let d = (Math.random() + 1) * Math.PI;
	this.x += Math.cos(d) * delta / 100;
	this.y += Math.sin(d) * delta / 100;

	this.view.x = this.x;
	this.view.y = this.y;
};

Entity.prototype.build = function () {
	this.view.beginFill(this.color);
	this.view.lineStyle(1.5 / Scale, 0);
	this.view.drawCircle(this.x, this.y, this.radius);
	this.view.endFill();
};
