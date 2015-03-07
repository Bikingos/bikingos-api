/* jslint node: true */
'use strict';

var config = {
  local: {
    mode: 'dev',
    port: 8888,
    db: 'test'
  },
  dev: {
    mode: 'dev',
    port: 8888,
    db: 'test'
  },
  production: {
    mode: 'production',
    port: 8453,
    db: 'production'
  }
};
module.exports = function (mode) {
  return config[mode || process.argv[2] || 'dev'] || config.local;
};
