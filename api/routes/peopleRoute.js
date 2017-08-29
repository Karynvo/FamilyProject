'use strict';
module.exports = function(app){
	var peopleList = require('../controllers/peopleController');

	app.route('/people')
		.get(peopleList.list_all_people)
		.post(peopleList.create_a_person);

	app.route('/people/:personId')
		.get(peopleList.get_a_person)
		.put(peopleList.update_a_person)
		.delete(peopleList.delete_a_person);
};