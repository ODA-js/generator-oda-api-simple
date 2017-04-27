// tslint:disable:no-unused-variable
import * as dotenv from 'dotenv';
dotenv.config({ silent: true });
import * as  path from 'path';
import { generator } from 'oda-gen-graphql';
// import * as schema from './../compiledModel.json';
import schema from './schema';

generator({
  pack: schema,
  rootDir: path.join(__dirname, '../src', 'graphql-gen'),
  config: {
    graphql: true,
    ts: true,
    packages: ['system'],
  },
});
