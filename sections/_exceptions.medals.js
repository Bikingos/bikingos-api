/* jslint node: true */
'use strict';

var R = require('ramda'),
  Medal = require('../mongoose_models/medal'),
  User = require('../mongoose_models/user');

module.exports = function (server) {
  /*jslint unparam:true */
  server.get('/v1/users/:username/medals', function (req, res) {
    User
      .findOne({ username: 'bob'})
      .exec()
      .then(function (user) {
        user
          .getMedals()
          .then(function (medals) {
            res.send(medals);
          });
      });
  });
  /*jslint unparam:true */
};
