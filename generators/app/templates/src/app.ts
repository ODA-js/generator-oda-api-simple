import * as dotenv from 'dotenv';
dotenv.config({ silent: true });
// tslint:disable-next-line:no-unused-variable
import * as config from 'config';
import { runQuery } from 'graphql-server-core';

// tslint:disable-next-line:no-var-requires
let currentModule = require('../package.json');

import RegisterConnectors from './model/connectors';

import { SystemGraphQL } from './model/runQuery';

import { GraphQLSchema, execute, subscribe } from 'graphql';

import * as path from 'path';

import { Server, middleware } from 'oda-api-common';

import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { SystemSchema } from './model';
import * as compression from 'compression';
import { Factory } from 'fte.js';

// subscriptions
import { SubscriptionManager } from 'graphql-subscriptions';
import { pubsub } from './model/pubsub';
import { dbPool } from './model/dbPool';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { apolloUploadExpress } from 'apollo-upload-server';

const WS_PORT = config.get<number>('subscriptions.port');
const WS_HOST = config.get<number>('subscriptions.host');

async function createContext() {
  let db = await dbPool.get('system');
  let connectors = new RegisterConnectors({
    mongoose: db
  });
  return {
    connectors,
    systemConnectors: await SystemGraphQL.connectors(),
    systemGQL: SystemGraphQL.query,
    db,
    // user: passport.systemUser(),
    // owner: passport.systemUser(),
    dbPool,
    pubsub,
  };
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

export class SampleApiServer extends Server {
  public config() {
    super.config();

    let schema = prepareSchema();

    this.initLogger();

    // Проверить как работает...
    this.app.set('views', path.join(__dirname, '..', '..', 'views'));

    let index = new Factory({
      root: path.join(__dirname, '..', '..', 'views'),
      watch: true,
      preload: true,
      ext: 'nhtml',
    });

    this.app.set('view engine', 'nhtml');
    this.app.engine('nhtml', index.express());

    this.app.use(compression());

    const websocketServer = createServer((request, response) => {
      response.writeHead(404);
      response.end();
    });

    // Bind it to port and start listening
    websocketServer.listen(WS_PORT, () => console.log(
      `Websocket Server is now running on http://${WS_HOST}:${WS_PORT}`,
    ));

    const subscriptionsServer = new SubscriptionServer({
      execute,
      subscribe,
      schema,
      onConnect: async (connectionParams, webSocket) => {
        return await createContext();
      },
    },
      {
        server: websocketServer,
      },
    );

    const buildSchema = graphqlExpress(async (req, res) => {
      return {
        schema,
        context: await createContext(),
      };
    });

    this.app.use('/graphiql', graphiqlExpress({
      endpointURL: '/graphql',
      subscriptionsEndpoint: `ws://${WS_HOST}:${WS_PORT}/subscriptions`,
    }));

    this.app.use('/graphql', bodyParser.json(), buildSchema);

    this.errorHandling();

    this.initStatics();
  }
}

