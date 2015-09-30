(function() {
  'use strict';

  var mongoose = require('mongoose');

  module.exports = function(app) {
    var flatService = require('../services/flatService');
    var userService = require('../services/userService');
    var taskService = require('../services/taskService');
    var FlatMongoose = mongoose.model('flat');

    app.param('flatId', function(req, res, next, id) {
      flatService.getById(id).then(function(flat) {
        req.flat = flat;
        return next();
      }).catch(function(err) {
        req.flat = false;
        return next();
      });
    });

    app.param('taskId', function(req, res, next, id) {
      taskService.getById(id).then(function(task) {
        req.task = task;
        return next();
      }).catch(function(err) {
        req.task = false;
        return next();
      });
    });

    app.post('/apis/flat', function(req, res, next) {
      var flatReq = req.body;
      flatReq.ownerId = req.userId;

      var flat = new FlatMongoose({
        name: flatReq.name,
        owner: flatReq.ownerId
      });

      flat.setMates(flatReq.mates, function() {
        flat.save(function(err, flat) {
          if (!err) {
            FlatMongoose.getById(flat._id).then(function(flat) {
              res.status(200).json(flat);
            });
          } else {
            res.status(500).json(err);
          }
        });
      });
    });

    app.put('/apis/flat', function(req, res, next) {
      var flatReq = req.body;

      FlatMongoose.getById(flatReq._id).then(function(flat) {
        var reqMates = flatReq.mates;
        flat.name = flatReq.name;
        flat.updateMates(reqMates, function(flat) {
          FlatMongoose.getById(flat._id).then(function(flat) {
            res.status(200).json(flat);
          });
        });
      });
    });

    app.get('/apis/flats/all', function(req, res, next) {
      flatService.getAll().then(function(flats) {
        res.status(200).json(flats);
      }).catch(function(err) {
        res.send(500, err);
      });
    });

    app.post('/apis/flat/:flatId/task', function(req, res, next) {
      var flat = req.flat;
      var task = req.body;
      task.flatId = flat._id;

      taskService.add(task).then(function(task) {
        flat.tasks.push(task);
        flat.save(function(err) {
          if (!err) {
            res.status(200).json(flat);
          } else {
            res.status(500).send(err);
          }
        });
      });
    });

    app.post('/apis/flat/:flatId/spin-task', function(req, res, next) {
      var flat = req.flat;
      var spinTask = req.body;
      spinTask.flat = flat;

      taskService.addSpinTask(spinTask).then(function(spinTask) {
        flat.tasks.push(spinTask);
        flat.save(function(err) {
          if (!err) {
            res.status(200).json(flat);
          } else {
            res.status(500).send(err);
          }
        });
      }).catch(function(err) {
        res.status(500).json(err);
      });
    });

    app.post('/apis/flat/:flatId/task/:taskId', function(req, res, next) {
      var flat = req.flat;
      var task = req.task;
      var userId = req.userId;

      task.markAsDone(userId).then(function(updatedTask) {
        flatService.getById(flat._id).then(function(flat) {
          res.status(200).json({task: updatedTask, flat: flat});
        }).catch(function() {
          res.status(500).send();
        });
      }).catch(function() {
        res.status(500).send();
      });
    });

  }

})();
