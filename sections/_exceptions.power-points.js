/* jslint node: true */
'use strict';

var R = require('ramda'),
  PowerPoint = require('../mongoose_models/power-point'),
  User = require('../mongoose_models/user');

module.exports = function (server) {
  /*jslint unparam:true */
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
        User
          .update(
            { username: req.body.username },
            {
              $inc: {
                'stats.kilometers_traveled': req.body.kilometers_traveled,
                'stats.power_points.captured': result.captured,
                'stats.power_points.damaged': result.damaged,
                'stats.power_points.destroyed': result.destroyed,
                'stats.power_points.fortified': result.fortified
              }
            }
          )
          .exec();
      });
  });
  /*jslint unparam:false */
};
