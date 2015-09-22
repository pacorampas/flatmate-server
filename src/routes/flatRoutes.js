(function() {
  'use strict';

  module.exports = function(app) {
    var flatService = require('../services/flatService');
    var userService = require('../services/userService');
    var taskService = require('../services/taskService');

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
      var flat = req.body;
      flat.ownerId = req.userId;

      userService.getByEmailArray(flat.mates, '_id').then(function(users) {
        var matesArray = new Array();
        for(var key in users) {
          if (users[key]._id) {
            matesArray.push(users[key]._id);
          }
        }
        flat.mates = matesArray;

        flatService.add(flat).then(function(flat) {
          var matesAndOwner = flat.mates.slice(0); //.slice(0) clone the array
          matesAndOwner.push(flat.owner);

          //TODO polulate save to users
          //to update mates and owner to add their the flat
          //TODO not update a flat of users that they are in a flat yet
          userService.updateFlatByIdArray(matesAndOwner, flat._id)
                                                  .then(function(usersUpdated) {
            res.status(200).json(flat);
          }).catch(function(err) {
            res.status(500).send(err);
          });
        }).catch(function(err) {
          res.status(500).send(err);
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
            res.status(500);
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
            res.status(500);
          }
        });
      }).catch(function(err) {
        res.status(500).json(err);
      });
    });
  }

})();
