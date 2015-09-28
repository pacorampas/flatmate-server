(function() {
  'use strict';

  var mongoose = require('mongoose');
  var UserMongoose  = mongoose.model('user');
  var FlatMongoose  = mongoose.model('flat');

  module.exports = {
    getAll: function() {
      return new Promise(function(resolve, reject) {
        UserMongoose.find(function(err, users) {
          if(err) {
            reject(err);
          } else {
            resolve(users);
          }
        });
      });
    },
    add: function(user) {
      var user = new UserMongoose({
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
        UserMongoose
          .findOne({email: email})
          .populate({path: 'flat'})
          .exec(function(err, user) {
            if(err) {
              reject(err);
            } else if (!user) {
              reject('No user registered');
            } else if (user.flat) {
              FlatMongoose.populate(user.flat, { path: 'owner mates tasks' }, function() {
                resolve(user);
              });
            } else {
              resolve(user);
            }

          });
      });
    },
    getByEmailArray: function(emailArray, selecting) {
      if (!selecting) {
        selecting = ''; //select all
      }

      return new Promise(function(resolve, reject) {
        UserMongoose
          .find()
          .where('email').in(emailArray)
          .select(selecting)
          .limit(5)
          .exec(function(err, doc) {
            if (err) {
              reject(err);
            } else {
              resolve(doc);
            }
          });
      });
    },
    updateFlatByIdArray: function(usersIdArray, flatId) {
      var conditions = {
        _id: {
          $in: usersIdArray
        }
      };
      var update = {
        '$set': {
          'flat' : flatId
        }
      };
      var options = {
        multi : true //to update multiple items
      };
      return new Promise(function(resolve, reject) {
        UserMongoose.update(conditions, update, options,
            function(err, numAffected) {
          if (err) {
            reject(err);
          } else {
            resolve(numAffected);
          }
        });
      });
    },
    getById: function(id) {
      return new Promise(function(resolve, reject) {
        UserMongoose
          .findById(id)
          .populate({path: 'flat'})
          .exec(function(err, user) {
            if (err) {
              reject(err);
            } else if (!user){
              reject('No user registered.');
            } else if (user.flat) {
              FlatMongoose.populate(user.flat, { path: 'owner mates tasks' }, function() {
                resolve(user);
              });
            } else {
              resolve(user);
            }
        });
      });
    }
  }

})();
