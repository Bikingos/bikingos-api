/* jslint node: true */
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var powerPointSchema = new Schema({
  coords: {
    latitude: Number,
    longitude: Number
  },
  health: Number,
  team: Number
});

module.exports = mongoose.model('PowerPoint', powerPointSchema);
