var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;
var user = mongoose.model('user');

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
  ]
});

module.exports = mongoose.model('flat', flatSchema);
