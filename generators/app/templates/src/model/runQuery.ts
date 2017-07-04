import * as dotenv from 'dotenv';
dotenv.config({ silent: true });
import * as config from 'config';
import RegisterConnectors from './connectors';
import { passport, DbMongooseConnectionPool } from 'oda-api-common';
import { makeExecutableSchema } from 'graphql-tools';
import { SystemSchema } from '../model/schema';
import { ExecutionResult } from 'graphql';
import { runQuery } from 'graphql-server-core';
import { dbPool } from './dbPool';

let schemas = () => new SystemSchema({});

export class UserGQL {
  private context: any;
  private schema: any;

  constructor({ context, schema }) {
    this.context = context;
    this.schema = schema;
  }

  public async query({
    query,
    variables,
  }: { query: string, variables: any }): Promise<ExecutionResult> {
    return await runQuery({
      query,
      variables,
      schema: this.schema,
      context: this.context,
    });
  }
}

export class SystemGraphQL {
  private static _schemas;
  private static _schema;
  private static schema = (() => {
    if (!SystemGraphQL._schemas) {
      SystemGraphQL._schemas = schemas();
    }
    if (!SystemGraphQL._schema) {
      SystemGraphQL._schemas.build();
      SystemGraphQL._schema = makeExecutableSchema({
        typeDefs: SystemGraphQL._schemas.typeDefs.toString(),
        resolvers: SystemGraphQL._schemas.resolvers,
        resolverValidationOptions: {
          requireResolversForNonScalar: false,
        },
      });
    }
    return SystemGraphQL._schema;
  });

  public static async connectors() {
    return new RegisterConnectors({
      mongoose: await dbPool.get('system'),
      user: passport.systemUser(),
      owner: passport.systemUser(),
    });
  }

  public static close() {
    // pool.release();
  }

  public static async query({
    query,
    variables,
    context,
    schema,
  }: { query: string, variables: any, context: any, schema: any }): Promise<ExecutionResult> {
    return await runQuery({
      query,
      variables,
      schema: schema || SystemGraphQL.schema(),
      context: context || await SystemGraphQL.context(),
    });
  }

  private static async context() {
    return {
      connectors: await SystemGraphQL.connectors(),
      db: await dbPool.get('system'),
      user: passport.systemUser(),
      owner: passport.systemUser(),
      systemConnectors: await SystemGraphQL.connectors(),
      systemGQL: SystemGraphQL.query,
    };
  };
}
