var webpack = require('hjs-webpack');
var path = require('path');

var config = webpack({
	in: 'src/app.js',
	out: 'public',
	isDev: true //process.env.NODE_ENV !== 'production'
});

module.exports = config;
