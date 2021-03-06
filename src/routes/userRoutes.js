(function() {
  'use strict';

  var mongoose = require('mongoose');

  module.exports = function(app) {
    var userService = require('../services/userService');
    var authService = require('../services/authService');
    var UserMongoose  = mongoose.model('user');

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
        res.status(401).send(err);
      });
    });

    app.post('/register', function(req, res, next) {
      userService.add(req.body).then(function(user) {
        res.status(200).json({
          toke: authService.createToken(user),
          user: user
        });
      }).catch(function(err) {
        res.status(500).send(err);
      });
    });

    app.get('/login', function(req, res, next) {
      userService.getByEmail(req.query.email).then(function(user) {
        if (req.query.password === user.password) {
          res.status(200).json({
            token: authService.createToken(user),
            user: user
          });
        } else {
          res.sendStatus(401);
        }
      }).catch(function(err) {
        res.sendStatus(401);
      });
    });

    app.get('/apis/get-user-session', function(req, res, next) {
      userService.getById(req.userId).then(function(user) {
        res.status(200).json({user: user});
      }).catch(function(err) {
        res.status(500).send(err);
      });
    });

    app.get('/apis/user/:userId', function(req, res) {
      res.status(200).json(req.user);
    });

    app.get('/apis/user-exist', function(req, res) {
      var email = req.query.email;
      var notIn = JSON.parse(req.query.notIn);
      var emailRegExp = new RegExp('^'+email+'.*', 'i');
      var emailArray = [emailRegExp];
      console.log(notIn);

      UserMongoose
        .find()
        .where('email').in(emailArray)
        .where('email').nin(notIn) //nin not in
        .select('email _id')
        .limit(5)
        .exec(function(err, users) {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).json(users);
          }
        });
    });
  }

})();
