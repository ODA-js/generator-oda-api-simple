import * as _ from 'lodash';
import pump from '../graphql-gen/system/dataPump';
debugger;
const result = _.merge(
  pump,
  {
    import: {
      queries: {
        Student: {
        }
      },
    },
  }
)

export default {
  uri: 'http://localhost:3003/graphql',
  ...result,
}
