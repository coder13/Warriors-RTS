const winston = require('winston');

module.exports = new winston.Logger({
	transports: [
		new winston.transports.File({
			level: 'info',
			filename: './logs/all-logs.log',
			handleExceptions: true,
			json: false,
			maxsize: 8 * 1024 * 1024, // 8MB
			maxFiles: 5,
			colorize: false
		}),
		new winston.transports.Console({
			level: 'debug',
			handleExceptions: false,
			json: false,
			colorize: true
		})
	],
	exitOnError: false
});
