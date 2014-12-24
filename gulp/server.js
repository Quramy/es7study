'use strict';

var gulp = require('gulp');
var util = require('util');

var browserSync = require('browser-sync');

function browserSyncInit (baseDir, files, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  var isDoc = baseDir === '.tmp' || (util.isArray(baseDir) && baseDir.indexOf('.tmp') !== -1);
  
	if(isDoc){
		routes = {
			'/bower_components': 'bower_components',
			'/deps': 'bower_components'
    };
	}

	browserSync.instance = browserSync.init(files, {
		startPath: '/index.html',
		server: {
			baseDir: baseDir,
			middleware: [],
			routes: routes
		},
		browser: browser
	});
}

// Run document application on server for development purposes.
// If you modify ngdoc contents(in .js or .ngdoc), run Dgeni to rebuild partial htmls, and reload.
// If you modify document app, reload only.
gulp.task('serve', [], function () {
  browserSyncInit(['.tmp', 'src'], ['.tmp/**/*.js', 'src/**/*.html', 'src/**/*.js']);
});


