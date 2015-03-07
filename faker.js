/* jslint node: true */
'use strict';

var mongoose = require('mongoose'),
  faker = require('faker'),
  config = require('./config')(),
  conectionString = 'mongodb://localhost:27017/' + config.db,
  User = require('./mongoose_models/user'),
  users = [],

  NUMBER_OF_USERS = process.argv[2] || 1,
  CARRERS = [
      'Economista',
      'Ingeniero Industrial',
      'Cineasta',
      'Quimico Industrial',
      'Developer'
    ],
  SCHOOLS = [
      'ITAM',
      'UNAM',
      'UAM',
      'IPN'
    ],
  i;

for(i = 0; i < NUMBER_OF_USERS; i+=1) {
  users.push({
    username: faker.internet.userName(),
    password: 'password',
    name: faker.name.firstName(),
    email: faker.internet.email(),
    lastName: faker.name.lastName(),
    role: [faker.random.array_element(['student', 'tutor'])]
  });
}

users.forEach(function (user) {
  var role = faker.random.array_element(['student', 'tutor']);

  user.role = role;

  if (role === 'tutor') {
    user.average = faker.random.number({ min: 0, max: 5 });
    user.career = faker.random.array_element(CARRERS);
    user.school = faker.random.array_element(SCHOOLS);
    user.bio = faker.lorem.paragraph();
    user.shortBio = faker.hacker.phrase();
  }
});

mongoose.connect(conectionString, function (err) {
  if (err) { throw err; }
  console.log('Successfully connected to MongoDB at: ' + config.db);

  users.forEach(function (user) {
    var user_ = new User(user);
    user_.save();
  });
});
