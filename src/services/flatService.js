(function() {
  'use strict';

  var mongoose = require('mongoose');
  var FlatMongoose = mongoose.model('flat');

  module.exports = {
    add: function(flat) {
      var flat = new FlatMongoose({
        name: flat.name,
        owner: flat.ownerId,
        mates: flat.mates
      });
      return new Promise(function(resolve, reject) {
        flat.save(function(err, user) {
          if(err) {
            reject(err);
          } else {
            resolve(user);
          }
        });
      });
    },
    getAll: function() {
      return new Promise(function(resolve, reject) {
        FlatMongoose
          .find()
          .populate({path: 'owner mates'})
          .exec(function(err, flats) {
            if(err) {
              reject(err);
            } else {
              resolve(flats);
            }
          });
      });
    }
  }

})();
