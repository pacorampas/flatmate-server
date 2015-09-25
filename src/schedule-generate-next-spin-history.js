(function() {
  'use strict';

  require('./helpers/array-prototype');
  var mongoose = require('mongoose');
  require('./models/userModel')();
  require('./models/flatModel')();
  require('./models/taskModel')();

  //TODO make a service for connecting with mongo
  mongoose.connect('mongodb://admin:admin@ds051553.mongolab.com:51553/flatmate',
                                                            function(err, res) {
    if(err) {
      console.log(err);
    } else {
      console.log('Connected to Database');
      var TaskMongoose = mongoose.model('task');
      TaskMongoose.generateNextSpinHistory(function() {
        process.exit();
      });
    }
  });

})();
