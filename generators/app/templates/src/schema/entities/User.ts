export default {
  name: 'User',
  fields: {
    userName: {
      identity: true,
    },
    password: {
      required: true,
    },
    enabled: {
      type: 'boolean',
    },
  },
};
