var gulp = require('gulp');
var sass = require('gulp-sass');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var concat = require('gulp-concat');
var minifyInline = require('gulp-minify-inline');
var browserSync = require('browser-sync').create();
var del = require('del');

// Lint JavaScript
gulp.task('lint', function() {
    return gulp.src('dev/js/*.js')
               .pipe(eslint())
               .pipe(eslint.failAfterError())
               .pipe(browserSync.stream());
});

// Minify HTML and inline scripts and CSS
gulp.task('minifyhtml', function() {
  return gulp.src('dev/**/*.html')
             .pipe(htmlmin({
               removeComments: true,
               collapseWhitespace: true
             }))
             .pipe(minifyInline({jsSelector: 'script[type!="text/x-tmpl-mustache"]'}))
             .pipe(gulp.dest('dist'));
});

// Compile Sass
gulp.task('sass', function () {
  return gulp.src('dev/scss/*.scss')
             .pipe(sass({outputStyle: 'compressed'}))
             .pipe(gulp.dest('dist/css'));
});

// Compile Sass
gulp.task('sass-serve', function () {
  return gulp.src('dev/scss/*.scss')
             .pipe(sass.sync().on('error', sass.logError))
             .pipe(gulp.dest('dist/css'))
             .pipe(browserSync.stream());
});

// Minify JavaScript
gulp.task('minifyjs', function() {
  return gulp.src('dev/js/lib/*.js')
             .pipe(concat('app.js'))
             .pipe(uglify())
             .pipe(gulp.dest('dist/js/'));
});

// Concat js but don't minify for dev
gulp.task('js-serve', function() {
  return gulp.src('dev/js/lib/*.js')
             .pipe(concat('app.js'))
             .pipe(gulp.dest('dist/js/'));
});

// Just move HTML on change
gulp.task('html-serve', function() {
  return gulp.src('dev/**/*.html')
             .pipe(gulp.dest('dist/'));
});

// Move images with PNG or JPG extension
gulp.task('moveimages', function() {
  return gulp.src('dev/img/**/*.+(png|jpg)')
             .pipe(gulp.dest('dist/img/'));
});

gulp.task('clean', function(cb) {
  del(['dist/*']);
  cb();
});

// Do everything by default
gulp.task('default', ['serve']);

// Watch HTML, Sass, JavaScript files and update on change
// Since this is for dev, we don't minify the js for debugging
gulp.task('serve', function() {

  gulp.start('html-serve', 'js-serve', 'sass-serve', 'moveimages');

  browserSync.init({
      server: "./dist"
  });

  // Watch Sass files and update
  gulp.watch('dev/scss/*.scss', ['sass-serve']);

  // Watch js files and lint
  gulp.watch('dev/js/lib/*.js', ['lint', 'js-serve']);

  gulp.watch('dev/**/*.html', ['html-serve']).on('change', browserSync.reload);
});

// Prepare for actual dist, clean the directory, then build and minify
// everything.
gulp.task('build', ['clean'], function() {
  gulp.start('moveimages', 'minifyhtml', 'sass', 'minifyjs');
});
