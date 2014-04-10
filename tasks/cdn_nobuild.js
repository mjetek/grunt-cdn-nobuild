/*
 * grunt-cdn-nobuild
 * https://github.com/mjetek/grunt-cdn-nobuild
 *
 * Copyright (c) 2014 Michal Jarosz
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('cdn_nobuild', 'Moves cdnified scripts outside build section.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
    });

    var cdnScriptTagRe = /<script\ssrc\s*=\s*['"]([a-zA-Z]+:)?\/\/[^<]+<\/script>/gim;
    var buildSectionBeginRe = /<!--\s*build:/gim;
    var buildSectionEndRe = /<!--\s*endbuild\s*-->/gim;

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join('');

      // grunt.log.writeln(src);
      var beginMatch,
          endMatch,
          buildSection;// = cdnScriptTagRe.exec(src);

      var sectionsData = ;

      while (beginMatch = buildSectionBeginRe.exec(src)) {
        endMatch = buildSectionEndRe.exec(src);

        buildSection = src.substring(beginMatch.index, endMatch.index + );
        var cdnScriptTags = [];
        var cdnMatch;
        while (cdnMatch = cdnScriptTagRe.exec(buildSection)) {
          cdnScriptTags.push(cdnMatch[0]);
        }
        var newBuildSection = buildSection.replace(cdnScriptTagRe, '');
        newBuildSection = cdnScriptTags.join('') + newBuildSection;

        sectionsData.push({
          begin: beginMatch.index,
          end: endMatch.index,
          newBuildSection: newBuildSection
        });

        grunt.log.writeln('BEGIN');
        
        grunt.log.writeln(buildSection);
        grunt.log.writeln('END');
      }

      // grunt.log.writeln('whatever test');
      // while (matches = cdnScriptTagRe.exec(src)) {
      //   grunt.log.writeln(matches[0]);
      // }
      // grunt.log.writeln(matches[0]);

      // Write the destination file.
      // grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
