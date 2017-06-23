import * as config from 'config';
import { DbMongooseConnectionPool } from 'oda-api-common';
export const dbPool = new DbMongooseConnectionPool({ defaultUrl: config.get<string>('db.api.url') });