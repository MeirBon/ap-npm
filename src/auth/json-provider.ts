import { sha512 } from "js-sha512";
import { join } from "path";
import * as fs from "async-file";
import AuthProvider from "./auth-provider";
import { IAuthSettings } from "./index";

/*
 * This file serves as a way to implement an authentication server.
 * The current implementation serves as a simple example of local authentication.
 * ap-npm was created to be easily extensible (which alternatives weren't).
 * We promote implementing a proper authentication method.
 */
export default class JsonProvider extends AuthProvider {
  private readonly dbLocation: string;
  private settings: IAuthSettings;
  private users: Map<string, IUser>;
  private tokens: Map<string, string>;

  constructor(config: Map<string, any>) {
    super();
    this.dbLocation = join(config.get("workDir"), "db");
    this.settings = config.get("auth");
    this.users = new Map();
    this.tokens = new Map<string, string>();
    this.initUserDB();
    this.initTokenDB().then(() => 0);
  }

  public async userLogin(username: string, password: string): Promise<string | boolean> {
    const user = this.users.get(username);
    if (user && user.password === sha512(password)) {
      const token = await this.generateToken();
      this.tokens.set(token, username);
      await this.updateTokenDB();
      return token;
    }
    return false;
  }

  public async userAdd(username: string, password: string, email: string): Promise<string | boolean> {
    if (this.settings.register === true) {
      if (this.users.has(username)) {
        return false;
      }

      this.users.set(username, {
        username,
        password: sha512(password),
        email: email
      });

      this.updateUserDB();

      const token = await this.generateToken();
      this.tokens.set(token, username);
      await this.updateTokenDB();
      return token;
    }
    return false;
  }

  /*
   * Doesn't get used yet, npm doesn't implement it and neither have we (yet)
   */
  public async userRemove(username: string, password: string): Promise<boolean> {
    if (this.settings.remove === true) {
      const user = this.users.get(username);
      if (typeof(user) === "object" && user.password === sha512(password)) {
        this.users.delete(username);
        this.updateUserDB();
        return true;
      }
    }
    return false;
  }


  private async initUserDB() {
    const user_db_path = join(this.dbLocation, "user_db.json");

    try {
      const userDb = await fs.readFile(user_db_path, { encoding: "utf8" });

      const obj = JSON.parse(userDb);
      this.users = new Map();
      Object.keys(obj).forEach((key) => {
        this.users.set(key, obj[key]);
      });
    } catch (err) {
      await fs.writeFile(user_db_path, JSON.stringify({})).then(() => {
        this.users = new Map();
      });
    }
  }

  private async updateUserDB() {
    const user_db_path = join(this.dbLocation, "user_db.json");
    const object: any = {};
    this.users.forEach((user: IUser, key: string) => {
      object[key] = user;
    });

    await fs.writeFile(user_db_path, JSON.stringify(object, undefined, 2), { mode: "0777" });
  }

  private async updateTokenDB() {
    const tokenLocation = join(this.dbLocation, "user_tokens.json");
    await fs.writeFile(tokenLocation, JSON.stringify(this.tokens, undefined, 2), { mode: "0777" });
  }

  private async initTokenDB() {
    const user_token_path = join(this.dbLocation, "user_tokens.json");
    try {
      const object: any = JSON.parse(await fs.readFile(user_token_path));
      this.tokens = new Map();
      Object.keys(object).forEach((key) => {
        this.tokens.set(key, object[key]);
      });
    } catch (e) {
      this.tokens = new Map<string, any>();
    }
  }

  public async verifyToken(token: string): Promise<boolean> {
    if (this.tokens.has(token)) {
      const tkn = this.tokens.get(token);
      if (tkn) {
        return this.users.has(tkn);
      }
    }

    return false;
  }
}

interface IUser {
  username: string;
  password: string;
  email: string;
}