'use strict';

const config = {
	server: {
		host: '0.0.0.0',
		port: 8080
	}
};

const App = require('ampersand-app');
const colors = require('colors');
const Hapi = require('hapi');
const socketIO = require('socket.io');
const Client = require('./lib/client');
const Logger = require('./lib/util/logger');
const World = require('./lib/world');

const app = global.app = App.extend({
	init: function () {
		this.server = global.server = new Hapi.Server();
		server.connection({
			host: config.server.host,
			port: config.server.port
		});

		this.clients = new Map();

		global.io = socketIO(server.listener);
		io.on('connection', this.events.connection.bind(this));

		this.logger = Logger;

		this.start();
	},

	events: {
		connection: function (socket) {
			let client = new Client(socket);
			this.clients.set(client.uuid, client);
		}
	},

	start: function () {
		server.start(function (err) {
			if (err) {
				console.error(err);
				app.stop();
			} else {
				console.log('Server started at', colors.green(server.info.uri));
			}
		});
	},


	stop: function () {
		winston.log('stopping...'.red);
		server.stop();
	}
});

app.init();
