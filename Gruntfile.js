/* jshint node:true */
module.exports = function(grunt) {
	"use strict";

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		clean: {
			dist: ["dist/*"]
		},
		connect:{
			dev: {
				options: {
					port     : 8080,
					keepalive: true,
					hostname : "*",
					base     : "src"
				}
			},
			live: {
				options: {
					port     : 8080,
					hostname : "*",
					base     : "src"
				}
			},
			prod: {
				options: {
					port     : 9090,
					keepalive: true,
					hostname : "*",
					base     : "dist"
				}
			}
		},
		validation: {
			dist: {
				options: {
					reset: true,
					path: "log/validation-status.json",
					reportpath: "log/validation-report.json",
					stoponerror: true
				},
				files: {
					src: ["src/index.html"]
				}
			}
		},
		htmlmin: {
			dist: {
				options: {
					// collapseWhitespace       : true,
					collapseBooleanAttributes: true,
					removeEmptyAttributes    : true,
					removeRedundantAttributes: true
				},
				files: [{
					src : "src/index.html",
					dest: "dist/index.html"
				}]
			}
		},
		cssmin: {
			dist: {
				files: [{
					src : "src/main.css",
					dest: "dist/main.css"
				}]
			}
		},
		jshint: {
			dist: {
				options: {
					bitwise  : true,
					camelcase: true,
					curly    : true,
					eqeqeq   : true,
					immed    : true,
					latedef  : true,
					newcap   : true,
					noarg    : true,
					quotmark : true,
					strict   : true,
					undef    : true,
					unused   : true,
					globals: {
						Fluidvids: true
					},
					browser: true,
					jquery : true
				},
				files: [
					{src: "Gruntfile.js"},
					{src: "src/**/*.js"}
				]
			}
		},
		uglify: {
			dist: {
				files: [{
					expand: true,
					cwd   : "src",
					src   : "**/*.js",
					ext   : ".js",
					dest  : "dist"
				}]
			}
		},
		imagemin: {
			dist:{
				options: {
					optimizationLevel: 3
				},
				files: [{
					expand: true,
					cwd: "src/img",
					src:  ["**/*.{png,jpg}"],
					dest: "dist/img"
				}]
			}
		},
		watch: {
			js: {
				files: ["src/**/*.js"],
				tasks: ["jshint"],
			},
			livereload : {
				options: {
					livereload: true
				},
				files: ["src/**/*.{html,css,js,png,jpg}"]
			}
		}
	});

	["clean", "connect", "cssmin", "jshint", "htmlmin", "imagemin", "uglify", "watch"]
		.forEach(function (task) {
			grunt.loadNpmTasks("grunt-contrib-" + task);
		})
	;

	grunt.loadNpmTasks("grunt-html-validation");

	grunt.registerTask("default", ["clean", "validation", "htmlmin", "cssmin", "imagemin", "jshint", "uglify"]);
	grunt.registerTask("livereload", ["connect:live", "watch:livereload"]);
};
