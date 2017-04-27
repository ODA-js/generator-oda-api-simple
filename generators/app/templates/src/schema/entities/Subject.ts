export default {
  name: 'Subject',
  fields: {
    name: {
      identity: true,
    },
    groups: {
      indexed: true,
      relation: {
        belongsToMany: 'StudentsGroup#',
        using: 'StudentsGroupSubject#',
      },
    },
    teacher: {
      indexed: true,
      relation: {
        belongsTo: 'Teacher#',
        opposite: 'subjects',
      },
    },
  },
};
