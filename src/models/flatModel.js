var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

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

module.exports = mongoose.model('flat', flatSchema);
