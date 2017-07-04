export default {
  name: 'StudentProfile',
  fields: {
    maths: {
      indexed: true,
      type: 'number',
    },
    physics: {
      indexed: true,
      type: 'number',
    },
    language: {
      indexed: true,
      type: 'number',
    },
    student: {
      indexed: true,
      relation: {
        belongsTo: 'Student#',
        opposite: 'profile',
      },
    },
  },
};
