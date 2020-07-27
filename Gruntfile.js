module.exports = function(grunt) {
    grunt.initConfig({
        babel: {
            options: {
                sourceMap: true,
                comments: false,
                presets: ["@babel/preset-env"]
            },
            dist: {
                expand: true,
                cwd: "src/",
                src: ["*.js"],
                dest: "dist/"
            }
        },
        eslint: {
            options: {
                configFile: ".eslintrc.js",
                fix: true
            },
            target: ["src/**/*.js", "Gruntfile.js"]
        }
    });

    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks("grunt-eslint");

    grunt.registerTask("default", ["babel"]);
    grunt.registerTask("lint", ["eslint"]);
};
