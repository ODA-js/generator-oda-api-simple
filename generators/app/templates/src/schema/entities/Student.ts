export default {
  name: 'Student',
  fields: {
    firstName: {
      identity: 'FN',
    },
    middleName: {
      identity: 'FN',
    },
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
