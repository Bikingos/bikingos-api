/* jslint node: true */
'use strict';

var mongoose = require('mongoose'),
  http = require('http'),
  config = require('./config')(),
  conectionString = 'mongodb://localhost:27017/' + config.db,
  app = require('./app');

mongoose.connect(conectionString, function (err) {
  if (err) { throw err; }
  console.log('Successfully connected to MongoDB at: ' + config.db);
});

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
