/*
 * grunt-json2json
 *
 *
 * Copyright (c) 2014 Antoine Henry
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  
  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    
    // Before generating any new files, remove any previously-created files.
    clean: {
      test: ['test/results']
    },
    
    //
    copy: {
      test_default_options: { src: 'test/fixtures/testDest.json', dest: 'test/results/resultDefault1.json' },
      test_custom_options_simple: { src: 'test/fixtures/testDest.json', dest: 'test/results/resultCustomSimple1.json' },
      test_custom_options_advanced: { src: 'test/fixtures/testDest.json', dest: 'test/results/resultCustomAdvanced1.json' }
    },
    
    // Configuration to be run (and then tested).
    json2json: {
      default_options: {
        src: ['test/fixtures/testSource1.json', 'test/fixtures/testSource2.json'],
        dest: ['test/results/resultDefault1.json', 'test/results/resultDefault2.json']
      },
      custom_options_simple: {
        options: {
          updateOnly: true,
        },
        src: ['test/fixtures/testSource1.json', 'test/fixtures/testSource2.json'],
        dest: ['test/results/resultCustomSimple1.json', 'test/results/resultCustomSimple2.json']
      },
      custom_options_advanced: {
        options: {
          pointers: [
            '/test1_property1',
            '/test2_property2',
            '/test1_objectProperty',
            '/test2_objectProperty',
            '/commonProperty',
            '/commonArrayProperty/0',
            '/commonArrayProperty/1',
            '/commonObjectProperty'
          ],
          map: {'/test2_property2': '/remapped_test2_property2'}
        },
        src: ['test/fixtures/testSource1.json', 'test/fixtures/testSource2.json'],
        dest: ['test/results/resultCustomAdvanced1.json', 'test/results/resultCustomAdvanced2.json']
      }
    },
    
    // Unit tests.
    nodeunit: {
      test: ['test/*_test.js']
    }
    
  });
  
  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');
  
  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  
  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'copy', 'json2json', 'nodeunit']);
  
  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);
  
};