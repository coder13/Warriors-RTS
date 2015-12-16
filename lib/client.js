const Model = require('ampersand-model');
const uuid = require('uuid');

module.exports = Model.extend({
	props: {
		uuid: 'string',
		username: 'string'
	},

	initialize: function (options) {
		this.uuid = options.uuid || uuid.v4();
		this.username = options.username || this.uuid;
	}
});
