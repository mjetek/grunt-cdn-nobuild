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

    var cdnTagsRe = /(<script\ssrc\s*=\s*['"](?:[a-zA-Z]+:)?\/\/[^<]+<\/script>\r?\n?)|(<link\s+(?:\w*\s*[="]*)*\s+href\s*=\s*['"](?:[a-zA-Z]+:)?\/\/[^<>]+\/?>\r?\n?)/gim;
    var buildSectionBeginRe = /<!--\s*build:/gim;
    var buildSectionEndRe = /<!--\s*endbuild/gim;

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

      var beginMatch,
          endMatch,
          buildSection;

      var sectionsData = [];

      buildSectionBeginRe.lastIndex = 0;
      buildSectionEndRe.lastIndex = 0;
      while (beginMatch = buildSectionBeginRe.exec(src)) {
        endMatch = buildSectionEndRe.exec(src);

        if (!endMatch) {
          grunt.fail.fatal('Missing endbuild block!');
        }

        buildSection = src.substring(beginMatch.index, endMatch.index);
        var cdnScriptTags = [];
        var cdnMatch;
        while (cdnMatch = cdnTagsRe.exec(buildSection)) {
          cdnScriptTags.push(cdnMatch[0]);
        }
        var newBuildSection = buildSection.replace(cdnTagsRe, '');
        newBuildSection = cdnScriptTags.join('') + newBuildSection;

        sectionsData.push({
          begin: beginMatch.index,
          end: endMatch.index,
          newBuildSection: newBuildSection
        });
      }

      for (var i = sectionsData.length -1; i >= 0; i--) {
        var section = sectionsData[i];
        src = src.substring(0, section.begin) + section.newBuildSection + src.substring(section.end);
      }

      grunt.file.write(f.dest, src);
      grunt.log.writeln('Write to file "' + f.dest + '"');
    });
  });

};
