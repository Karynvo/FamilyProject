'use strict';

(function(){
	var myApp = angular.module('myApp');

	var AppCtrl = function($scope, $http){

		var onPersonGetCompleted = function(response){
			$scope.persons = response.data;
			console.log($scope.persons);
		}

		var refresh = function(){
			$http.get('/people')
				.then(onPersonGetCompleted);
			console.log("refresh finished");
		}

		refresh();
	}
	myApp.controller('AppCtrl', AppCtrl);

	var PersonCtrl = function($scope, $http, $routeParams){

		$http.get('/people/' + $routeParams.peopleId)
				.then(onGetByIdCompleted);
			console.log($routeParams.peopleId);

		var onGetByIdCompleted = function(response){
			$scope.person = response.data;
			console.log("onGetByIdCompleted");
		}
	}
	myApp.controller('PersonCtrl', PersonCtrl);
})();