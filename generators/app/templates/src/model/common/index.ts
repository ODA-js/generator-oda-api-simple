import { common } from 'oda-gen-graphql';
import { FixupPasswordHook } from './api-hooks/fixupPassword';
// import { UserTenantProfileTypeExtention } from './entities/UserTenatnProfile';
import { LoginUserMutation } from './mutations/login.resolver';

export class CommonExtends extends common.types.GQLModule {
  protected _extend = [
    new FixupPasswordHook({}),
    new LoginUserMutation({}),
  ];
}
