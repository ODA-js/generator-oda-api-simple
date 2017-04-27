import * as  path from 'path';
import { generator } from 'oda-gen-graphql';
import schema from './schema';

generator({
  pack: schema,
  rootDir: path.join(__dirname, '../src', 'graphql-gen'),
  config: {
    graphql: false,
    ts: false,
    packages: true,
    schema: true,
  },
});
