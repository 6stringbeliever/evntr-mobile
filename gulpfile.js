/*
Getting started:
Create your package.json:
npm init
Install gulp locally:
npm install --save-dev gulp
Install all the packages below:
npm install --save-dev gulp-sass gulp-eslint gulp-uglify gulp-minify-html gulp-minify-inline del browser-sync
*/

var gulp = require('gulp');
var sass = require('gulp-sass');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
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
             .pipe(minifyHTML())
             .pipe(minifyInline())
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
             .pipe(gulp.dest('dev/css'))
             .pipe(browserSync.stream());
});

// Minify JavaScript
gulp.task('minifyjs', function() {
  return gulp.src('dev/js/*.js')
             .pipe(uglify())
             .pipe(gulp.dest('dist/js/'));
});

// Move images with PNG or JPG extension
gulp.task('moveimages', function() {
  return gulp.src('dev/img/**/*.+(png|jpg)')
             .pipe(gulp.dest('dist/img/'));
});

// Move lib css files; don't need to do this every time
gulp.task('movelibcss', function() {
  return gulp.src('dev/css/lib/*.css')
             .pipe(gulp.dest('dist/css/lib/'));
});

// Move lib js files; don't need to do this every time
gulp.task('movelibjs', function() {
  return gulp.src('dev/js/lib/*.js')
  .pipe(gulp.dest('dist/js/lib/'));
});

// Move js files because we don't want to minify when developing
gulp.task('movejs', function() {
  return gulp.src('dev/js/*.js')
  .pipe(gulp.dest('dist/js//'));
});

gulp.task('clean', function(cb) {
  del(['dist/*'], cb);
});

// Move all lib files
gulp.task('movelib', ['movelibcss', 'movelibjs']);

// Do everything by default
gulp.task('default', ['lint', 'sass', 'minifyhtml', 'minifyjs', 'moveimages']);

// Watch HTML, Sass, JavaScript files and update on change
// Since this is for dev, we don't minify the js for debugging
gulp.task('serve', function() {

    browserSync.init({
        server: "./dev"
    });

  // Watch Sass files and update
  gulp.watch('dev/scss/*.scss', ['sass-serve']);

  // Watch js files and lint
  gulp.watch('dev/js/*.js', ['lint']);

  gulp.watch("dev/**/*.html").on('change', browserSync.reload);
});

// Prepare for actual dist, clean the directory, then build and minify
// everything.
gulp.task('build', ['clean'], function() {
  gulp.start('moveimages', 'movelibcss', 'movelibjs', 'minifyhtml',
              'sass', 'minifyjs');
});
