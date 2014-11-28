var gulp = require('gulp');
var Path = require('path');
var less = require('gulp-less');

gulp.task('less', function () {
    gulp.src('./app/static/less/**/*.less')
        .pipe(less({
            paths: [ Path.join(__dirname, 'app/static/less', 'common') ]
        }))
        .pipe(gulp.dest('./app/static/css'));
});

var watcher = gulp.watch('./app/static/less/**/*.less', ['less']);

watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

gulp.task('default', ['less']);