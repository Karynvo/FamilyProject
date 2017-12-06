'use strict';

(function(){
	var myApp = angular.module('myApp');

	var renderTree = function($scope) {
		
		var margin = { top: 10, right: 150, bottom: 10, left: 150 },
		    width = 960 - margin.left - margin.right,
		    height = 640 - margin.top - margin.bottom;

		var svg = d3.select('.treeDiv').append('svg')
		    .attr('width', width + margin.left + margin.right)
		    .attr('height', height + margin.top + margin.bottom),
		  g = svg.append('g')
		    .attr('transform', 'translate(' + 
		    	margin.left + ',' + margin.top + ')');

			var treemap = d3.tree().size([height, width]);

			var table = $scope.persons;

			var root = d3.stratify()
			.id(function(d) { return d.name; })
			.parentId(function(d){ return d.parent; })
			(table);

			var link = g.selectAll(".normal-link")
		    .data(treemap(root).links())
		    .enter().append("path")
		      .attr("class", "normal-link")
		      .attr("d", d3.linkHorizontal()
		          .x(function(d) { return d.y; })
		          .y(function(d) { return d.x; }));

		  var node = g.selectAll(".node")
		    .data(root.descendants())
		    .enter().append("g")
		      .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
		      .attr("id", function(d) { return turnNameToId(d.data.name); })
		      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

		  node.append("circle")
		      .attr("class", "normalCircle")
		      .on("click", function(d){

		      	if($scope.pivot == null){
		      		$scope.pivot = d;
		      	}else{ //switch pivot
		      		$scope.oldPivotId = turnNameToId($scope.pivot.data.name);
		      		$scope.pivot = d;
		        }

		      	d3.select(this)
		      		.classed("normalCircle", false)
		      		.classed("turnRedOther", false)
		      		.classed("turnRedPivot", true);
		      	$scope.$apply();
		      })
		      .on("mouseover", function(d){
		      	if($scope.pivot != null && $scope.pivot != d){

		      		d3.select("#" + $scope.oldPivotId)
		      			.select("circle")
		      			.classed("turnRedOther", false)
		      			.classed("turnRedPivot", false)
		      			.classed("normalCircle", true);

		      		d3.selectAll(".pathCircle")
		      			.classed("pathCircle", false)
		      			.classed("normalCircle", true);
			      	createPaths($scope.pivot, d);
			      	$scope.relation = getRelation($scope.pivot, d);
		        
			      	d3.select(this)
			      		.classed("normalCircle", false)
			      		.classed("turnRedOther", true);
			      	$scope.$apply();
		      	}else if($scope.pivot == null){
		      		d3.select("#" + turnNameToId(d.id))
		      			.select("circle")
		      			.classed("normalCircle", false)
		      			.classed("turnRedOther", true);
		      	}
		      })
		      .on("mouseout", function(d){
		      	if($scope.pivot != d){
		      		d3.select(this)
		      			.classed("turnRedOther", false)
		      			.classed("normalCircle", true);

		      		d3.selectAll(".path-link")
		      			.classed("path-link", false)
		      			.classed("normal-link", true);
		      	}else if($scope.pivot == null){
		      		d3.select("#" + turnNameToId(d.id))
		      			.select("circle")
		      			.classed("turnRedOther", false)
		      			.classed("normalCircle", true);
		      	}
		      });

		  // draw links for member in tree
		  node.append("a")
		  		.attr("class", "memberText")
		  		.attr("href", function(d) { 
		  			return "#!/people/" + parseId(d.data._id); 
		  		});

		  // add label for member in tree
		  node.selectAll(".memberText")
		  		.append("text")
		  	  .attr("class", "member")
		      .attr("dy", function(d) { return d.data.spouse ? -6 : 3; })
		      .attr("x", function(d) { return d.children ? -8 : 8; })
		      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
		      .text(function(d) { return d.data.name; });

		  // draw links for people in tree
		  node.append("a")
		  		.attr("class", "spouseText")
		  		.attr("href", function(d) { 
		  			return "#!/people/" + parseId(d.data._id) + "#" + d.data.spouse.replace(" ", "-"); 
		  		});

		  // add label for spouse
		  node.selectAll(".spouseText")
		  		.append("text")
		  	  .attr("class", "spouse")
		      .attr("dy", 6)
		      .attr("x", function(d) { return d.children ? -8 : 8; })
		      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
		      .text(function(d) { return d.data.spouse; });


	}

	var createPaths = function(firstPerson, secondPerson){
		var paths = firstPerson.path(secondPerson);

  		var link = d3.linkHorizontal()
		    .x(function(d) { return d.y; })
		    .y(function(d) { return d.x; });

		d3.selectAll(".path-link")
			.classed("normal-link", true)
			.classed("path-link", false);

  		for (var i = 0; i < paths.length - 1; i++) {
  			var path;

  			if(paths[i].depth < paths[i+1].depth){
	  			path = link({
	      			source: paths[i],
	      			target: paths[i+1]
	      		});
	  		}else if(paths[i].depth > paths[i+1].depth){
	  			path = link({
	      			source: paths[i+1],
	      			target: paths[i]
	      		});
	  		}else{
	  			console.log("depth is the same:");
	  			console.log(paths[i]);
	  			console.log(paths[i+1]);
	  		}

      		var selectPath = 'path[d = "' + path + '"]';
  			d3.selectAll(selectPath)
				.classed("path-link", true)
				.classed("normal-link", false);
		}

		for(var i = 1; i < paths.length - 1; i++){
			d3.select("#" + turnNameToId(paths[i].id))
				.select("circle")
				.classed("normalCircle", false)
				.classed("pathCircle", true);
		}
	}

	var getRelation = function(firstPerson, secondPerson){
		var depthDifference = 0;
		var numLevelsAboveCurrent = 0;
		var lowerPerson;
		var origLowerPerson;
		var higherPerson;

		// if depth is same, find common ancestor
		if(firstPerson.depth != secondPerson.depth){
			if(firstPerson.depth > secondPerson.depth){
				lowerPerson = firstPerson;
				origLowerPerson = firstPerson;
				higherPerson = secondPerson;
			}else{
				lowerPerson = secondPerson;
				origLowerPerson = secondPerson;
				higherPerson = firstPerson;
			}

			while(lowerPerson.depth > higherPerson.depth){
				lowerPerson = lowerPerson.parent;
				depthDifference++;
			}
			// console.log("depthDifference: " + depthDifference);
			// console.log("numLevelsAboveCurrent: " + moveUpTree(lowerPerson, higherPerson, 0));
			numLevelsAboveCurrent = moveUpTree(lowerPerson, higherPerson, 0);
		}else{
			// console.log("numLevelsAboveCurrent: " + moveUpTree(firstPerson, secondPerson, 0));
			numLevelsAboveCurrent = moveUpTree(firstPerson, secondPerson, 0);
		}

		// if depth is different, have lower depth 
		// move to higher depth and then find common ancestor

		// if depth is different, then they're not cousins
		// if depth is the same, either siblings or cousins
		var returnString = "";
		if(depthDifference == 0){
			returnString = firstPerson.id + " and " + secondPerson.id + " are ";
			if(numLevelsAboveCurrent == 0)
				returnString += "self";
			else if(numLevelsAboveCurrent == 1)
				returnString += "siblings";
			else
				returnString += "cousins";
		}else if(depthDifference > 0){
			returnString = higherPerson.id + " is ";
			var count = depthDifference;
			while(count > 1){
				if(count == 2){
					returnString += "grand";
					break;
				}
				returnString += "great ";
				count--;
			}
			if(numLevelsAboveCurrent > 0)
				returnString += "aunt/uncle";
			else
				returnString += "parent";
			returnString += " to " + origLowerPerson.id;
		}
		return returnString;
	}

	var moveUpTree = function(firstPerson, secondPerson, numLevelsAboveCurrent){
		if(firstPerson.id != secondPerson.id){
			return moveUpTree(firstPerson.parent, secondPerson.parent, numLevelsAboveCurrent+1);
		}
		return numLevelsAboveCurrent;
	}

	var parseId = function(id){
		return id.replace("ObjectId(", "").replace(")", "");
	}

	var turnNameToId = function(name){
		return name.replace(" ", "-");
	}

	var TreeCtrl = function ($scope, $http) {

		var getData = function(){
			$http.get('/people')
				.then(onPersonGetCompleted);
		}

		var onPersonGetCompleted = function(response){
			$scope.persons = response.data;
			renderTree($scope);
		}

		getData();
	}
	myApp.controller('TreeCtrl', TreeCtrl);
})();