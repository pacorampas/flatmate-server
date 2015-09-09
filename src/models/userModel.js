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

module.exports = mongoose.model('user', userSchema);
