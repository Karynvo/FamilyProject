(function(){
	var app = angular.module("myApp", ['ngRoute']);

	// only for spa syntax ex. /#/person
	app.config(function($routeProvider){
		$routeProvider
		.when("/", {
			templateUrl: 'views/person.html',
			controller: "AppCtrl"
		})
		.when("/people/:peopleId", {
			templateUrl: 'views/persondetail.html',
			controller: "PersonCtrl"
		});
	});
})();