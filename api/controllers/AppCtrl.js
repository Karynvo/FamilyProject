'use strict';

(function(){
	var myApp = angular.module('myApp');

	var AppCtrl = function($scope, $http, $routeParams){

		var onPersonGetCompleted = function(response){
			$scope.persons = response.data;
		}

		var refresh = function(){
			$http.get('/people')
				.then(onPersonGetCompleted);
		}

		$scope.updatePerson = function(index){
			var selectedPerson = $scope.persons[index];
			$http.put('/people/' + selectedPerson._id, selectedPerson)
				.then(refresh());
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

		$scope.getSpouseId = function(){
			if($scope.person.spouse !== undefined)
				return $scope.person.spouse.replace(" ", "-");
		}
	}
	myApp.controller('PersonCtrl', PersonCtrl);
})();