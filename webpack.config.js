var webpack = require('hjs-webpack');
var path = require('path');

var config = webpack({
	in: 'src/app.js',
	out: 'public',
	isDev: true //process.env.NODE_ENV !== 'production'
});

config.node = {
	fs: 'empty',
	net: 'empty',
	tls: 'empty'
};

config.module.loaders.push({
	test: /\.josn$/,
	loader: 'josn-loader'
});

module.exports = config;
