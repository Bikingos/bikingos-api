/* jslint node: true */
'use strict';
var fs        = require('fs'),
  errors    = require('./lib/errors'),
  success   = require('./lib/success'),
  warnings  = require('./lib/warnings'),
  __        = require('underscore')._,
  schemas   = {},
  basePath  = __dirname + '/../mongoose_models',
  url       = require('url');

fs.readdirSync(basePath).forEach(
  function (file) {
    var path = basePath + '/' + file;
    schemas[file.slice(0, -3)] = require(path);
  }
);

function basicValidations(req, res, next) {
  var schema = req.params.schema.slice(0, -1),
    pathSchema = req.params.schema,
    flag     = true;

  if (schemas[schema] === undefined) {
    res.send(errors.schemaNotFound(pathSchema));
    flag = false;
  }

  if (flag) { next(); }
}

function isEmpty(object) {
  var key;
  for (key in object) {
    if (object.hasOwnProperty(key)) {
      return true;
    }
  }
  return false;
}

module.exports = function (server) {
  server.get('/v1/:schema', basicValidations, function (req, res) {
    var condition = {},
      schema      = req.params.schema.slice(0, -1),
      key,
      keys        = [],
      warning     = {};

    for (key in schemas[schema].schema.paths) {
      if (schemas[schema].schema.paths.hasOwnProperty(key)) {
        keys.push(key);
      }
    }

    schemas[schema].find(condition).select('-_id').exec(
      function (err, docs) {
        if (err) { throw err; }

        var toSend = { data: docs };
        if (isEmpty(warning)) { toSend.warnings = warning; }

        res.json(toSend);
      }
    );
  });

  server.get('/v1/:schema/:id', basicValidations, function (req, res) {
    var condition = {},
      schema      = req.params.schema.slice(0, -1),
      id          = req.params.id,
      key,
      keys        = [],
      query       = url.parse(req.url).query,
      warning     = {};

    if (query) {
      console.log(query);
    } else {
      req.params.id = req.params.id.substring(0, req.params.id.indexOf('?'));
      for (key in schemas[schema].schema.paths) {
        if (schemas[schema].schema.paths.hasOwnProperty(key)) {
          keys.push(key);
        }
      }

      if (schema === 'user') {
        condition = {
          username: id
        };
      } else {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
          condition = {
            _id: req.params.id
          };
        } else {
          res.send({ error: errors.noId(req.params.id) });
        }
      }
      schemas[schema].findOne(condition).select('-_id').exec(
        function (err, docs) {
          if (err) {
            throw err;
          }
          var toSend = { data: docs };
          if (isEmpty(warning)) { toSend.warnings = warning; }

          res.json(toSend);
        }
      );
    }

  });

  server.post('/v1/:schema', basicValidations, function (req, res) {
    var schema    = req.params.schema.slice(0, -1),
      reference   = req.body.reference,
      newDocument = new schemas[schema](reference);
      //newDocument = new schemas[schema]({"name": "amet", "email": "amet.alvirde@gmail.com"});

    newDocument.save(function (err) {
      if (err) {
        res.send(err);
      }
      res.send({
        _id:     newDocument._id,
        status:  true,
        message: success.savedCorrectly(schema)
      });
    });
  });

  server.del('/v1/:schema/:id', basicValidations, function (req, res) {
    var schema  = req.params.schema.slice(0, -1),
      id        = req.params.id,
      condition = {};

    if (schema === 'user') {
      condition = {
        username: id
      };
    } else {
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        condition = {
          _id: req.params.id
        };
      } else {
        res.send({ error: errors.noId(req.params.id) });
      }
    }
    if (!condition) {
      res.send({status: false, message: errors.noCondition()});
    }

    schemas[schema].remove(condition).exec(function (err) {
      if (err) { throw err; }
      res.send({ status: true, message: success.deletedCorrectly() });
    });
  });

  server.patch('/v1/:schema/:id', basicValidations, function (req, res) {
    var schema  = req.params.schema.slice(0, -1),
      condition = {},
      id        = req.params.id,
      reference = req.body.reference;

    if (schema === 'user') {
      condition = {
        username: id
      };
    } else {
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        condition = {
          _id: req.params.id
        };
      } else {
        res.send({ error: errors.noId(req.params.id) });
      }
    }
    /*jslint unparam: true*/
    schemas[schema].update(condition, reference, function (err, number, raw) {
      if (err) { throw err; }
      res.send({ status: true, message: success.updatedCorrectly()});
    });
    /*jslint unparam: true*/
  });
};
