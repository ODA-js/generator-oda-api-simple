export default {
  name: 'Student',
  fields: {
    firstName: {
      indexed: true,
    },
    middleName: {},
    lastName: {
      identity: true,
    },
    uin: {
      identity: true,
    },
    dateOfBirth: {
      type: 'Date',
    },
    profile: {
      indexed: true,
      relation: {
        hasOne: 'StudentProfile#',
      },
    },
    group: {
      indexed: true,
      relation: {
        belongsTo: 'StudentsGroup#',
        opposite: 'students',
      },
    },
  },
};
