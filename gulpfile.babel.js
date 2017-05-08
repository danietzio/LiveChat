import gulp from 'gulp';
import eslint from 'gulp-eslint';
import browserSync from 'browser-sync';
import webpack from 'webpack-stream';
import watchify from 'watchify';
import rename from 'gulp-rename';
import gutil from 'gulp-util';

watchify.args.debug = true;

const sync = browserSync.create();

// Input file.
watchify.args.debug = true;

// bundler function
function bundle() {
    return gulp.src('src/app.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(rename("bundle.js"))
        .on('error', gutil.log)
        .pipe(gulp.dest('public/assets/js'));
}

gulp.task('default', ['transpile']);

gulp.task('transpile', ['lint'], () => bundle());

gulp.task('lint', () => {
    return gulp.src(['src/**/*.js', 'gulpfile.babel.js'])
        .pipe(eslint())
        .pipe(eslint.format())
});

gulp.task('serve', ['transpile'], () => {
    delete process.env.BROWSER;

    sync.init({
        server: 'public',
        port: process.env.PORT || 8000,
        host: process.env.IP || 'localhost'
    });
});

gulp.task('js-watch', ['transpile'], () => sync.reload());

gulp.task('watch', ['serve'], () => {
    gulp.watch('src/**/*', ['js-watch'])
    gulp.watch('public/assets/styles/style.css', sync.reload)
    gulp.watch('public/index.html', sync.reload)
});
