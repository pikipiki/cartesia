const gulp        = require('gulp'),
      browserSync = require('browser-sync').create(),
      sass        = require('gulp-sass'),
      rename      = require('gulp-rename'),
      concat      = require('gulp-concat'),
      uglify      = require('gulp-uglify'),
      sourcemaps  = require('gulp-sourcemaps'),
      babel       = require('gulp-babel'),

      root        = 'src/',
      paths       = {
        dist    : 
          './dist/',
        styles  : 
          `${root}/sass/**/*.scss`,
        jsFiles : 
          `${root}/js/**/*.js`,
        static  : [
          `${root}/img/**/*`,
          `${root}/index.html`,
          `${root}/fonts/**/*`
        ],
        modules : [
          'jquery/dist/jquery.min.js',
          'bootstrap-sass/assets/javascripts/bootstrap.min.js',
        ]
      }

gulp.task('serve', () => {
  browserSync.init({
    injectChanges: true,
    server: {
      baseDir: paths.dist
    }
  })
})

gulp.task('watch', ['minifySass', 'minifyJS', 'copyHtml'], () => {
  gulp.watch(paths.styles, ['minifySass'])
  gulp.watch(paths.jsFiles, ['minifyJS'])
  gulp.watch('src/*.html', ['copyHtml'])
  gulp.watch('src/*.html').on('change', browserSync.reload)
})

gulp.task('copyHtml', () => {
  return gulp.src(`${root}/index.html`)
    .pipe(gulp.dest(paths.dist))
})

gulp.task('minifySass', () => {
  return gulp.src(paths.styles)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist + 'css/'))
    .pipe(browserSync.stream())
})

gulp.task('minifyJS', () => {
  return gulp.src(paths.jsFiles)
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest(paths.dist + 'js/'))
    .pipe(rename('bundle.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist + 'js/'))
})

gulp.task('modules', () => {
  return gulp.src(paths.modules.map((path) => {return 'node_modules/' + path}))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(paths.dist + 'js/'))
    .pipe(rename('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist + 'js/'))
})

gulp.task('copyStatic', () => {
  return gulp.src(paths.static, {base: 'src'})
    .pipe(gulp.dest(paths.dist))
})

gulp.task('default', [
  'copyStatic',
  'minifyJS',
  'minifySass',
  'modules',
  'serve', 
  'watch'
])