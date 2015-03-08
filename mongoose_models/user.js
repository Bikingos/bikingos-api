/* jslint node: true */
'use strict';

var mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  request = require('superagent'),
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
  //TODO add email validation via regex
  email: { type: String },

  // Stats information
  stats: {
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
