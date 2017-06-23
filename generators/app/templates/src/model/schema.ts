// tslint:disable:no-unused-variable
import { common } from 'oda-gen-graphql';
import { SystemPackage } from './../graphql-gen/system';
import { pubsub } from './pubsub';
import { withFilter } from 'graphql-subscriptions';
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
        ${this.subscriptionEntry.join('\n  ')}
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
        RootSubscription: deepMerge(this.subscription, {
          login: {
            subscribe: () => pubsub.asyncIterator('login'),
          }
        }),
      },
    );
  }

  public get resolvers() {
    return this.applyHooks(this.resolver);
  }
}



