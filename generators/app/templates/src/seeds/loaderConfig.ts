export default {
  uri: 'http://localhost:3003/graphql',
  import: {
    queries: {
      User: {
        filter: `{
          enabled
          userName
          password
          isAdmin
          isSystem
          id
        }`,
        uploader: {
          findQuery: 'User/findByName.graphql',
          createQuery: 'User/create.graphql',
          updateQuery: 'User/update.graphql',
          dataPropName: 'user',
          findVars: (f) => ({ userName: f.userName }),
        },
      },
    },
    relations: {
    },
  },
  export: {
    queries: {
      User: {
        query: `User/export.graphql`,
        process: (f) => ({
          User: f.viewer.users ? f.viewer.users.edges.map(e => ({
            ...e.node,
            demografic: e.node.demografic ? e.node.demografic.edges.map(d => d.node) : [],
          })) : [],
        }),
      },
    },
  },
};
