(function() {
  'use strict';

  module.exports = function(app) {
    var flatService = require('../services/flatService.min');
    var userService = require('../services/userService.min');
    var authService = require('../services/authService.min');

    app.post('/apis/flat', function(req, res, next) {
      var flat = req.body;
      flat.ownerId = req.userId;

      userService.getByEmailArray(flat.mates, '_id').then(function(users) {
        var matesArray = new Array();
        for(var key in users) {
          matesArray.push(users[key]._id);
        }
        flat.mates = matesArray;

        flatService.add(flat).then(function(flat) {
          var matesAndOwner = flat.mates.slice(0); //.slice(0) clone the array
          matesAndOwner.push(flat.owner);

          //TODO polulate save to users
          //to update mates and owner to add their the flat
          //TODO not update a flat of users that they are in a flat yet
          userService.updateFlatByIdArray(matesAndOwner, flat._id)
                                                  .then(function(usersUpdated) {
            res.status(200).json(flat);
          }).catch(function(err) {
            res.status(500).send(err);
          });
        }).catch(function(err) {
          res.status(500).send(err);
        });
      });
    });

    app.get('/apis/flats/all', function(req, res, next) {
      flatService.getAll().then(function(flats) {
        res.status(200).json(flats);
      }).catch(function(err) {
        res.send(500, err);
      });
    });
  }

})();
