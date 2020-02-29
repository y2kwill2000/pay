
export const api = {
  host: 'api.meepshop.dev',
  port: '8080',
  https: false
};

setUrl(api);

function setUrl(conf) {
  conf.url = `http${conf.https ? 's' : ''}://${conf.host}`;
  if(conf.port && conf.port != 80) {
    conf.url += `:${conf.port}`;
  }
  if(conf.path && conf.path !=='' && conf.path!=='/') {
    conf.url+=conf.path;
  }

}



export const version = '20150310-2';
