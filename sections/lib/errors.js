/* jslint node: true */
'use strict';

module.exports = {
  schemaNotFound:  function (schema) {
    return {
      error: '1',
      type: 'Schema not found',
      message: "The following schema was not found: " + schema
    };
  },

  noKeysFound: function (keys) {
    return {
      error: '2',
      type: 'No keys found',
      message: "Any of the following keys were not found: " + keys.join(', ')
    };
  },

  noUserFound:  function (user) {
    return {
      error: '3',
      access: false,
      type: 'No user found',
      message: "User not found: " + user
    };
  },

  wrongPassword: function () {
    return {
      error: '4',
      access: false,
      type: 'Wrong password',
      message: "Wrong password"
    };
  },

  noId: function (noId) {
    return {
      type: 'Invalid Id.',
      message: 'The following id is not a valid Id: ' + noId
    };
  },

  noCondition: function () {
    return {
      type: 'Invalid removal criteria',
      message: 'Please, provide a valid removal criteria'
    };
  }
};
