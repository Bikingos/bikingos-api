/* jslint node: true */
'use strict';

var mongoose = require('mongoose'),
  geolib = require('geolib'),
  Schema = mongoose.Schema,
  Q = require('q'),
  R = require('ramda');

var powerPointSchema = new Schema({
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  health: { type: Number, default: 1 },
  team: String
});

powerPointSchema.statics.addPoint = function (newPoint) {
  var that = this,
    deferred = Q.defer(),
    promises;

  this.find({})
    .exec()
    .then(function (points) {
      var nearPoints = R.filter(
        function (point) {
          var distance = geolib.getDistance(point.coordinates, newPoint.coordinates, 1);
          return distance <= 10;
        },
        points
      );

      if (nearPoints.length < 1) {
        newPoint.save(function (err) {
          if (err) { console.log(err); }
          deferred.resolve({
            captured: 1,
            damaged: 0,
            destroyed: 0,
            fortified: 0
          });
        });
      } else {
        promises = R.map(
          function (point) {
            var sameTeamFlag = point.team === newPoint.team;
            // Si son contrarios y tiene 1 de vida
            if (!sameTeamFlag && point.health === 1) {
              return that.remove({ '_id': point._id })
                .exec()
                .then(function () {
                  return {
                    type: 'destroyed'
                  };
                });
            }

            return that
              .update(
                { '_id': point._id },
                {
                  $inc: {
                    health: sameTeamFlag ? 1 : -1
                  }
                }
              )
              .exec()
              .then(function () {
                if (!sameTeamFlag) {
                  return {
                    type: 'damaged'
                  };
                }

                return {
                  type: 'fortified'
                };
              });
          },
          nearPoints
        );

        Q.all(promises)
          .then(function (resolves) {
            deferred.resolve(R.reduce(
              function (accum, resolve) {
                switch (resolve.type) {
                case 'damaged':
                  accum.damaged += 1;
                  break;
                case 'destroyed':
                  accum.destroyed += 1;
                  break;
                case 'fortified':
                  accum.fortified += 1;
                  break;
                }

                return accum;
              },
              {
                captured: 0,
                damaged: 0,
                destroyed: 0,
                fortified: 0
              },
              resolves
            ));
          });
      }
    });

  return deferred.promise;
};

  powerPointSchema.statics.addPointsArray = function (points) {
  var that = this,
    deferred = Q.defer(),
    promises;

  promises = R.map(
    function (point) {
      return that.addPoint(point);
    },
    points
  );

  Q.all(promises)
    .then(function (responses) {
      deferred.resolve(R.reduce(
        function (accum, response) {
          accum.captured += response.captured;
          accum.damaged += response.damaged;
          accum.destroyed += response.destroyed;
          accum.fortified += response.fortified;

          return accum;
        },
        {
          captured: 0,
          damaged: 0,
          destroyed: 0,
          fortified: 0
        },
        responses
      ));
    });

  return deferred.promise;
};

module.exports = mongoose.model('PowerPoint', powerPointSchema);
