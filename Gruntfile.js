module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    express: {
      options: {
        // Override defaults here
        //background: true,
        //spawn: true
      },
      dev: {
        options: {
          script: 'dest/src/app.min.js'
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      my_target: {
        files: {
          'dest/app.min.js': ['src/*.js', 'src/*/*.js']
        }
      },
      min: {
        files: grunt.file.expandMapping(['src/*.js', 'src/**/*.js'], 'dest/', {
            rename: function(destBase, destPath) {
              console.log(destBase, destPath);
              return destBase+destPath.replace('.js', '.min.js');
            }
        })
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    lintspaces: {
      all: {
        src: [
            'src/*',
            'src/*/*'
       ],
        options: {
            newline: true,
            newlineMaximum: 2,
            trailingspaces: true,
            indentation: 'spaces',
            spaces: 2
        }
      }
    },
    clean: ['dest'],
    watch: {
      scripts: {
        files: ['src/*','src/*/*'],
        tasks: ['build'],
        options: {
          spawn: false,
          livereload: true
        }
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-lintspaces');
  grunt.loadNpmTasks('grunt-contrib-clean');
  //grunt.loadNpmTasks('grunt-shell');
  //grunt.loadNpmTasks('grunt-bg-shell');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('build', ['clean', 'uglify:min', 'jshint', 'lintspaces', 'express:dev', 'watch']);
  //grunt.registerTask('buildProd', ['clean', 'uglify', 'jshint', 'less:production', 'lintspaces']);

  // Default task(s).
  grunt.registerTask('default', ['build']);

};