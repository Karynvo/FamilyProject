'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PersonSchema = new Schema({
	name: {
		type: String,
		required: 'Name of person'
	},
	description: {
		type: String,
		default: 'Empty description'
	},
	profileImg: {
		type: String,
		default: 'default-person.png'
	}
});

module.exports = mongoose.model('Person', PersonSchema);