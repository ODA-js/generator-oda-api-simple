import { validate } from 'graphql/validation';
const storedQ = require('./../../data/seed-queries.json');
import { makeExecutableSchema } from 'graphql-tools';
import { SystemSchema } from '../model/schema';

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
debugger;
for (let ast in storedQ) {
  if (/fragments.graphql$/.test(ast)) {
    continue;
  }
  let errors = validate(schema, storedQ[ast]);
  if (errors.length > 0) {
    debugger;
    console.log(`->${ast}`);
    errors.map(e => e.message)
      .forEach(console.log);
  }
}