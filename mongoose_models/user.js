/* jslint node: true */
'use strict';

var mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  request = require('superagent'),
  moment = require('moment'),
  Q = require('q'),
  R = require('ramda'),
  Schema = mongoose.Schema,
  SALT_WORK_FACTOR = 10,

  Medal = require('./medal');

var userSchema = new Schema({
  '_id': false,

  // User information
  username: {
    type: String,
    index: { unique: true },
    trim: true,
    required: true
  },
  password: { type: String, required: true },
  idEcobici: { type: String },
  team: String,
  level: { type: Number, default: 1 },
  nextLevel: { type: Number, default: 1000 },
  avatar: String,
  //TODO add email validation via regex
  email: { type: String },

  // Stats information
  stats: {
    experience: { type: Number, default: 0 },
    time: { type: Number, default: 0 },
    trips: { type: Number, default: 0 },
    kilometers_traveled: { type: Number, default: 0 },
    contaminants_avoided: { type: Number, default: 0 },
    bases: {
      _id: false,
      visited: { type: Number, default: 0 },
      unique: { type: Number, default: 0 }
    },
    power_points: {
      _id: false,
      captured: { type: Number, default: 0 },
      damaged: { type: Number, default: 0 },
      destroyed: { type: Number, default: 0 },
      fortified: { type: Number, default: 0 }
    }
  }
});

userSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return next(err);
    }

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        return next(err);
      }

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

userSchema.methods.updateEcobiciData = function () {
  var that = this,
    deferred = Q.defer();

  request
    .get('http://datos.labplc.mx/movilidad/ecobici/usuario/' + this.idEcobici + '.json')
    .accept('application/json')
    .end(function (res) {
      var response = JSON.parse(res.text).ecobici.viajes,
        trips = response.length,
        basesVisited = trips * 2,
        tiempo,
        uniqueBases;

      uniqueBases = R.uniq(
        R.concat(
          R.pluck('station_arrived', response),
          R.pluck('station_removed', response)
        )
      ).length;

      tiempo = R.compose(
        R.reduce(
          function (accum, minutes) {
            return accum + minutes;
          },
          0
        ),
        R.map(
          function (trip) {
            var initial = moment(trip.date_removed),
              final = moment(trip.date_arrived);

            return final.diff(initial, 'minutes');
          }
        )
      )(response);

      that.stats.time = tiempo;
      that.stats.trips = trips;
      that.stats.bases.visited = basesVisited;
      that.stats.bases.unique = uniqueBases;

      that.stats.contaminants_avoided = that.stats.kilometers_traveled * tiempo;

      that.save(deferred.resolve);
    });

  return deferred.promise;
};

userSchema.methods.getMedals = function () {
  var userStats = {
    trips: this.stats.trips,
    kilometers_traveled: this.stats.kilometers_traveled,
    contaminants_avoided: this.stats.contaminants_avoided,
    bases_visited: this.stats.bases.visited,
    bases_unique: this.stats.bases.unique,
    power_points_captured: this.stats.power_points.captured,
    power_points_damaged: this.stats.power_points.damaged,
    power_points_destroyed: this.stats.power_points.destroyed,
    power_points_fortified: this.stats.power_points.fortified
  };

  return Medal
    .find()
    .exec()
    .then(function (medals) {
      return R.map(
        function (medal) {
          return {
            name: medal.name,
            title: medal.title,
            needed: medal.needed,
            unit: medal.unit,
            type: medal.type,
            unlocked: userStats[medal.name] > medal.needed,
            stat: userStats[medal.name]
          };
        },
        medals
      );
    });
};

module.exports = mongoose.model('User', userSchema);
