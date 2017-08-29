var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Person = require('./api/models/peopleModel'), //created model loading here
  bodyParser = require('body-parser');
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Familydb',{ useMongoClient: true }); 

app.use(express.static(__dirname + "/"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/peopleRoute'); //importing route
routes(app); //register the route


app.listen(port);


console.log('people list RESTful API server started on: ' + port);