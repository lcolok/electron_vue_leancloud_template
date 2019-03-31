var gulp = require('gulp');
var del = require('del');

gulp.task('default', function () {
    // 将你的默认的任务代码放在这
});

gulp.task('docs', function (callback) {
    var docsPath = 'docs/';
    del([
        docsPath+'*',
    ], callback);
    return gulp.src('dist/**/*')
        .pipe(gulp.dest(docsPath))
});