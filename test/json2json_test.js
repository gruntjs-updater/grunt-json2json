'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.json2json = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    test.expect(2);

    var actual = grunt.file.readJSON('test/results/resultDefault1.json');
    var expected = grunt.file.readJSON('test/expected/resultDefault.json');
    test.deepEqual(actual, expected, 'should merge the source files.');
    
    actual = grunt.file.readJSON('test/results/resultDefault2.json');
    test.deepEqual(actual, expected, 'should output the same result to several destinations.');

    test.done();
  },
  custom_options_simple: function(test) {
    test.expect(2);

    var actual = grunt.file.readJSON('test/results/resultCustomSimple1.json');
    var expected = grunt.file.readJSON('test/expected/resultCustomSimple.json');
    test.deepEqual(actual, expected, 'should update the specified properties from source.');
    
    actual = grunt.file.readJSON('test/results/resultCustomSimple2.json');
    expected = {};
    test.deepEqual(actual, expected, 'should create an empty JSON when updating only to an unexisting file.');

    test.done();
  },
  custom_options_advanced: function(test) {
    test.expect(2);

    var actual = grunt.file.readJSON('test/results/resultCustomAdvanced1.json');
    var expected = grunt.file.readJSON('test/expected/resultCustomAdvanced1.json');
    test.deepEqual(actual, expected, 'should merge the specified properties from sources and remap to new properties without overriding existing ones.');
    
    actual = grunt.file.readJSON('test/results/resultCustomAdvanced2.json');
    expected = grunt.file.readJSON('test/expected/resultCustomAdvanced2.json');
    test.deepEqual(actual, expected, 'should merge the specified properties from sources and remap to new properties.');

    test.done();
  },
};
