import { Token as AuthToken } from "../../auth/entities/token";
import RestObject from "./rest-object";
import User from "./user";

export default class Token extends RestObject {
  private readonly token: string;
  private tkn: AuthToken;
  private user: User;
  public entityIdentifier: string = "user";

  constructor(token: AuthToken) {
    super();
    this.tkn = token;
    this.token = token.token;
    this.user = new User(token.user);
  }

  public async toObject(): Promise<object> {
    return {
      id: this.tkn.id,
      token: this.token,
      user: await this.user.getId()
    };
  }
}
