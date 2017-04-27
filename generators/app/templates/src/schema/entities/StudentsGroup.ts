export default {
  name: 'StudentsGroup',
  fields: {
    name: {
      identity: true,
    },
    subjects: {
      indexed: true,
      relation: {
        belongsToMany: 'Subject#',
        using: 'StudentsGroupSubject#',
        opposite: 'groups',
      },
    },
    students: {
      indexed: true,
      relation: {
        hasMany: 'Student#',
      },
    },
  },
};
