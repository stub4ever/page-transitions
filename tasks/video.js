/**
 * Build font assets
 */
const gulp = require('gulp');
const { reload } = require('browser-sync');
const path = require('path');

const config = require('./config');

gulp.task('video', () =>
  gulp
    .src(path.join(config.root.dev, config.video.dev, config.video.extensions))
    .pipe(gulp.dest(path.join(config.root.dist, config.video.dist)))
    .pipe(reload({ stream: true })));
