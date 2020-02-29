import gulp from 'gulp';
import * as gb from 'greasebox';


gulp.task('dist', ['build:dist:js', 'build:copy', 'bundle:dist'], () => {});
