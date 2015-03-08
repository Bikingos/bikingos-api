/* jslint node: true */
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10;

var userSchema = new Schema({
  '_id': false,

  // User information
  username: {
    type: String,
    index: { unique: true },
    trim: true,
    required: true
  },
  idEcobici: { type: String }
  //TODO add email validation via regex
  email: { type: String },
  password: { type: String },

  // Stats information
  stats: {
    trips: Number,
    kilometers_traveled: Number,
    contaminants_avoided: Number,
    bases: {
      _id: false,
      visited: Number,
      unique: Number
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
  
};

module.exports = mongoose.model('User', userSchema);
