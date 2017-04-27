import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { filter } from 'graphql-anywhere';
import { dataPump } from 'oda-api-graphql';
import { join as joinPath } from 'path';
import { writeFileSync } from 'fs-extra';
import gql from 'graphql-tag';
require('isomorphic-fetch');
const storedQ = require('./../../data/seed-queries.json');

import loaderConfig from './loaderConfig';

const networkInterface = (token) => createNetworkInterface({
  uri: loaderConfig.uri,
  opts: {
    cache: 'no-cache',
    headers: {
      Authorization: token ? 'Bearer ' + token : undefined,
    },
  },
});

const client = (token) => new ApolloClient({
  networkInterface: networkInterface(token),
});

let fn = process.argv[2] ? joinPath(process.cwd(), process.argv[2]) : joinPath(__dirname, '../../data/dump1.json');
let token = process.argv[3] ? process.argv[3] : undefined;

console.log(token);
dataPump.dumpData(loaderConfig, storedQ, client(token)).
  then((result) => {
    writeFileSync(fn, JSON.stringify(result));
  })
  .catch(e => console.error(e));

