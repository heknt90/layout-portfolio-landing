'use strict'
var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    del = require('del'),
    rename = require('gulp-rename'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
	  minify = require('gulp-csso'),
    server = require('browser-sync').create(),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    svgstore = require('gulp-svgstore'),
    uglify = require('gulp-uglify-es').default,
    pump = require("pump");

gulp.task('style', function() {
  return gulp.src('src/scss/style.scss')
      .pipe(plumber())
      .pipe(sass())
      .pipe(postcss([
        require('css-mqpacker')({sort: true}),
        autoprefixer(
          ['last 2 versions', 'ie 11'],
          {grid: true}
        )
      ]))
      .pipe(gulp.dest('build/css'))
      .pipe(minify())
      .pipe(rename('style.min.css'))
      .pipe(gulp.dest('build/css'))
      .pipe(server.stream());
});

gulp.task('images', function () {
  return gulp.src('src/img/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagenin.svgo()
    ]))
    .pipe(gulp.dest('build/img'));
});

gulp.task('sprite', function () {
  return gulp.src('src/sprite/*.svg')
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
});

gulp.task('html', function () {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('build'))
    .pipe(server.stream());
});

gulp.task('js', function(cb) {
  pump([
        gulp.src('src/js/script.js'),
        gulp.dest('build/js'),
        uglify(),
        rename('script.min.js'),
        gulp.dest('build/js'),
        server.stream()
    ],
    cb
  );
});

gulp.task('clean', function () {
  return del('build')
})

gulp.task('copy', function () {
  return gulp.src([
    'src/fonts/**/*.{woff,woff2}',
    'src/img/**',
    'src/css/**',
    'src/*.html',
    'src/js/*.js'
  ], {
    base: 'src'
  })
  .pipe(gulp.dest('build'));
});

gulp.task('serve', gulp.series(function () {
  server.init({
    server: {
      baseDir: 'build/'
    },
    notify: false,
    host: 'localhost',
    port: 3000
  });
  gulp.watch('src/scss/**/*.scss', gulp.series('style'));
  gulp.watch('src/*.html', gulp.series('html'));
  gulp.watch('src/js/*.js', gulp.series('js'));
}));

gulp.task('build', gulp.series(
  'clean',
  'copy',
  gulp.parallel(
    'style',
    'sprite',
    'js'
  )
));