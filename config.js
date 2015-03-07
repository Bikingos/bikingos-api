var config = {
  dev: {
    mode : 'dev',
    db: 'bikeTest'
  },
  production: {
    mode : 'production',
    db: 'bike'
  }
};

module.exports = function ( mode ) {
  return config[ mode || process.argv[ 2 ] || 'dev' ] || config.dev;
};
