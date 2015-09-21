(function() {
  'use strict';

  var jwt = require('jwt-simple');
  var moment = require('moment');
  var config = require('../config');

  module.exports = {
    createToken: function(user) {
      var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(1, 'days').unix(),
      };

      return jwt.encode(payload, config.TOKEN_SECRET);
    },
    ensureAuthenticated: function(req) {
      var token = req.headers.authorization || req.body.authorization ||
          req.query.authorization;

      if (!token) {
        return {token: false};
      }

      try {
        var payload = jwt.decode(token, config.TOKEN_SECRET);
      } catch(err) {
        return {token: false}
      }

      if (payload.exp <= moment().unix()) {
        return {token: true, expired: true};
      }

      return {token: true, expired: false, userId: payload.sub};
    }
  };

})();
