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
export default class JsonProvider implements AuthProvider {
  private readonly dbLocation: string;
  private settings: IAuthSettings;
  private users: Map<string, IUser>;

  constructor(config: Map<string, any>) {
    this.dbLocation = join(config.get("workDir"), "db");
    this.settings = config.get("auth");
    this.users = new Map();
    this.initUserDB();
  }

  public async userLogin(username: string, password: string): Promise<boolean> {
    const user = this.users.get(username);
    if (user) {
      return user.password === sha512(password);
    }
    return false;
  }

  public async userAdd(username: string, password: string, email: string): Promise<boolean> {
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
      return true;
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


  // Just here for local auth
  private initUserDB() {
    const user_db_path = join(this.dbLocation, "user_db.json");
    fs.readFile(user_db_path, {
      encoding: "utf8"
    }).then(value => {
      const obj = JSON.parse(value);
      this.users = new Map();
      Object.keys(obj).forEach((key) => {
        this.users.set(key, obj[key]);
      });
    }).catch(err => {
      fs.writeFile(user_db_path, JSON.stringify({})).then(() => {
        this.users = new Map();
      });
    });
  }

  // Just here for local auth
  private updateUserDB() {
    let user_db_path = join(this.dbLocation, "user_db.json");
    let object: any = {};
    this.users.forEach((user: IUser, key: string) => {
      object[key] = user;
    });

    fs.writeFile(user_db_path, JSON.stringify(object, null, 2), { mode: "0777" }).then(() => {
      this.initUserDB();
    });
  }
}

interface IUser {
  username: string,
  password: string,
  email: string
}