(function() {
  'use strict';

  var express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      form = require('express-form'),
      mongoose = require('mongoose');

  //parse json in requests
  app.use(bodyParser.json());

  //models
  require('./models/userModel.min')(app, mongoose);
  require('./models/flatModel.min')(app, mongoose);

  //routes
  require('./routes/userRoutes.min')(app);
  require('./routes/flatRoutes.min')(app);

  //allow-all-origins
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
  });

  app.get('/', function (req, res, next) {
    res.send('Hello Flat Mate!');
  });

  mongoose.connect('mongodb://localhost:27017/flatmate', function(err, res) {
    if(err) console.log(err);
    console.log('Connected to Database');
  });

})();
