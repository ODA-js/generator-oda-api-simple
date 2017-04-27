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
