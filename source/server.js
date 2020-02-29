import koa from 'koa';
import router from 'koa-router';
import favicon from 'koa-favicon';
import mount from 'koa-mount';
import serve from 'koa-static-cache';
import gzip from 'koa-gzip';
import path from 'path';
import * as config from './config';

import debug from 'debug';

debug.enable('server-log');
const log = debug('server-log');

import './filter';

import AppDriver from 'meepworks/server-app-driver';


const server = koa();
const port = process.env.PORT || 13352;

server.use(gzip());

server.use(favicon());

server.use(mount('/build', serve(path.resolve(__dirname, '../build/'), {
  maxAge: 5*60*1000,
  dynamic: true
})));
//server.use(mount('/bundle', serve(path.resolve(__dirname, '../bundle/'), {
//  maxAge: 5*60*1000,
//  dynamic: true
//})));
server.use(mount('/jspm_packages', serve(path.resolve(__dirname, '../jspm_packages/'), {
  maxAge: 5*60*1000,
  dynamic: true
})));

server.use(function * (next) {
  let t = new Date();
  yield next;
  log(this.req.url, `${ (new Date().getTime() - t.getTime()) } ms`);
});

let clock = new AppDriver({
  appPath: 'app/app',
  jspm: {
    path: 'jspm_packages',
    config: 'jspm_packages/config.js'
  },
  dirname: __dirname,
  root: path.resolve(__dirname, '..'),
  buildPath: 'build',
  buildURL: 'build',
  version: config.version
});


server.use(mount('/', clock.router));

server.listen(port, () => {
  log(`listening to ${port}`);
});
