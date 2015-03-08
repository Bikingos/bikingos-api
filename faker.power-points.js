/* jslint node: true */
'use strict';

var mongoose = require('mongoose'),
  Chance = require('chance'),
  chance = new Chance(),
  config = require('./config')(),
  conectionString = 'mongodb://localhost:27017/' + config.db,
  PowerPoint = require('./mongoose_models/power-point'),
  points = [],

  NUMBER_OF_POINTS = process.argv[2] || 1,
  i;

for(i = 0; i < NUMBER_OF_POINTS; i+=1) {
  points.push({
    coordinates: {
      latitude: chance.latitude({ min: 19.402323, max: 19.437455 }),
      longitude: chance.latitude({ min: -99.205868, max: -99.153254 })
    },
    team: chance.pick(['red', 'green'])
  });
}

mongoose.connect(conectionString, function (err) {
  if (err) { throw err; }
  console.log('Successfully connected to MongoDB at: ' + config.db);

  points = points.map(function (point) {
    return new PowerPoint(point);
  });

  PowerPoint.addPointsArray(points)
    .then(function (resolve) {
      console.log(resolve);
    });
});
