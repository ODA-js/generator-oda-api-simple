export default {
  name: 'loginUser',
  desciption: 'make user login',
  args: [
    {
      name: 'userName',
      required: true,
    },
    {
      name: 'password',
      required: true,
    },
  ],
  payload: [
    {
      name: 'token',
    },
  ],
};
