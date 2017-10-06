'use strict';

(function(){
	var myApp = angular.module('myApp');

	var renderTree = function() {
		
		var margin = { top: 10, right: 150, bottom: 10, left: 150 },
		    width = 960 - margin.left - margin.right,
		    height = 640 - margin.top - margin.bottom;

		var svg = d3.select('.treeDiv').append('svg')
		    .attr('width', width + margin.left + margin.right)
		    .attr('height', height + margin.top + margin.bottom),
		  g = svg.append('g')
		    .attr('transform', 'translate(' + 
		    	margin.left + ',' + margin.top + ')');

		d3.text("../api/static/tree.csv", function (error, data) {
			var treemap = d3.tree().size([height, width]);

			var table = d3.csvParse(data);

			var root = d3.stratify()
			.id(function(d) { return d.name; })
			.parentId(function(d){ return d.parent; })
			(table);

			var link = g.selectAll(".link")
		    .data(treemap(root).links())
		    .enter().append("path")
		      .attr("class", "link")
		      .attr("d", d3.linkHorizontal()
		          .x(function(d) { return d.y; })
		          .y(function(d) { return d.x; }));

		  var node = g.selectAll(".node")
		    .data(root.descendants())
		    .enter().append("g")
		      .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
		      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

		  node.append("circle")
		      .attr("r", 2.5);

		  node.append("a")
		  		.attr("href", function(d) { 
		  			return "#!/people/" + parseId(d.data._id); 
		  		});

		  node.selectAll("a")
		  		.append("text")
		  	  .attr("class", "member")
		      .attr("dy", function(d) { return d.data.spouse ? -6 : 3; })
		      .attr("x", function(d) { return d.children ? -8 : 8; })
		      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
		      .text(function(d) { return d.data.name; });

		  node.append("text")
		  	  .attr("class", "spouse")
		      .attr("dy", 6)
		      .attr("x", function(d) { return d.children ? -8 : 8; })
		      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
		      .text(function(d) { return d.data.spouse; });

		});
	}

	var parseId = function(id){
		return id.replace("ObjectId(", "").replace(")", "");
	}

	var TreeCtrl = function ($scope) {
		renderTree();
	}
	myApp.controller('TreeCtrl', TreeCtrl);
})();