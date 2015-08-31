(function() {
  'use strict';

  var db = require('mongoskin').db('mongodb://localhost:27017/flatmate');
  db.bind('users');

  var ObjectID = require('mongoskin').ObjectID;

  module.exports = {
    getById: function(id) {
      return new Promise(function(resolve, reject) {
        db.users.findOne({
          _id: ObjectID.createFromHexString(id)
        }, function(err, result) {
          if (err || !result) {
            reject('Error');
          } else {
            resolve(result);
          }
        });
      })
    },
    getAll: function() {
      //TODO use a promise
      db.users.find().toArray(function(err, result) {
        if (err) {
          console.log(err);
        } else {

        }
        console.log(result);
      });
    },
    new: function(name, email, callback) {
      //TODO use a promise
      db.users.insert({name: name, email: email}, function(err, result) {
        if (err) {
          callback(err);
        }
        if (result) {
          console.log('Added '+name+'!');
          callback(false);
        }
      });
    }
  };

})();
