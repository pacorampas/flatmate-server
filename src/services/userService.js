(function() {
  'use strict';

  var mongoose = require('mongoose');
  var User  = mongoose.model('user');

  module.exports = {
    getAll: function(req, res) {
      return new Promise(function(resolve, reject) {
        User.find(function(err, users) {
          if(err) {
            reject(err);
          } else {
            resolve(users);
          }
        });
      });
    },
    add: function(user) {
      var user = new User({
        name: user.name,
        email: user.email,
        password: user.password
      });
      return new Promise(function(resolve, reject) {
        user.save(function(err, user) {
          if(err) {
            reject(err);
          } else {
            resolve(user);
          }
        });
      });
    },
    getByEmail: function(email) {
      return new Promise(function(resolve, reject) {
        User.find({email: email}, function(err, doc) {
          console.log('Errr! '+err);
          if (err) {
            reject(err);
          } else {
            console.log(doc);
            resolve(doc);
          }
        });
      });
    },
    getById: function(id) {
      return new Promise(function(resolve, reject) {
        User.findById(id, function(err, doc) {
          if (err) {
            reject(err);
          } else {
            resolve(doc);
          }
        });
      });
    }
  }

})();
