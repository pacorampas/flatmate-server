(function() {
  'use strict';

  var mongoose = require('mongoose');
  var TaskMongoose = mongoose.model('task');

  module.exports = {
    add: function(task) {
      var task = new TaskMongoose({
        title: task.title,
        flat: task.flatId,
        who: task.who
      });
      return new Promise(function(resolve, reject) {
        task.save(function(err, task) {
          if(err) {
            reject(err);
          } else {
            resolve(task);
          }
        });
      });
    },
    getById: function(id) {
      return new Promise(function(resolve, reject) {
        TaskMongoose
          .findById(id)
          .exec(function(err, task) {
            if(err) {
              reject(err);
            } else {
              resolve(task);
            }
          });
      });
    },
    addSpinTask: function(spinTaskReq) {
      var spinTask = new TaskMongoose({
        title: spinTaskReq.title,
        flat: spinTaskReq.flat._id,
        period: spinTaskReq.period,
        subtasks: spinTaskReq.subtasks,
        spin: true
      });

      var matesAndOwner = spinTaskReq.flat.mates.concat([ spinTaskReq.flat.owner ]);
      spinTask.createHistoryItem(matesAndOwner);

      return new Promise(function(resolve, reject) {
        spinTask.save(function(err, spinTask) {
          if(err) {
            reject(err);
          } else {
            resolve(spinTask);
          }
        });
      });
    },
    nextHistorySpinTask: function(spinTask, flat) {
      var matesAndOwner = flat.mates.concat([flat.owner]);
      spinTask.nextHistoryItem(matesAndOwner);
    }
  }

})();
