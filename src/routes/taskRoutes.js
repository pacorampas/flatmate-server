(function() {
  'use strict';

  module.exports = function(app) {
    var taskService = require('../services/taskService.min');

    app.get('/apis/task', function(req, res, next) {
      res.status(200).json({hola: taskService.hola()});
    });
  }

})();
