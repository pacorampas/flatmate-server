(function() {
  'use strict';

  var mongoose = require('mongoose');
  var FlatMongoose = mongoose.model('flat');
  var userService = require('./userService.min');

  module.exports = {
    add: function(flat) {
      var flat = new FlatMongoose({
        name: flat.name,
        owner: flat.ownerId,
        mates: flat.mates
      });
      return new Promise(function(resolve, reject) {
        flat.save(function(err, flat) {
          FlatMongoose.populate(flat, { path: 'owner mates tasks' }, function() {
            if(err) {
              reject(err);
            } else {
              resolve(flat);
            }
          });
        });
      });
    },
    getAll: function() {
      return new Promise(function(resolve, reject) {
        FlatMongoose
          .find()
          .populate({path: 'owner mates tasks'})
          .exec(function(err, flats) {
            if(err) {
              reject(err);
            } else {
              resolve(flats);
            }
          });
      });
    },
    getById: function(id) {
      return new Promise(function(resolve, reject) {
        FlatMongoose
          .findById(id)
          .populate({path: 'owner mates tasks'})
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
