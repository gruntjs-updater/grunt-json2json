/*
 * grunt-json2json
 *
 *
 * Copyright (c) 2014 Antoine Henry
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  
  grunt.registerMultiTask('json2json', 'Populate JSON files with properties from other JSON files.', function () {
    var jsonPointer = require('json-pointer');
    var filesUpdated = 0, filesCreated = 0;
    
    var options = this.options({
      updateOnly: false,
      pointers: [],
      map: {},
      indent: '\t'
    }); 
    
    this.files.forEach(function (filePathArray) {
      var mergedSources = {};
      
      // Reads sources and merges them
      if (filePathArray.src && filePathArray.src.length > 0) {
        filePathArray.src.map(function (filePath) {
          return grunt.file.readJSON(filePath);
        }).forEach(function (json) {
          if (options.pointers.length == 0) {
            jsonPointer.walk(json, function (value, pointer) {
                jsonPointer.set(mergedSources, pointer, value);
            });
          } else {
            options.pointers.forEach(function (pointer) {
              if (jsonPointer.has(json, pointer))
                jsonPointer.set(mergedSources, pointer, jsonPointer.get(json, pointer));
            });
          }
        });
      } else {
        grunt.fail.warn('No source to read from.');
      }
      
      // Remaps merged sources
      for (var pointer in options.map)
      {
        if (jsonPointer.has(mergedSources, pointer)) {
          jsonPointer.set(mergedSources, options.map[pointer], jsonPointer.get(mergedSources, pointer));
          jsonPointer.remove(mergedSources, pointer);
        }
      }
      
      // Updates destinations
      if (filePathArray.dest) {
        if (!Array.isArray(filePathArray.dest)) {
          filePathArray.dest = [filePathArray.dest];
        }
        if (filePathArray.dest.length > 0) {
          filePathArray.dest.forEach(function (filePath) {
            var destJson = grunt.file.exists(filePath) ? grunt.file.readJSON(filePath) : {};
            jsonPointer.walk(mergedSources, function (value, pointer) {
              if (!options.updateOnly || (options.updateOnly && jsonPointer.has(destJson, pointer))) {
                jsonPointer.set(destJson, pointer, value);
              }
            });
            
            if (grunt.file.exists(filePath))
              filesUpdated++;
            else
              filesCreated++;
            
            grunt.file.write(filePath, JSON.stringify(destJson, null, options.indent));
          });
        } else {
          grunt.fail.warn('No destination to write to.');
        }
      }
    });
    
    var msg = ""
    if (filesCreated > 1)
      msg += filesCreated.toString().cyan + " files created";
    else if (filesCreated > 0)
      msg += filesCreated.toString().cyan + " file created";
    if (filesCreated > 0 && filesUpdated > 0)
      msg += ", ";
    else if (filesCreated > 0 && filesUpdated <= 0)
      msg += ".";
    if (filesUpdated > 1)
      msg += " " + filesUpdated.toString().cyan + " files updated.";
    else if (filesUpdated > 0)
      msg += " " + filesUpdated.toString().cyan + " file updated.";
    grunt.log.ok(msg);
  });
  
};