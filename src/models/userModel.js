var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var userSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    index: { unique: true, dropDups: true },
    required: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/
  },
  password: {
    type: String,
    required: true
  },
  flat: {
    type: Schema.ObjectId,
    ref: 'flat'
  }
});

userSchema.methods.removeFlat = function() {
  this.flat = null;
  var self = this;
  this.save(function(err) {
    if (!err) {
      console.log('Remove flat for: '+self.email);
    }
  });
}

userSchema.statics.getById = function(id) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.findOne({_id: id}).exec(function(err, user) {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
};

userSchema.statics.getByEmail = function(email) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.findOne({email: email}).exec(function(err, user) {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
};

userSchema.statics.getByEmailArray = function(emailArray, selecting) {
  if (!selecting) {
    selecting = ''; //select all
  }
  var self = this;
  return new Promise(function(resolve, reject) {
    self
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
};

module.exports = mongoose.model('user', userSchema);
