// tslint:disable:no-unused-variable
import { common } from 'oda-gen-graphql';
import { SystemPackage } from './../graphql-gen/system';
const { deepMerge } = common.lib;

import { CommonExtends } from './common';

export class SystemSchema extends common.types.GQLModule {
  protected _extend = [
    new SystemPackage({}),
    new CommonExtends({})
  ];

  public get typeDefs() {
    return `
      ${this.typeDef.join('\n  ')}

      type Viewer implements Node {
        id: ID!
        ${this.viewerEntry.join('\n  ')}
      }

      type RootQuery {
        ${this.queryEntry.join('\n  ')}
      }

      type RootMutation {
        ${this.mutationEntry.join('\n  ')}
      }

      type RootSubscription {
        login: User
      }

      schema {
        query: RootQuery
        mutation: RootMutation
        subscription: RootSubscription
      }
      `;
  }

  public build() {
    super.build();
    this._resolver = deepMerge(
      this.resolver,
      this.viewer,
      {
        RootQuery: this.query,
        RootMutation: this.mutation,
        RootSubscription: {
          login: user => {
            console.log('user');
            return user;
          }
        }
      },
    );
  }

  public get resolvers() {
    return this.applyHooks(this.resolver);
  }
}



