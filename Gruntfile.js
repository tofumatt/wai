/*global exports:true, require:true */
module.exports = exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        coffee: {
          compile: {
            files: {
              'wai.js': 'src/*.coffee'
            }
          }
        },
        coffeelint: {
            options: {
            },
            source: ['src/*.coffee']
        },
        shell: {
            publishDocs: {
                options: {
                    stdout: true
                },
                command: 'rake publish ALLOW_DIRTY=true'
            }
        },
        uglify: {
            wai: {
                files: {
                    'wai.min.js': ['wai.js']
                }
            }
        },
        watch: {
            build: {
                files: ['src/*.coffee'],
                tasks: ['build']
            },
            grunt: {
                files: [
                    'Gruntfile.js'
                ]
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['build', 'watch']);
    grunt.registerTask('build', ['coffee', 'uglify']);
    grunt.registerTask('publish', ['shell']);
    grunt.registerTask('test', ['build', 'coffeelint']);
};
