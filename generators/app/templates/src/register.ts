// tslint:disable-next-line:no-var-requires
let currentModule = require('../package.json');
import * as log4js from 'log4js';

import * as path from 'path';
import * as url from 'url';

export const name = currentModule.name;
export const version = currentModule.version;
export const description = currentModule.description;
import * as config from 'config';

const curHost = config.get('hosts')[name];

// const statics = path.join(__dirname, '..', config.util.getEnv('STATIC_ROOT') || './public');

export const logger = () => ({
  name,
  path: path.join(__dirname, '..', 'logs'),
  level: log4js.levels.WARN,
});

export const register = () => ({
  name,
  description,
  version,
  binding: {
    host: curHost.host,
    port: curHost.port,
  },
  urls: [
    { src: '/graphql', dst: '/graphql' },
    { src: '/graphiql', dst: '/graphiql' },
  ],
  // statics: [{
  //   path: statics,
  //   route: url.resolve(config.get<string>('statics'), name),
  // }],
});
