import * as dotenv from 'dotenv';
dotenv.config({ silent: true });
import { filter } from 'graphql-anywhere';
import { dataPump } from 'oda-api-graphql';
import { join as joinPath } from 'path';
import { writeFileSync } from 'fs-extra';
import gql from 'graphql-tag';
require('isomorphic-fetch');
const storedQ = require('./../../data/seed-queries.json');

import { passport } from 'oda-api-common';

import loaderConfig from './loaderConfig';
import RegisterConnectors from '../model/connectors';
import { makeExecutableSchema } from 'graphql-tools';

import { SystemSchema } from '../model/schema';

import * as mongoose from 'mongoose';
import * as config from 'config';


let fn = process.argv[2] ? joinPath(process.cwd(), process.argv[2]) : joinPath(__dirname, '../../data/dump.json');

let db = mongoose.createConnection(config.get<string>('db.api.url'));

let connectors = new RegisterConnectors({
  mongoose: db,
});

let current = new SystemSchema({});
current.build();
let schema = makeExecutableSchema({
  typeDefs: current.typeDefs.toString(),
  resolvers: current.resolvers,
  resolverValidationOptions: {
    requireResolversForNonScalar: false,
  },
});

// tslint:disable-next-line:no-var-requires
let data = require(fn);
dataPump.restoreDataDirect(loaderConfig, storedQ, data, schema, {
  connectors,
  db: db,
}).
  then(() => dataPump.relateDataDirect(loaderConfig, storedQ, data, schema, {
    connectors,
    db: db,
  }))
  .then(() => {
    db.close();
  })
  .catch(e => {
    console.error(e);
    db.close();
  });

