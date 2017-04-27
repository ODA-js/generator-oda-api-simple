import * as dotenv from 'dotenv';
dotenv.config({ silent: true });
// tslint:disable-next-line:no-unused-variable
import * as config from 'config';
import { runQuery } from 'graphql-server-core';

// tslint:disable-next-line:no-var-requires
let currentModule = require('../package.json');

import RegisterConnectors from './model/connectors';

import { SystemGraphQL } from './model/runQuery';

import { GraphQLSchema } from 'graphql';

import * as path from 'path';

import { Server, middleware } from 'oda-api-common';

import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { SystemSchema } from './model';
import * as compression from 'compression';
import { Factory } from 'fte.js';

export class SampleApiServer extends Server {
  public config() {
    super.config();
    let current = new SystemSchema({});
    current.build();
    let schema = makeExecutableSchema({
      typeDefs: current.typeDefs.toString(),
      resolvers: current.resolvers,
      resolverValidationOptions: {
        requireResolversForNonScalar: false,
      },
    });

    this.initLogger();

    // Проверить как работает...
    this.app.set('views', path.join(__dirname, '..', '..', 'views'));

    let index = new Factory({
      root: path.join(__dirname, '..', '..', 'views'),
      watch: true,
      preload: true,
      ext: 'nhtml',
    });

    this.app.use(middleware.dbPool.createDbPool(config.get<string>('db.api.url')));

    this.app.set('view engine', 'nhtml');
    this.app.engine('nhtml', index.express());

    this.app.use(compression());

    const buildSchema = graphqlExpress(async (req, res) => {
      let db = await req['dbPool'].get('system');
      let connectors = new RegisterConnectors({ mongoose: db });
      return {
        schema,
        context: {
          connectors,
          systemConnectors: await SystemGraphQL.connectors(),
          systemGQL: SystemGraphQL.query,
          db,
        },
      };
    });

    this.app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
    this.app.use('/graphql', bodyParser.json(), buildSchema);

    this.errorHandling();

    this.initStatics();
  }
}

