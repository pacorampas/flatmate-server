(function() {
  'use strict';

  module.exports = function(app) {
    var userController = require('../controllers/userController.min');

    app.param('userId', function(req, res, next, id) {
      userController.getById(id).then(function(user) {
        req.user = user;
        return next();
      }).catch(function(err) {
        req.user = false;
        return next();
      });
    });

    app.get('/users/all', function(req, res, next) {
      userController.getAll().then(function(users) {
        res.status(200).json(users);
      }).catch(function(err) {
        res.send(500, err.message);
      });
    });

    app.post('/user', function(req, res, next) {
      console.log(req.body);
      userController.add(req.body).then(function(user) {
        res.status(200).json(user);
      }).catch(function(err) {
        res.send(500, err.message);
      });
    });

    app.get('/user/:userId', function(req, res) {
      res.status(200).jsonp(req.user);
    })
  }

})();
