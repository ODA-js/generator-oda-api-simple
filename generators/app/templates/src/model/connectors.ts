import RegisterConnectors from '../graphql-gen/data/registerConnectors';

import User from '../graphql-gen/data/User/mongoose/connector';

export default class DataConnectors extends RegisterConnectors {
  public get Viewer(): User {
    if (!this._Viewer) {
      this._Viewer = new User({ mongoose: this.mongoose, connectors: this, user: this.user, owner: this.owner, acls: this.acls, userGroup: this.userGroup });
    }
    return this._Viewer;
  }
  protected _Viewer: User;
}
