/* jslint node: true */
'use strict';

var R = require('ramda'),
  Q = require('q'),
  PowerPoint = require('../mongoose_models/power-point'),
  User = require('../mongoose_models/user');

module.exports = function (server) {
  server.post('/v1/power-points/multi', function (req, res) {
    var points = R.map(
      function (point) {
        point.team = req.body.team;
        return new PowerPoint(point);
      },
      req.body.points
    );

    PowerPoint.addPointsArray(points)
      .then(function (result) {
        var experience = req.body.kilometers_traveled + result.captured +
          result.damaged + result.destroyed + result.fortified;

        Q
          .all([
            User
              .update(
                { username: req.body.username },
                {
                  $inc: {
                    'stats.experience': experience,
                    'stats.kilometers_traveled': req.body.kilometers_traveled,
                    'stats.power_points.captured': result.captured,
                    'stats.power_points.damaged': result.damaged,
                    'stats.power_points.destroyed': result.destroyed,
                    'stats.power_points.fortified': result.fortified
                  }
                }
              )
              .exec(),
            User
              .findOne({ username: req.body.username })
              .exec()
              .then(function (user) {
                return user.updateEcobiciData();
              })
          ])
          .then(function () {
            return User.findOne({ username: req.body.username }).exec();
          })
          .then(function (user) {
            res.send(user);
          });
      });
  });
};
