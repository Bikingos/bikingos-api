/* jslint node: true */
'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    exec: {
      start_server: {
        command: 'mongod&'
      }
    },

    jslint: {
      server: {
        src: [
          'index.js',
          'Gruntfile.js',
          'mongo-queries.js',
          'config/*.js',
          'mongoose_models/*.js',
          'sections/*.js',
          'test/*.js',
          'sections/lib/*.js'
        ],
        exclude: [
          'node_modules/*'
        ],
        directives: {
          indent: 2,
          nomen:  true,
          node:   true,
          regexp: true,
          stupid: true,
          todo:   true
        },
        options: {
          edition: 'latest',
          failOnError: true
          /*
           * TODO: Checkstyle file to be writte
           */
          //checkstyle: 'out/server-checkstyle.xml'
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          quiet: false,
          captureFile: 'test/test-report.txt'
        },
        src: ['test/**/*.js', 'test/*.js']
      }
    },
    nodemon: {
      dev: {
        options: {
          file: 'index.js',
          args: ['dev'],
          ignoredFiles: ['node_modules/**'],
          watchedExtensions: ['js'],
          delayTime: 1
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('lint', ['jslint']);
  grunt.registerTask('init', ['exec', 'nodemon']);
  grunt.registerTask('test', 'mochaTest');
};
