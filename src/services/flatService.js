(function() {
  'use strict';

  var mongoose = require('mongoose');
  var Flat  = mongoose.model('flat');
  var User  = mongoose.model('flat');

  module.exports = {
    add: function(flat) {
      console.log(flat);
      var flat = new Flat({
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
        Flat.find(function(err, flats) {
          User.populate(flats, {path: 'owner mates'}, function(err, flats) {
            if(err) {
              reject(err);
            } else {
              resolve(flats);
            }
          });
        });
      });
    }
  }

})();
