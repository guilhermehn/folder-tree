var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('default', function () {
  return gulp.src(['*.js', 'tests/*.js'])
    .pipe(plugins.jscs('.jscsrc'))
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function () {
  gulp.start('default');

  gulp.watch('index.js', ['default']);
});
