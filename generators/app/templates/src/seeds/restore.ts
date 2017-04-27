import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { filter } from 'graphql-anywhere';
import { dataPump } from 'oda-api-graphql';
import { join as joinPath } from 'path';
import { readFileSync } from 'fs-extra';
import gql from 'graphql-tag';
require('isomorphic-fetch');
const storedQ = require('./../../data/seed-queries.json');

import loaderConfig from './loaderConfig';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: loaderConfig.uri
  }),
});

let fn = process.argv[2] ? joinPath(process.cwd(), process.argv[2]) : joinPath(__dirname, '../../data/dump.json');

// tslint:disable-next-line:no-var-requires
let data = require(fn);
dataPump.restoreData(loaderConfig, storedQ, client, data).
  then(() => dataPump.relateData(loaderConfig, storedQ, client, data))
  .catch(e => console.error(e));

