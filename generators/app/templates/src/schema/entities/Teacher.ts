export default {
  name: 'Teacher',
  fields: {
    firstName: {
      identity: 'fullName',
    },
    middleName: {
      identity: 'fullName',
    },
    lastName: {
      identity: 'fullName',
    },
    subjects: {
      indexed: true,
      relation: {
        hasMany: 'Subject#teacher',
      },
    },
  },
};
