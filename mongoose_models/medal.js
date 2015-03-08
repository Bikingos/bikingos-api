/* jslint node: true */
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var medalSchema = new Schema({
  name: String,
  title: String,
  needed: Number,
  unit: String,
  type: Number
});

module.exports = mongoose.model('Medal', medalSchema);
