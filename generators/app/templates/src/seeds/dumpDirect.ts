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

import { dbPool } from '../model/dbPool';
import { SystemGraphQL, UserGQL } from '../model/runQuery';
import { pubsub } from '../model/pubsub';

async function createContext({ schema }) {
  let db = await dbPool.get('system');
  let connectors = new RegisterConnectors({
    mongoose: db
  });
  const result = {
    connectors,
    systemConnectors: await SystemGraphQL.connectors(),
    systemGQL: SystemGraphQL.query,
    userGQL: undefined,
    db,
    // user: passport.systemUser(),
    // owner: passport.systemUser(),
    dbPool,
    pubsub,
  };

  const userGQL = new UserGQL({
    context: result,
    schema,
  });

  result.userGQL = userGQL.query.bind(userGQL);

  return result;
}

function prepareSchema() {
  let current = new SystemSchema({});
  current.build();
  return makeExecutableSchema({
    typeDefs: current.typeDefs.toString(),
    resolvers: current.resolvers,
    resolverValidationOptions: {
      requireResolversForNonScalar: false,
    },
  });
}

const schema = prepareSchema();

createContext({ schema }).then(context => {
  dataPump.dumpDataDirect(loaderConfig, storedQ, schema, context).
    then((result) => {
      writeFileSync(fn, JSON.stringify(result));
      context.db.close();
    })
    .catch(e => {
      console.error(e);
      context.db.close();
    });
});


