'use strict';

(function(){
	var myApp = angular.module('myApp');

	var AppCtrl = function($scope, $http){

		var onPersonGetCompleted = function(response){
			$scope.persons = response.data;
		}

		var refresh = function(){
			$http.get('/people')
				.then(onPersonGetCompleted);
			console.log("refersh");
		}

		refresh();
	}
	myApp.controller('AppCtrl', AppCtrl);

	var PersonCtrl = function($scope, $http, $routeParams){

		var onGetByIdCompleted = function(response){
			$scope.person = response.data;
		}

		$http.get('/people/' + $routeParams.peopleId)
				.then(onGetByIdCompleted);
	}
	myApp.controller('PersonCtrl', PersonCtrl);
})();