/* jslint node: true */
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var baseSchema = new Schema({
  id: Number,
  principal: String,
  secundario: String,
  referencia: String,
  colonia: String,
  delegacion: String,
  longitud: Number,
  latitud: Number,
  nombre: String,
});

module.exports = mongoose.model('Base', baseSchema);
