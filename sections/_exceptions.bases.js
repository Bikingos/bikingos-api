/* jslint node: true */
'use strict';

var R = require('ramda'),
  Q = require('q'),
  request = require('superagent'),
  Base = require('../mongoose_models/base');

function makeRequest(idEstacion) {
  var deferred = Q.defer();

  request
    .get('http://datos.labplc.mx/movilidad/ecobici/' + idEstacion + '.json')
    .accept('application/json')
    .end(function (response) {
      try {
        deferred.resolve(JSON.parse(response.text));
      } catch (err) {
        var position = response.text.indexOf('{"disponibilidad');
        try {
          deferred.resolve(JSON.parse(response.text.substring(position, response.text.length)));
        } catch (err) {
          deferred.resolve({});
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
  server.get('/v1/bases/availability', function (req, res) {
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

                    return {};
                  },
                  responses
                )
              );
            });
        }
      )

  });
};
