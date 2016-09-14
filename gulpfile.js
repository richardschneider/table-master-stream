'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-spawn-mocha');
var coveralls = require('gulp-coveralls');

var DEBUG = process.env.NODE_ENV === 'debug',
    CI = process.env.CI === 'true';

var paths = {
    test: ['./test/**/*.js', '!test/{temp,temp/**}'],
    source: ['./lib/*.js', './bin/*']
};
paths.lint = paths.source.concat(paths.test);

var plumberConf = {};

if (CI) {
    plumberConf.errorHandler = function(err) {
        throw err;
  };
}

gulp.task('lint', function() {
  return gulp.src(paths.lint)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('istanbul', function () {
  return gulp.src(paths.test, {read: false})
    .pipe(mocha({
      debugBrk: DEBUG,
      R: 'spec',
      istanbul: !DEBUG
    }));
});

gulp.task('coverage', function () {
  return gulp.src('./coverage/lcov.info')
    .pipe(coveralls());
});

gulp.task('test',    ['lint', 'istanbul']);
gulp.task('default', ['test']);
