require('./styles/main.styl');

// constants:
const SIZE = window.SIZE = 16; // Chunk Size

const App = require('ampersand-app');
const Vec2 = require('./lib/vec2');
// const Player = require('./player');
const World = require('./world');
// const {fix, mod} = require('./util');

const requestAnimationFrame = window.requestAnimationFrame ||
						window.webkitRequestAnimationFrame ||
						window.msRequestAnimationFrame ||
						window.mozRequestAnimationFrame;

const app = window.app = App.extend({
	Scale: 8,
	keys: {},
	mouse: {down: false, x: 0, y: 0},
	pos: {x: 0, y: 0},

	init() {
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		this.canvas.width = (window.innerWidth || document.body.width);
		this.canvas.height = (window.innerHeight || document.body.height);

		this.width = this.canvas.width;
		this.height = this.canvas.height;
		document.body.appendChild(this.canvas);

		this.initInput();
		this.start();

		this.animate();
	},

	initInput () {
		this.canvas.addEventListener('mousedown', (event) => {
			this.mouse.down = true;
			this._moveMouse(event);
			this.events.mousedown.call(this, event);
		});

		this.canvas.addEventListener('mouseup', (event) => {
			this.mouse.down = false;
			this._moveMouse(event);
		});

		this.canvas.addEventListener('mousemove', (event) => {
			this._moveMouse(event);
			this.events.mousedown.call(this, event);
		});

		window.addEventListener('keydown', (event) => {
			if (this.keys[event.which] === undefined || this.keys[event.which] === 0) {
				this.keys[event.which] = 1;
			} else if (this.keys[event.which]) {
				this.keys[event.which]++;
			}

			if (this.keys[event.which] && this.keys[event.which] < 2) {
				this.events.keydownOnce.call(this, {which: event.which});
			}

			this.events.keydown.call(this, event);
		});

		window.addEventListener('keyup', (event) => {
			if (this.keys[event.which]) {
				this.events.keypress.call(this, {which: event.which});
			}
			this.keys[event.which] = 0;
			this.events.keyup.call(this, event);
		});
	},

	resize (width, height) {
		this.setProps({width, height});
	},

	_moveMouse (event) {
		this.mouse.x = event.x;
		this.mouse.y = event.y;
	},

	events: {
		mousedown (event) {
			if (this.mouse.down) {
				let mp = this.mousePos();
				console.log(mp);
			}
		},

		mouseup (event) {
		},

		mousemove (event) {

		},

		keydown (event) {
			if (event.keyCode === 37) {
				this.pos.x--;
			} else if (event.keyCode === 39) {
				this.pos.x++;
			}

			if (event.keyCode === 38) {
				this.pos.y++;
			} else if (event.keyCode === 40) {
				this.pos.y--;
			}

			this.reload();
		},

		keyup (event) {

		},

		keydownOnce (event) {

		},

		keypress (event) {
		}
	},

	mousePos () {
		return new Vec2(Math.floor(this.pos.x + (this.mouse.x - app.width / 2) / this.Scale), Math.floor(this.pos.y + (app.height / 2 - this.mouse.y) / this.Scale));
	},

	reload () {
		if (this.world) {
		this.world.load(Math.round(this.pos.x / SIZE), Math.round(this.pos.y / SIZE), Math.ceil(this.width / this.Scale / SIZE), Math.ceil(this.height / this.Scale / SIZE));
		}
	},

	// Initiate all game objects and start loop.
	start () {
		this.delta = 0;

		// In future: load world after connecting to server.
		this.world = new World();
		this.world.generate(this.pos.x, this.pos.y, 50, 20);
		this.world.load(Math.round(this.pos.x / SIZE), Math.round(this.pos.y / SIZE), Math.ceil(this.width / this.Scale / SIZE), Math.ceil(this.height / this.Scale / SIZE));

		let now, then = Date.now();
		this.animate = function () {
			now = Date.now();
			this.delta = (now - then);
			// this.delta = 1;

			this.tick(this.delta);
			this.draw(this.context);

			requestAnimationFrame(this.animate.bind(this));
			then = now;
		};

		requestAnimationFrame(this.animate.bind(this));
	},

	tick (delta) {
		this.world.tick(delta);
	},

	draw (context) {
		context.fillStyle = 'rgb(255,255,255)';
		context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		context.save();

		context.translate(app.width / 2, app.height / 2);
		context.scale(this.Scale, -this.Scale);
		context.translate(-this.pos.x, -this.pos.y);

		this.world.draw(context);

		let mp = this.mousePos();
		context.lineWidth = 1 / this.Scale;
		context.beginPath();
		context.rect(mp.x, mp.y, 1, 1);
		context.stroke();
		context.restore();

		context.fillStyle = 'rgb(255, 0, 0)';
		context.font = '48px serif';

		context.fillText(`${Math.round(1000 / this.delta)}    ${this.pos.x}, ${this.pos.y}`, 0, 32);
	}
});

app.init();
