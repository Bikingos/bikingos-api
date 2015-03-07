/* jslint node: true */
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  __ = require('underscore')._,
  utils = require('./utils');

module.exports.generateSchema = function (name, inputs) {
  var schemaConstructor,
    newSchema;

  if (__.indexOf(__.keys(mongoose.models), name) > 0) {
    return mongoose.model(name);
  }

  schemaConstructor = __.reduce(inputs, function (inputsObject, input, index) {
    var key = utils.toSnakeCase(input.label) + index;
    if (input.required) {
      inputsObject[key] = {type: String, required: true};
    } else {
      inputsObject[key] = {type: String};
    }

    return inputsObject;
  }, {});

  newSchema = new Schema(schemaConstructor);

  return mongoose.model(name, newSchema);
};

module.exports.toSnakeCase = function (text) {
  return text.replace(/[^\w\s]/gi, "").toLowerCase().replace(/\s/g, "_");
};
