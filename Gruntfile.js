//----------------------------------------------------------------------------------------------------------------------
// RPGKeeper EotE System Gruntfile.
//----------------------------------------------------------------------------------------------------------------------

module.exports = function(grunt)
{
    // Project configuration.
    grunt.initConfig({
        project: {
            less: ['client/less/**/*.less', 'client/**/*.less']
        },
        less: {
            min: {
                options: {
                    paths: ['node_modules/bootstrap/less'],
                    compress: true
                },
                files: {
                    'client/css/eote.min.css': ['<%= project.less %>']
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 8', 'ie 9']
            },
            min: {
                src: 'client/css/eote.min.css'
            }
        },
        watch: {
            less: {
                files: ['<%= project.less %>'],
                tasks: ['less', 'autoprefixer'],
                options: {
                    atBegin: true
                }
            }
        }
    });

    // Grunt Tasks.
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-autoprefixer');

    // Setup the build task.
    grunt.registerTask('build', ['less', 'autoprefixer']);
}; // module.exports

// ---------------------------------------------------------------------------------------------------------------------