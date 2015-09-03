(function() {
  'use strict';

  module.exports = function(app) {
    var flatService = require('../services/flatService.min');
    var authService = require('../services/authService.min');

    app.post('/flat', function(req, res, next) {
      flatService.add(req.body).then(function(flat) {
        res.status(200).json(flat);
      }).catch(function(err) {
        res.send(500, err);
      });
    });

    app.get('/flats/all', function(req, res, next) {
      flatService.getAll().then(function(flats) {
        res.status(200).json(flats);
      }).catch(function(err) {
        res.send(500, err);
      });
    });
  }

})();
