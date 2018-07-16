import "reflect-metadata";
import { sha512 } from "js-sha512";
import AuthProvider from "./auth-provider";
import { Connection, createConnection } from "typeorm";
import User from "./entities/user";
import Token from "./entities/token";
import { ConnectionOptions } from "typeorm/connection/ConnectionOptions";

export default class TypeOrmProvider extends AuthProvider {
  private connection: Connection | undefined;
  private config: ConnectionOptions;

  constructor(config: ConnectionOptions) {
    super();
    this.config = config;
    this.connection = undefined;

    createConnection({
      ...config,
      entities: [User, Token]
    })
      .then(connection => {
        this.connection = connection;
      })
      .catch(err => console.log(err));
  }

  public async userAdd(
    username: string,
    password: string,
    email: string
  ): Promise<string | boolean> {
    const newUser = new User();
    newUser.username = username;
    newUser.password = sha512(password);
    newUser.email = email;
    if (this.connection) {
      try {
        const user = await this.connection.manager.save(newUser);

        const token = new Token();
        token.token = await this.generateToken();
        token.user = user;
        const tokenObject = await this.connection.manager.save(token);

        if (tokenObject) {
          return tokenObject.token;
        }
      } catch (err) {
        return false;
      }
    }

    return false;
  }

  public async userLogin(
    username: string,
    password: string,
    email?: string
  ): Promise<string | boolean> {
    try {
      if (this.connection) {
        const user = await this.connection.manager.findOne(User, { username });
        if (user) {
          const token = new Token();
          token.token = await this.generateToken();
          token.user = user;
          const tokenObject = await this.connection.manager.save(token);

          if (tokenObject) {
            return tokenObject.token;
          }
        }
      }
    } catch (err) {
      return false;
    }

    return false;
  }

  public async userRemove(
    username: string,
    password: string
  ): Promise<boolean> {
    if (this.connection) {
      const user = await this.connection.manager.findOne(User, {
        where: { username }
      });
      if (user) {
        if (user.password === sha512(password)) {
          await Promise.all(
            user.tokens.map(async token => {
              if (this.connection) {
                await this.connection.manager.remove(token);
              }
            })
          );

          await this.connection.manager.remove(user);
          return true;
        }
      } else {
        return false;
      }
    }

    return false;
  }

  public async verifyToken(token: string): Promise<boolean> {
    if (this.connection) {
      const tokenObject = await this.connection.manager.findOne(Token, {
        where: { token }
      });
      if (tokenObject instanceof Token) {
        return tokenObject.user instanceof User;
      }
    }

    return false;
  }
}
