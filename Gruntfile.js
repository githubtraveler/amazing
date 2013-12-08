module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		clean: {
			dist: ["dist/*"]
		},
		htmlmin: {
			dist: {
				options: {
					collapseWhitespace       : true,
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
		uglify: {
			dist: {
				files: [{
					expand: true,
					cwd   : "src/js",
					src   : "*.js",
					ext   : ".js",
					dest  : "dist/js"
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
		}
	});

	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-htmlmin");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-imagemin");

	grunt.registerTask("default", ["htmlmin", "cssmin", "imagemin", "uglify"]);
};
