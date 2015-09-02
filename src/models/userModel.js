var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    index: { unique: true, dropDups: true },
    required: true,
    match: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
  }
});

module.exports = mongoose.model('user', userSchema);
