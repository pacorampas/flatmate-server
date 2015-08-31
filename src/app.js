(function() {
  'use strict';

  //TODO divide in files src/routes src/config.js
  var express = require('express');
  var bodyParser = require('body-parser');
  var form = require('express-form');

  var user = require('./services/user.min');
  var app = express();

  var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
  });

  //allow-all-origins
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  //parse json in requests
  app.use(bodyParser.json());

  app.get('/', function (req, res, next) {
    res.send('Hello Flat Mate!');
  });

  app.route('/user')
    .post(
      form(
        //TODO error messages or code
        //http://dandean.github.io/express-form/docs/validate.html
        form.filter('name').trim(),
        form.validate('name').required().is(/^[a-z]+$/),
        form.filter('email').trim(),
        form.validate('email').isEmail()
      ),
      function (req, res) {
        if (req.form.isValid) {
          user.new(req.body.name, req.body.email, function(err){
            if (err) {
              res.json({ err: err });
            } else {
              res.json({ err: false });
            }
          });
        } else {
          res.json({ err: req.form.errors });
        }
      });

  app.param('userId', function(req, res, next, id) {
    user.getById(id).then(function(user) {
      req.user = user;
      return next();
    }).catch(function(err) {
      req.user = false;
      return next();
    });
  });

  app.route('/user/:userId')
    .get(function (req, res, next) {
      if (req.user) {
        res.json({ err: false, user: req.user });
      } else {
        res.json({ err: 'err' });
      }
    });

  user.getAll();
})();
