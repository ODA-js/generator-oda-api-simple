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


let fn = process.argv[2] ? joinPath(process.cwd(), process.argv[2]) : joinPath(__dirname, '../../data/dump1.json');

let db = mongoose.createConnection(config.get<string>('db.api.url'));

let connectors = new RegisterConnectors({
  mongoose: db,
  user: passport.systemUser(),
  owner: passport.systemUser(),
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

dataPump.dumpDataDirect(loaderConfig, storedQ, schema, {
  connectors,
  db: db,
  user: passport.systemUser(),
  owner: passport.systemUser(),
}).
  then((result) => {
    writeFileSync(fn, JSON.stringify(result));
    db.close();
  })
  .catch(e => {
    console.error(e);
    db.close();
  });


