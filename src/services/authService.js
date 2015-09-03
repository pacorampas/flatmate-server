(function() {
  'use strict';

  var jwt = require('jwt-simple');
  var moment = require('moment');
  var config = require('../config.min');

  module.exports = {
    createToken: function(user) {
      var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(60, 'minutes').unix(),
      };

      return jwt.encode(payload, config.TOKEN_SECRET);
    },
    ensureAuthenticated: function(req, res, next) {
      if (!req.headers.authorization) {
        return res.status(403)
          .send({err: 'No auth header'});
      }

      var token = req.headers.authorization;
      var payload = jwt.decode(token, config.TOKEN_SECRET);

      if (payload.exp <= moment().unix()) {
        return res.status(401).send({err: 'The token has expired'} );
      }

      req.user = payload.sub;
      next();
    }
  };

})();
