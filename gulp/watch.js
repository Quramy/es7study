'use strict';

var gulp = require('gulp');
var util = require('util');

var $ = require('gulp-load-plugins')();

gulp.task('watch', function (){
  gulp.watch(['src/lib/**/*.js'], ['mocha']);
});
