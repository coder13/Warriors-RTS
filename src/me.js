const app = require('ampersand-app');
const socketIO = require('socket.io-client');
const Model = require('ampersand-model');

module.exports = Model.extend({
	props: {
		username: 'string',
		level: 'number',
		xp: 'number'
	},

	initialize () {
		this.connect();
	},

	connect (location) {
		location = location || 'localhost:8080';
		console.log('[socket.io] connecting to', location);
		app.io = socketIO(location);

		for (event in this.events) {
			app.io.on(event, this.events[event]);
		}
	},

	events: {
		connect (data) {
			console.log('[socket.io] Connected to server');
			app.io.emit('get_world');
		},

		disconnect (data) {
			console.log('[socket.io] Disconnected from server');
		},

		world_got (data) {
			console.log(data);
		}
	},


	save () {
		console.log(this);
	}

});
