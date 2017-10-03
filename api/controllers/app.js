(function(){
	var app = angular.module("myApp", ['ngRoute']);

	// only for spa syntax ex. /#!/person
	app.config(function($routeProvider){
		$routeProvider
		.when("/", {
			templateUrl: 'views/treeDiagram.html',
			controller: "TreeCtrl"
		})
		.when("/people", {
			templateUrl: 'views/person.html',
			controller: "AppCtrl"
		})
		.when("/people/:peopleId", {
			templateUrl: 'views/persondetail.html',
			controller: "PersonCtrl"
		})
		.when("/history", {
			templateUrl: 'views/historyIndex.html'
		})
		.when("/history/:historyPage", {
			templateUrl: function(routeParams){
				return "views/" + routeParams.historyPage + ".html";
			}
		});
	});
})();