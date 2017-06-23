export default {
  name: 'User',
  fields: {
    userName: {
      identity: true,
    },
    password: {
      required: true,
    },
    isAdmin: {
      type: 'boolean',
    },
    isSystem: {
      type: 'boolean',
    },
    enabled: {
      type: 'boolean',
    },
  },
};
