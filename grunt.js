/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*<%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    qunit: {
      files: ['test/*.html']
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', 'source/core.js', 'source/core-methods.js', 'source/manipulation.js'],
        dest: 'builds/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'builds/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    lint: {
      afterconcat: ['builds/dom.js']
    },
    uglify: {},
    jshint: {
      options: {
        "evil": true,
        "regexdash":true,
        "browser":true,
        "wsh":true,
        "curly":true,
        "eqnull":true,
        "expr":true,
        "noarg":true,
        "quotmark":"single",
        "smarttabs":true,
        "trailing":true,
        "undef":true,
        "es5" : true,
        "unused": true,
        "sub": true
      },
      globals: {
        'dom': true
      }
    },
    dox: { files: { src: ['source/*.js'], dest: 'docs' } }

  });

  // Default task.
  grunt.registerTask('default', 'qunit concat lint:afterconcat min');

};