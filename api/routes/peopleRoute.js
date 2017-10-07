'use strict';
module.exports = function(app){
	var person = require('../controllers/peopleController');

	app.route('/people')
		.get(person.list_all_people)
		.post(person.create_a_person);

	app.route('/people/:personId')
		.get(person.get_a_person)
		.put(person.update_a_person)
		.delete(person.delete_a_person);
};