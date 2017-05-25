import * as dotenv from 'dotenv';
dotenv.config({ silent: true });
import * as config from 'config';
import RegisterConnectors from './connectors';
import { passport, DbMongooseConnectionPool } from 'oda-api-common';
import { makeExecutableSchema } from 'graphql-tools';
import { SystemSchema } from '../model/schema';
import { ExecutionResult } from 'graphql';
import { runQuery } from 'graphql-server-core';

let schemas = () => new SystemSchema({});

let pool = new DbMongooseConnectionPool({ defaultUrl: config.get<string>('db.api.url') });

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
      mongoose: await pool.get('system'),
      user: passport.systemUser(),
      owner: passport.systemUser(),
    });
  }

  public static close() {
    pool.release();
  }

  public static async query({
    query,
    variables
  }: { query: string, variables: any, schema?: string }): Promise<ExecutionResult> {
    return await runQuery({
      query,
      variables,
      schema: SystemGraphQL.schema(),
      context: await SystemGraphQL.context(),
    });
  }

  private static async context() {
    return {
      connectors: await SystemGraphQL.connectors(),
      db: await pool.get('system'),
      user: passport.systemUser(),
      owner: passport.systemUser(),
      systemConnectors: await SystemGraphQL.connectors(),
      systemGQL: SystemGraphQL.query,
    };
  };
}
