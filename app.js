/* jslint node: true */
'use strict';

var express = require('express'),
  fs        = require('fs'),
  path      = require('path'),

  config = require('./config')(),

  app = express();

// all environments
app.set('port', process.env.PORT || config.port || 8888);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

fs.readdirSync(__dirname + '/sections').forEach(function (file) {
  var fullpath    = __dirname + '/sections/' + file;
  if (fs.existsSync(fullpath) && file !== 'lib') {
    require(fullpath)(app);
  }
});

module.exports = app;
