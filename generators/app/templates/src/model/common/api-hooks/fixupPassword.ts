import { common } from 'oda-gen-graphql';
import { passport } from 'oda-api-common';

const fixupPassword = (target) => async (root: any, args: {
  input: any;
}, context: any, info: any) => {
  if (args.input.password) {
    args.input.password = JSON.stringify(passport.hashPassword(args.input.password));
  }
  return target(root, args, context, info);
};

export class FixupPasswordHook extends common.types.GQLModule {
  protected _hooks = [
    {
      'RootMutation.createUser': fixupPassword,
      'RootMutation.updateUser': fixupPassword,
    },
  ];
}
