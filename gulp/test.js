'use strict';

var gulp = require('gulp');
var util = require('util');

var $ = require('gulp-load-plugins')();

gulp.task('mocha', function () {
  return gulp.src(['src/**/*.spec.js'])
    .pipe($.mocha({reporter: 'list'}))
    ;
});

gulp.task('test', ['mocha']);

