var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;
var FlatMongoose = mongoose.model('flat');
var moment = require('moment');

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
  },
  //TODO extend schemas
  //is better have an extend of taskSchema to spinTaskSchema
  //but then, I can't get two differents types of schemas in flat.tasks
  spin: { //only a spin property
    type: Boolean,
    index: true,
  },
  subtasks: [], //only a spin property
  period: { //only a spin property
    type: Number,
    min: 0, //0 = daily, 1 = weekly, 2 = mothly, 3 = yearly
    max: 3
  }, //only a spin property
  matesIndexCurrent: Number,
  subtasksIndexCurrent: Number,
  history: [ //only a spin property
    {
      subtasks: [
        {
          subtask: {},
          who: {
            type: Schema.ObjectId,
            ref: 'user'
          }
        }
      ],
      period: String,
      start: Date
    }
  ]
});

//TODO, split methods and statics in other file
taskSchema.methods.createHistoryItem = function (mates) {
  this.matesIndexCurrent = -1,
  this.subtasksIndexCurrent= -1
  historyItem = this.nextHistoryItem(mates);
}

taskSchema.methods.nextHistoryItem = function (mates) {
  var dateStart = moment().hours(3).minutes(20);

  var historyItem = {
    subtasks: [],
    period: this.period,
    start: dateStart._d
  };

  var subtasksCurrent = this.subtasksIndexCurrent;
  var matesCurrent = this.matesIndexCurrent;

  var subtasks = this.subtasks;
  subtasks.current = subtasksCurrent;
  mates.current = matesCurrent;

  var subtasksLenght = subtasks.length;
  var matesLength = mates.length;

  for(var i = 0; i < subtasksLenght && i < matesLength; i++) {
    var subtasksHistoryItem = {};
    subtasksHistoryItem.subtask = subtasks.next();
    subtasksHistoryItem.who = mates.next()._id;
    historyItem.subtasks.push(subtasksHistoryItem);
  }

  this.subtasksIndexCurrent = subtasks.current;
  this.matesIndexCurrent = mates.current;

  if (matesLength === subtasksLenght) {
    this.matesIndexCurrent = matesCurrent+1 >= mates.length ? 0 : matesCurrent+1;
  } else if (matesLength < subtasksLenght) {
    this.subtasksIndexCurrent = subtasksCurrent+1 >= subtasks.length ? 0 : subtasksCurrent+1;
  } else if (matesLength > subtasksLenght) {
    this.matesIndexCurrent = matesCurrent+1 >= mates.length ? 0 : matesCurrent+1;
  }

  this.history.push(historyItem);

  return historyItem;
}

taskSchema.virtual('end').get(function () {
  if (this.period === 0) {
    return moment(this.history.lastItem().start).add(1, 'days')._d;
  } else if (this.period === 1) {
    return moment(this.history.lastItem().start).add(1, 'weeks')._d;
  } else if (this.period === 2) {
    return moment(this.history.lastItem().start).add(1, 'months')._d;
  } else if (this.period === 3) {
    return moment(this.history.lastItem().start).add(1, 'years')._d;
  }
});

taskSchema.virtual('timeToEnd').get(function() {
  var timeDiff =  moment(this.end) - moment();
  return timeDiff;
});

taskSchema.statics.getAllSpinTasks = function getAllSpinTasks () {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.find({spin:true}).exec(function(err, allSpinTasks) {
      if (!err) {
        resolve(allSpinTasks);
      } else {
        reject(err);
      }
    });
  });
};

taskSchema.statics.generateNextSpinHistory = function generateNextSpinHistory (callback) {
  this.getAllSpinTasks().then(function(allSpinTasks) {
    var lastItem = allSpinTasks.lastItem();
    allSpinTasks.forEach(function(spinTask) {
      if (spinTask.history) {
        if (spinTask.timeToEnd <= 0) {
          FlatMongoose.populate(spinTask, { path: 'flat' }, function() {
            FlatMongoose.populate(spinTask.flat, { path: 'mates owner' }, function() {
              var matesAndOwner = spinTask.flat.mates.concat([spinTask.flat.owner]);
              spinTask.nextHistoryItem(matesAndOwner);
              //TODO add something to advice if the saved was succesfully
              spinTask.save(function(err) {
                if (err) {
                  console.log('ERROR, The spintask with id: '+spinTask._id+
                      'was fail in saving.');
                }
                console.log('Generate new history for the spinTask with id: '+
                  spinTask._id);
                if (lastItem === spinTask && typeof callback === 'function') {
                  callback();
                }
              });
            });
          });
        } else {
          console.log('The spintask with id: '+spinTask._id+' doesn\'t '+
                      'need to be update');
          if (lastItem === spinTask && typeof callback === 'function') {
            callback();
          }
        }
      }
    });
  });
}

module.exports = mongoose.model('task', taskSchema);
