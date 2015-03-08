/* jslint node: true */
'use strict';

var PowerPoint = require('../mongoose_models/power-point');

module.exports = function (server) {
  var point = new PowerPoint({
      coordinates: {
        latitude: 19.473588,
        longitude: -99.141543
      },
      team: 'green'
    });

  PowerPoint
    .addPoint(point)
    .then(function (resolve) {
      console.log(resolve);
    });
};
