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
    followings: {
      description: 'relation with Followed To',
      relation: {
        belongsToMany: 'Student#',
        using: 'Followings#followings',
        opposite: 'followers',
      },
    },
    followers: {
      name: 'followers',
      description: 'relation with Followed By',
      relation: {
        belongsToMany: 'Student#',
        using: 'Followings#followers',
        opposite: 'followings',
      },
    },
  },
};
