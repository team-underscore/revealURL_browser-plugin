'use strict';

module.exports = function (grunt) {
	/*
		5. Build a into dist and zip
	*/

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['Gruntfile.js', 'assets/**/*.js']
    },
    terser: {
      options: {
        mangle: eval,
        compress: true
      },
      build: {
        files: {
          'dist/assets/js/background.js': 'src/assets/js/background.js',
          'dist/assets/js/popup.js': 'src/assets/js/popup.js',
        }
      }
    },
    stylelint: {
      options: {
        configFile: '.stylelint'
      },
      all: ['src/**/*.css']
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'dist/popup.html': 'src/popup.html',
        }
      },
    },
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'dist/'
        }]
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'src',
          dest: 'dist',
          src: [
            '*.json'
          ]
        }]
      }
    },
    compress: {
      dist: {
        options: {
          archive: 'build/RevealURL<%= pkg.version %>.zip'
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['**'],
          dest: ''
        }]
      }
    }
  });

  // Load the plugin that provides the 'terser' task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-terser');
  grunt.loadNpmTasks('grunt-stylelint');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Default task(s).
  // grunt.registerTask('default', ['jshint']);
  grunt.registerTask('default', ['jshint', 'terser', 'stylelint', 'imagemin', 'htmlmin', 'copy', 'compress']);

};
