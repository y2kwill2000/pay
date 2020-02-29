import gulp from 'gulp';
import cp from 'child_process';
import path from 'path';
import co from 'co';
import cofs from 'greasebox/cofs';
import exec from 'co-exec';
import * as config from './config';
import dedent from 'greasebox/dedent';


gulp.task('bundle', ['clean:bundle'], (cb) => {

  co(function * () {
    let configPath = path.resolve(__dirname, '../jspm_packages/config.js');
    if(yield cofs.exists(configPath)) {
      if(/^win/i.test(process.platform)) {
        console.log(yield exec('jspm unbundle'));
      } else {
        yield new Promise((resolve, reject) => {
          cp.spawn('jspm', ['unbundle'], {
            stdio: 'inherit'
          }).on('err', reject)
            .on('exit', () => {
              resolve();
            });
        });
      }
      //bundle
      let bundledModules = [];

      for(let bundle in config.bundles) {
        let exp = config.bundles[bundle].join(' + ');
        if(bundledModules.length > 0) {
          exp += ` - ${bundledModules.join(' - ')}`;
        }
        config.bundles[bundle].forEach((b) => {
          if(bundledModules.indexOf(b) === -1) {
            bundledModules.push(b);
          }
        });

        let fname = path.resolve(config.paths.bundle, `${bundle}.js`);
        if(/^win/i.test(process.platform)) {
          console.log(yield exec(`jspm bundle ${exp} ${fname} --inject`));
        } else {
          yield new Promise((resolve, reject) => {

            cp.spawn('jspm', ['bundle', exp, fname, '--inject'], {
              stdio: 'inherit'
            }).on('err', reject)
            .on('exit', ()=> {
              resolve();
            });
          });
        }
      }

    }
  }).then(cb)
    .catch(cb);
});

gulp.task('bundle:dist', ['clean:bundle'], (cb) => {

  co(function * () {
    let configPath = path.resolve(__dirname, '../jspm_packages/config.js');
    if(yield cofs.exists(configPath)) {
      if(/^win/i.test(process.platform)) {
        console.log(yield exec('jspm unbundle'));
      } else {
        yield new Promise((resolve, reject) => {
          cp.spawn('jspm', ['unbundle'], {
            stdio: 'inherit'
          }).on('err', reject)
            .on('exit', () => {
              resolve();
            });
        });
      }
      //bundle
      let bundledModules = [];
      let bundleCommands = [];

      for(let bundle in config.bundles) {
        let exp = config.bundles[bundle].join(' + ');
        if(bundledModules.length > 0) {
          exp += ` - ${bundledModules.join(' - ')}`;
        }
        config.bundles[bundle].forEach((b) => {
          if(bundledModules.indexOf(b) === -1) {
            bundledModules.push(b);
          }
        });

        let fname = path.relative(process.cwd(), path.resolve(config.paths.bundle, `${bundle}.js`));

        let cmd = `jspm bundle ${exp} ${fname} --minify --inject --skip-source-maps`;
        bundleCommands.push(cmd);
      }
      //generate bundle script
      if(!(yield cofs.exists(path.resolve(__dirname, '../scripts')))) {
        yield cofs.mkdir(path.resolve(__dirname, '../scripts'));
      }
      let bundleScript = dedent`#!/usr/bin/env bash
      ${bundleCommands.join('\n')}
      `;

      yield cofs.writeFile(path.resolve(__dirname, '../scripts/bundle.sh'), bundleScript);
      yield cofs.chmod(path.resolve(__dirname, '../scripts/bundle.sh'), '775');

    }
  }).then(cb)
    .catch(cb);
});
