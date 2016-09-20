'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-spawn-mocha');
var coveralls = require('gulp-coveralls');
var uglify = require('gulp-uglify');
var coveralls = require('gulp-coveralls');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var glob = require('glob');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var babel = require('babelify');
var rename = require('gulp-rename');
var browserify = require('browserify');

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

gulp.task('test-browser', ['dist'], function () {
    return gulp.src('test/runner.html')
        .pipe(mochaPhantomJS({reporter: 'min'}));
});

gulp.task('dist-lib', function() {
    return browserify('./index.js', { standalone: 'tableMasterStream'})
        .transform(babel, {presets: ['es2015']})
        .bundle()
        .pipe(source('table-master-stream.js'))
        .pipe(gulp.dest('./dist/'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('dist-test', function (cb) {
  glob('./test/**/*.js', {}, function (err, files) {
    var b = browserify({standalone: 'spec'});
    files.forEach(function (file) {
        b.add(file);
    });
    b
        .transform(babel, {presets: ['es2015']})
        .bundle()
        .pipe(source('table-master-stream.spec.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/'))
        .on('end', function() { cb(); });
  });
});

gulp.task('dist',    ['dist-lib', 'dist-test']);
gulp.task('ci',      ['test', 'test-browser', 'dist']);
gulp.task('test',    ['lint', 'istanbul']);
gulp.task('default', ['test']);
