import { User as AuthUser } from "../../auth/entities/user";
import { Token as AuthToken } from "../../auth/entities/token";

import RestObject from "./rest-object";
import Token from "./token";

export default class User extends RestObject {
  private user: AuthUser;
  public entityIdentifier: string = "user";

  constructor(user: AuthUser) {
    super();
    this.user = user;
  }

  public async getId(): Promise<string | number> {
    return this.user.id;
  }

  public async getUsername(): Promise<string> {
    return this.user.username;
  }

  public async getEmail(): Promise<string> {
    return this.user.email;
  }

  public async getTokens(): Promise<Token[]> {
    const tokens = [];
    for (let i = 0; i < this.user.tokens.length; i++) {
      tokens.push(new Token(this.user.tokens[i]));
    }
    return tokens;
  }

  public async toObject(): Promise<IUserObject> {
    return {
      id: await this.getId(),
      username: await this.getUsername(),
      email: await this.getEmail(),
      tokens: await Promise.all((await this.getTokens())
        .map(async (value) => {
          return value.getToken();
        })
      )
    };
  }
}

export interface IUserObject {
  id: string | number;
  username: string;
  email: string;
  tokens: string[];
}