module.exports = function(grunt) {
	grunt.initConfig({
		uglify: {
			dist: {
				src: "src/static-gmap.js",
				dest: "dist/static-gmap.min.js"
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.registerTask("default", ['uglify']);
};
