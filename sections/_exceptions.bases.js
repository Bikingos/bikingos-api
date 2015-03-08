/* jslint node: true */
'use strict';

var R = require('ramda'),
  Chance = require('chance'),
  chance = new Chance(),
  Q = require('q'),
  request = require('superagent'),
  Base = require('../mongoose_models/base');

function makeRequest(idEstacion) {
  var deferred = Q.defer();

  request
    .get('http://datos.labplc.mx/movilidad/ecobici/' + idEstacion + '.json')
    .accept('application/json')
    .end(function (err, response) {
      if (err) { console.log(err); }
      try {
        deferred.resolve(JSON.parse(response.text));
      } catch (err) {
        var position = response.text.indexOf('{"disponibilidad');
        try {
          deferred.resolve(JSON.parse(response.text.substring(position, response.text.length)));
        } catch (error) {
          deferred.resolve({ disponibilidad: false, id: idEstacion });
        }
      }
    });

  return deferred.promise;
}

function getStatus(bicycles) {
  bicycles = parseInt(bicycles, 10);

  return bicycles < 5 ? 'special' : 'normal';
}

module.exports = function (server) {
  /*jslint unparam:true */
  server.get('/v1/bases/availability', function (req, res) {
    Base
      .find()
      .exec()
      .then(
        function (bases) {
          res.send(R.map(
            function (base) {
              return {
                status: chance.pick(['normal', 'normal', 'normal', 'normal', 'special']),
                coordinates: {
                  latitude: base.latitud,
                  longitude: base.longitud
                }
              }
            },
            bases
          ));
        }
      );
  });

  server.get('/v1/bases/availability/real', function (req, res) {
    var promises,
      allBases;

    Base
      .find()
      .exec()
      .then(
        function (bases) {
          allBases = R.compose(R.mapObj(R.head), R.groupBy(R.prop('id')))(bases);

          promises = R.map(
            function (base) {
              return makeRequest(base.id);
            },
            bases
          );

          Q
            .all(promises)
            .then(function (responses) {
              res.send(
                R.map(
                  function (response) {
                    if (response.disponibilidad) {
                      return {
                        status: getStatus(response.disponibilidad.bicicletas),
                        coordinates: {
                          latitude: allBases[response.disponibilidad.estacion_id].latitud,
                          longitude: allBases[response.disponibilidad.estacion_id].longitud
                        }
                      };
                    }

                    return {
                      status: 'normal',
                      coordinates: {
                        latitude: allBases[response.disponibilidad.estacion_id].latitud,
                        longitude: allBases[response.disponibilidad.estacion_id].longitud
                      }
                    };
                  },
                  responses
                )
              );
            });
        }
      );
  });
  /*jslint unparam:false */
};
