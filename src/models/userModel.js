var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var userSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    index: { unique: true, dropDups: true }
  }
});

module.exports = mongoose.model('user', userSchema);
