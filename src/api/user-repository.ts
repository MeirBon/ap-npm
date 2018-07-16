import { Connection, createConnection } from "typeorm";
import { ConnectionOptions } from "typeorm/connection/ConnectionOptions";
import { User as AuthUser } from "../auth/entities/user";
import { Token as AuthToken } from "../auth/entities/token";
import User from "./entities/user";
import Token from "./entities/token";

class UserRepository {
  private connection: Connection;

  constructor(config: ConnectionOptions) {
    createConnection({
      ...config,
      entities: [AuthUser, AuthToken]
    })
      .then(connection => {
        this.connection = connection;
      })
      .catch(err => console.log(err));
  }

  public async getUsers(): Promise<User[]> {
    const dbUsers = await this.connection.manager.find(AuthUser);
    const users: User[] = [];
    await Promise.all(
      dbUsers.map(async (user: AuthUser) => {
        users.push(new User(user));
      })
    );
    return users;
  }

  public async getUser(id: number): Promise<User> {
    const user = await this.connection.manager.findOne(AuthUser, id);
    if (user) {
      return new User(user);
    }
    throw Error(`Could not find user: ${id}`);
  }

  public async getUserByUsername(username: string): Promise<User> {
    const user = await this.connection.manager.findOne(AuthUser, {
      where: username
    });
    if (user) {
      return new User(user);
    }
    throw Error(`Could not find user: ${username}`);
  }

  public async getTokensOfUser(user: User): Promise<Token[]> {
    return user.getTokens();
  }
}

export default UserRepository;
