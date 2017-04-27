export default {
  name: 'Teacher',
  fields: {
    firstName: {
      indexed: true,
    },
    middleName: {
      indexed: true,
    },
    lastName: {
      indexed: true,
    },
    subjects: {
      indexed: true,
      relation: {
        hasMany: 'Subject#',
      },
    },
  },
};
