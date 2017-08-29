'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PersonSchema = new Schema({
	name: {
		type: String,
		required: 'Name of person'
	},
	dob: {
		type: String,
		default: 'Unknown'
	},
	description: {
		type: String,
		default: 'Empty description'
	}
});

module.exports = mongoose.model('Person', PersonSchema);