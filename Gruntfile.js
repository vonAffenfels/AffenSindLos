const path = require("path");

let webpackConfig = require("./webpack.config");
webpackConfig.devServer = undefined;
webpackConfig.watch = false;

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        webpack: {
            default: webpackConfig
        },

        uglify: {
            default: {
                options: {
                    mangle: true,
                    compress: true,
                    beautify: false,
                    sourceMap: true,
                    preserveComments: false,
                    report: "min",
                    except: []
                },
                files: {
                    'public/js/bundle.js': ['public/js/bundle.js']
                }
            }
        },

        sass: {
            dist: {
                options: {
                    lineNumbers: true,
                    includePaths: [
                        './scss/',
                    ],
                    outputStyle: 'compact',
                    sourceMap: true,
                    'default-encoding': 'utf-8'
                },
                files: {
                    './public/css/styles.css': './scss/styles.scss'
                }
            }
        },

        cssmin: {
            clean: {
                options: {
                    report: 'min'
                },
                files: {
                    './public/css/styles.css': './public/css/styles.css'
                }
            }
        },

        watch: {
            sass: {
                files: ['./scss/*.scss'],
                tasks: ['sass']
            },
            js: {
                files: ['./public/js/*.js'],
                tasks: ['uglify']
            },
            options: {
                livereload: {
                    host: 'localhost',
                    port: 35732
                }
            }
        },

        "gh-pages": {
            options: {
                base: "public/"
            },
            src: ['**']
        }
    });

    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-keepalive');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-gh-pages');

    grunt.registerTask('deploy-gh', [
        'webpack',
        'sass',
        'uglify',
        'gh-pages'
    ]);

    grunt.registerTask('build', [
        'webpack',
        'sass',
        'uglify'
    ]);

    grunt.registerTask('default', [
        'webpack',
        'sass',
        'uglify'
    ]);
};