require('./styles/main.styl');

// constants:
const SIZE = window.SIZE = 32; // Chunk Size
window.Scale = 12; // Chunk Size

const App = require('ampersand-app');
const Pixi = window.Pixi = require('pixi.js');
const Vec2 = require('./lib/vec2');
const Entity = require('./entity');
const World = require('./world');

const requestAnimationFrame = window.requestAnimationFrame ||
						window.webkitRequestAnimationFrame ||
						window.msRequestAnimationFrame ||
						window.mozRequestAnimationFrame;

const app = window.app = App.extend({
	keys: {},
	mouse: {down: false, x: 0, y: 0},
	pos: {x: 0, y: 0},

	init() {
		this.width = (window.innerWidth || document.body.width);
		this.height = (window.innerHeight || document.body.height);

		// this.canvas = document.createElement('canvas');
		// this.context = this.canvas.getContext('2d');
		// this.canvas.width = this.width;
		// this.canvas.height = this.height;

		this.renderer = new Pixi.WebGLRenderer(this.width, this.height);
		this.renderer.autoResize = true;
		document.body.appendChild(this.renderer.view);
		// document.body.appendChild(this.canvas);

		this.stage = new Pixi.Container(0xFFFF00, true);
		this.stage.x = this.width / 2;
		this.stage.y = this.height / 2;
		this.scale(Scale);

		this.initInput();
		this.start();

		this.animate();
	},

	initInput () {
		window.addEventListener('mousedown', (event) => {
			console.log(event);
			this.mouse.down = true;
			this._moveMouse(event);
			this.events.mousedown.call(this, event);
		});

		window.addEventListener('mouseup', (event) => {
			this.mouse.down = false;
			this._moveMouse(event);
		});

		window.addEventListener('mousemove', (event) => {
			this._moveMouse(event);
			this.events.mousemove.call(this, event);
		});

		this.renderer.view.onmousewheel = this.events.mousewheel.bind(this);

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
		console.log(width, height);
	},

	_moveMouse (event) {
		this.mouse.x = event.x;
		this.mouse.y = event.y;
	},

	started: false,
	events: {
		mousedown (event) {
			console.log(this.mousePos());
		},

		mouseup (event) {
		},

		mousemove (event) {
			if (this.mouse.down && this.keys[17]) {
				this.pos.x += Math.round((event.movementX) * Scale) / Scale;
				this.pos.y += Math.round((event.movementY) * Scale) / Scale;
				// this.reload();
			}
		},

		mousewheel (event) {
			let delta = event.wheelDelta / 120;
			if (delta < 0) {
				if (Scale > 1.5) {
					Scale /= 2;
				}
			} else {
				Scale *= 2;
			}

			this.scale(Scale);

			this.reload();
			event.preventDefault();
		},

		keydown (event) {
			console.log('keydown', event.keyCode);
		},

		keyup (event) {

		},

		keydownOnce (event) {
			if (event.which === 83) {
				let mp = this.mousePosExact();
				let entity = new Entity(mp.x, mp.y, 4, 0xFF0000);
				this.world.spawn(entity);
				entity.build(this.graphics);
				console.log('spawned entity at', mp.x, mp.y);
			}
		},

		keypress (event) {
		}
	},

	mousePos () {
		return new Vec2(Math.floor(this.pos.x + (this.mouse.x - app.width / 2) / Scale), Math.floor(this.pos.y + (app.height / 2 - this.mouse.y) / Scale));
	},

	mousePosExact () {
		return new Vec2(this.pos.x + (this.mouse.x - app.width / 2) / Scale, this.pos.y + (app.height / 2 - this.mouse.y) / Scale);
	},

	scale (scale) {
		this.Scale = scale;
		if (this.world) {
			this.world.view.scale.x = Scale;
			this.world.view.scale.y = -Scale;
		}
	},

	reload (x, y) {
		x = x || this.pos.x;
		y = y || this.pos.y;
		if (this.world) {
			this.world.load(Math.round(x / SIZE / -Scale), Math.round(y / SIZE / Scale), Math.ceil(app.width / Scale / SIZE / 2) + 1, Math.ceil(app.height / Scale / SIZE / 2) + 1);
			this.renderer.render(this.stage);
		}
	},

	// Initiate all game objects and start loop.
	start () {
		this.delta = 0;

		// In future: load world after connecting to server.
		this.world = new World();
		// this.world.generate(this.pos.x, this.pos.y, 40, 20);
		this.reload(0, 0);
		this.scale(Scale)

		this.world.build();
		this.stage.addChild(this.world.view);

		this.pointer = new Pixi.Graphics();
		let mp = this.mousePos();
		this.pointer.x = mp.x;
		this.pointer.y = mp.y;
		this.pointer.beginFill(0, 0);
		this.pointer.lineStyle(1 / Scale, 0);
		this.pointer.moveTo(0, 0);
		this.pointer.lineTo(1, 0);
		this.pointer.lineTo(1, 1);
		this.pointer.lineTo(0, 1);
		this.pointer.endFill();

		this.stage.addChild(this.pointer);

		let now, then = Date.now();
		this.animate = function () {
			now = Date.now();
			this.delta = (now - then);

			this.tick(this.delta);
			this.renderer.render(this.stage);

			requestAnimationFrame(this.animate.bind(this));
			then = now;
		};

		requestAnimationFrame(this.animate.bind(this));
	},

	tick (delta) {
		this.input(delta);

		this.world.view.x = this.pos.x;
		this.world.view.y = this.pos.y;

		let mp = this.mousePos();
		this.pointer.x = mp.x;
		this.pointer.y = mp.y;

		this.world.tick(delta);
	},

	input (delta) {
		let speed = Scale / 2;
		if (this.keys[37]) {
			this.pos.x += speed;
		} else if (this.keys[39]) {
			this.pos.x -= speed;
		}

		if (this.keys[38]) {
			this.pos.y += speed;
		} else if (this.keys[40]) {
			this.pos.y -= speed;
		}
		this.reload();
	}
});

app.init();
