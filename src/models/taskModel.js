var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var taskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  flat: {
    type: Schema.ObjectId,
    ref: 'flat'
  },
  who: {
    type: Schema.ObjectId,
    ref: 'user'
  }
});

module.exports = mongoose.model('task', taskSchema);
