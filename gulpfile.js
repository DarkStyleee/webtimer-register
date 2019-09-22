var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemap = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var twig = require('gulp-twig');
var imagemin = require('gulp-imagemin');
var babel = require('gulp-babel');
var webpack = require('webpack-stream');

function css_style(done) {
    
    gulp.src('./src/scss/**/*')
        .pipe(sourcemap.init())
        .pipe(sass({
            errorLogToConsole: true,
            outputStyle: 'compressed'
        }))
        .pipe(autoprefixer({
            overrideBrowserslist:  ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemap.write('./'))
        .pipe(gulp.dest('./build/css/'))
        .pipe(browserSync.stream());

    done();
}

function sync(done) {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: 3000
    });
    done();
}

function browserReload(done) {
    browserSync.reload();
    done();
}

function twigPages() {
    return gulp.src(['./src/pages/**/*.twig', './src/pages/**/*.html'])
        .pipe(twig())
        .pipe(gulp.dest('./'));
}

function imageMinimaze(done) {  
    gulp.src('src/img/**/*.*')
      .pipe(imagemin())
      .pipe(gulp.dest('build/img'));

    done();
}

function buildScripts() {
    return gulp.src('src/scripts/index.js')
        .pipe(webpack({ output: { filename: 'bundle.js' } }))
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(gulp.dest('build/scripts'));
}

function copyScripts(done) {
    gulp.src('src/scripts/copy/*.js')
      .pipe(gulp.dest('build/scripts'));

    done();
}

function watchFiles() {
    gulp.watch("src/img/**/*.*", imageMinimaze);
    gulp.watch(['./src/pages/**/*.twig', './src/pages/**/*.html'], twigPages);
    gulp.watch("./src/mix/parts/*.scss", css_style);
    gulp.watch("./src/scss/**/*", css_style);
    gulp.watch("./src/**/*.html", browserReload);
    gulp.watch("./src/**/*.php", browserReload);
    gulp.watch("./src/**/*.js", browserReload);
    gulp.watch("./src/scripts/index.js", buildScripts);
    gulp.watch("./src/scripts/copy/*.*", copyScripts);
}


gulp.task('default', gulp.parallel(sync, watchFiles));