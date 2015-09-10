(function() {
  'use strict';

  var express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      form = require('express-form'),
      mongoose = require('mongoose');

  var authService = require('./services/authService.min');

  //parse json in requests
  app.use(bodyParser.json());

  //allow-all-origins
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });

  //allow only logged users
  //apis = api + secure
  app.all('/apis/*', function (req, res, next) {
    var session = authService.ensureAuthenticated(req);

    if (!session.token) {
      res.status(403).send({err: 'No auth header'});
    } else if (session.expired) {
      res.status(401).send({err: 'The token has expired'} );
    } else {
      req.userId = session.userId;
      next();
    }
  });

  var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
  });

  app.get('/', function (req, res, next) {
    res.send('Hello Flat Mate!');
  });

  //models
  require('./models/userModel.min')(app, mongoose);
  require('./models/flatModel.min')(app, mongoose);
  require('./models/taskModel.min')(app, mongoose);

  //routes
  require('./routes/userRoutes.min')(app);
  require('./routes/flatRoutes.min')(app);
  require('./routes/taskRoutes.min')(app);

  mongoose.connect('mongodb://localhost:27017/flatmate', function(err, res) {
    if(err) console.log(err);
    console.log('Connected to Database');
  });

  //cron task for spin tasks ss mm hh dayOfMont month day
  var CronJob = require('cron').CronJob;
  var spinTask = new CronJob('0 0 4 * * 0-7', function() {
    console.log(new Date());
    console.log('You will see this message every second');
  }, null, true, 'Europe/Madrid');

})();
