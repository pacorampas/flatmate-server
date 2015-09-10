(function() {
  'use strict';

  var mongoose = require('mongoose');
  var TaskMongoose = mongoose.model('task');

  module.exports = {
    hola: function() {
      return 'hola!! :)';
    },
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
    }
  }

})();
