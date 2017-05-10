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

// client Folder bundler function
function bundleClient() {
    return gulp.src('src/client/app.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(rename("bundle.js"))
        .on('error', gutil.log)
        .pipe(gulp.dest('public/client/assets/js'));
}

// Agent Folder bundler function
function bundleAgent() {
    return gulp.src('src/agent/app.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(rename("bundle.js"))
        .on('error', gutil.log)
        .pipe(gulp.dest('public/agent/assets/js'));
}

// Transpile functions
gulp.task('transpile', ['transpile-client', 'transpile-agent']);
gulp.task('transpile-client', ['lint'], () => bundleClient());
gulp.task('transpile-agent', ['lint'], () => bundleAgent());

gulp.task('lint', () => {
    return gulp.src(['src/**/**/*.js', 'gulpfile.babel.js'])
        .pipe(eslint())
        .pipe(eslint.format())
});

// Browser Sync
gulp.task('serve', ['transpile'], () => {
    delete process.env.BROWSER;

    sync.init({
        server: './public/client',
        port: process.env.PORT || 8000,
        host: process.env.IP || 'localhost'
    }, () => {
      sync2.init({
        proxy : 'localhost:8080',
        port : process.env.SPORT || 9000
      });
    });

});


// Wathing to any changes to any folder
// on client side or agent side
gulp.task('client-js-watch', ['transpile-client'], () => { sync.reload() });
gulp.task('agent-js-watch', ['transpile-agent'], () => { sync2.reload() });

gulp.task('watch', ['serve'], () => {

    // client side watching
    gulp.watch('src/client/**/*', ['client-js-watch'])
    gulp.watch('public/client/assets/styles/style.css', sync.reload)
    gulp.watch('public/client/index.html', sync.reload)

    // agent side watching
    gulp.watch('src/agent/**/*', ['agent-js-watch'])
    gulp.watch('public/agent/assets/styles/style.css', sync2.reload)
    gulp.watch('public/agent/index.html', sync2.reload)
});

gulp.task('default', ['transpile']);
