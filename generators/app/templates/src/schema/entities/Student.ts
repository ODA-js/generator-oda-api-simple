export default {
  name: 'Student',
  fields: {
    firstName: {
      identity: "fullName"
    },
    middleName: {
      identity: "fullName"
    },
    lastName: {
      identity: "fullName"
    },
    uin: {
      identity: true,
    },
    dateOfBirth: {
      type: 'Date',
    },
    profile: {
      relation: {
        hasOne: 'StudentProfile#student',
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
