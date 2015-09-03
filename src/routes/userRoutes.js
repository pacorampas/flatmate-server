(function() {
  'use strict';

  module.exports = function(app) {
    var userService = require('../services/userService.min');
    var authService = require('../services/authService.min');

    app.param('userId', function(req, res, next, id) {
      userService.getById(id).then(function(user) {
        req.user = user;
        return next();
      }).catch(function(err) {
        req.user = false;
        return next();
      });
    });

    app.get('/apis/users/all', function(req, res, next) {
      userService.getAll().then(function(users) {
        res.status(200).json(users);
      }).catch(function(err) {
        res.send(401, err);
      });
    });

    app.post('/register', function(req, res, next) {
      userService.add(req.body).then(function(user) {
        res.status(200).json(authService.createToken(user));
      }).catch(function(err) {
        res.send(500, err);
      });
    });

    app.get('/login', function(req, res, next) {
      userService.getByEmail(req.body.email).then(function(user) {
        if (req.body.password === user.password) {
          res.status(200).json(authService.createToken(user));
        } else {
          res.send(401);
        }
      }).catch(function(err) {
        res.send(401);
      });
    });

    app.get('/apis/user/:userId', function(req, res) {
      res.status(200).jsonp(req.user);
    })
  }

})();
