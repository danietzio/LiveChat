import gulp from 'gulp';
import eslint from 'gulp-eslint';
import browserSync from 'browser-sync';
import webpack from 'webpack-stream';
import watchify from 'watchify';
import rename from 'gulp-rename';
import gutil from 'gulp-util';

watchify.args.debug = true;

const sync = browserSync.create('server1');
const sync2 = browserSync.create('server2');

// Input file.
watchify.args.debug = true;

// bundler function
function bundle() {
    return gulp.src('src/client/app.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(rename("bundle.js"))
        .on('error', gutil.log)
        .pipe(gulp.dest('public/client/assets/js'));
}

gulp.task('default', ['transpile']);

gulp.task('transpile', ['lint'], () => bundle());

gulp.task('lint', () => {
    return gulp.src(['src/client/**/*.js', 'gulpfile.babel.js'])
        .pipe(eslint())
        .pipe(eslint.format())
});

gulp.task('serve', ['transpile'], () => {
    delete process.env.BROWSER;

    sync.init({
        server: './public/client',
        port: process.env.PORT || 8000,
        host: process.env.IP || 'localhost'
    }, () => {
      sync2.init({
        baseDir : './public/agent',
        proxy : 'localhost:8080',
        port : process.env.SPORT || 9000
      });
    });

});

gulp.task('js-watch', ['transpile'], () => { sync.reload() });

gulp.task('watch', ['serve'], () => {

    gulp.watch('src/client/**/*', ['js-watch'])
    gulp.watch('public/client/assets/styles/style.css', sync.reload)
    gulp.watch('public/client/index.html', sync.reload)


});
