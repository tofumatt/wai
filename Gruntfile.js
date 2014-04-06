/*global exports:true, require:true */
module.exports = exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        casper: {
        },
        coffee: {
          compile: {
            files: {
              'dist/wai.js': 'src/*.coffee'
            }
          }
        },
        coffeelint: {
            options: {
            },
            source: ['src/*.coffee']
        },
        shell: {
            listFolders: {
                options: {
                    stdout: true
                },
                command: 'rake publish ALLOW_DIRTY=true'
            }
        },
        uglify: {
            wai: {
                files: {
                    'dist/wai.min.js': ['dist/wai.js']
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
    // grunt.registerTask('publish', ['shell']);

    // grunt.registerTask('server', function() {
    //     grunt.log.writeln('Starting web server at test/server.coffee');

    //     require('./test/server.coffee').listen(8181);
    // });

    grunt.registerTask('test', ['build', 'coffeelint']);
};
