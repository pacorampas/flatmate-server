var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;
var userMongoose = mongoose.model('user');

var flatSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'user'
  },
  mates: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'task'
    }
  ]
});

flatSchema.statics.getById = function(id) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self
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

flatSchema.methods.updateMates = function(newMates, callback) {
  var self = this;

  this.setMates(newMates, function() {
    self.save(function(err, flat) {
      if (!err) {
        callback(flat);
      } else {
        callback(err);
      }
    });
  });
};

flatSchema.methods.setMates = function(mates, callback) {
  var self = this;

  userMongoose.getByEmailArray(mates).then(function(users) {
    self.mates = users;
    callback();
  });
};

flatSchema.pre('updateMates', function(next) {
  this.mates.forEach(function(mate) {
    mate.removeFlat();
  });
  next();
});

flatSchema.pre('save', function(next) {
  var self = this;
  this.mates.forEach(function(userId) {
    userMongoose.getById(userId).then(function(user) {
      user.flat = self._id;
      user.save();
    })
  });
  userMongoose.getById(this.owner).then(function(user) {
    user.flat = self._id;
    user.save();
  })
  next();
});

module.exports = mongoose.model('flat', flatSchema);
