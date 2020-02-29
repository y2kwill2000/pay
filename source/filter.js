import * as config from './config';
import RequireFilter from 'meepworks/require-filter';

let requireFilter = new RequireFilter({
  root: __dirname,
  baseURL: '/build',
  version: config.version
});

requireFilter.filter('.css!');
requireFilter.filter('.mp3!');
requireFilter.filter('.*!asset');
