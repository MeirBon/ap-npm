import { sha512 } from "js-sha512";
import { join } from "path";
import AuthProvider from "./auth-provider";
import { IAuthSettings } from "./index";
import IFS from "../storage/filesystem/fs-interface";
import * as crypto from "crypto";

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
  private fs: IFS;

  constructor(config: Map<string, any>, fs: IFS) {
    super();
    this.dbLocation = join(config.get("workDir"), "db");
    this.settings = config.get("auth");
    this.fs = fs;
  }

  public async userLogin(username: string, password: string): Promise<string> {
    const user = this.users.get(username);
    if (user && user.password === sha512(password)) {
      const token = await JsonProvider.generateToken();
      this.tokens.set(token, username);
      await this.updateTokenDB();
      return token;
    }
    throw Error("Error");
  }

  public async userAdd(
    username: string,
    password: string,
    email: string
  ): Promise<string> {
    if (this.settings.register === true) {
      if (this.users.has(username)) {
        throw Error("Forbidden");
      }

      this.users.set(username, {
        username,
        password: sha512(password),
        email: email
      });

      await this.updateUserDB();

      const token = await JsonProvider.generateToken();
      this.tokens.set(token, username);
      await this.updateTokenDB();
      return token;
    }

    throw Error("Error");
  }

  /*
   * Doesn't get used yet, npm doesn't implement it and neither have we (yet)
   */
  public async userRemove(
    username: string,
    password: string
  ): Promise<boolean> {
    if (this.settings.remove === true) {
      const user = this.users.get(username);
      if (typeof user === "object" && user.password === sha512(password)) {
        this.users.delete(username);
        await this.updateUserDB();
        return true;
      }
    }
    return false;
  }

  public async userLogout(token: string): Promise<boolean> {
    if (this.tokens.has(token)) {
      this.tokens.delete(token);
    }
    await this.updateTokenDB();
    return true;
  }

  private async updateUserDB() {
    const user_db_path = join(this.dbLocation, "user_db.json");
    const object = await this.mapToObject(this.users);

    await this.fs.writeFile(user_db_path, JSON.stringify(object), {
      mode: "0777"
    });
  }

  private async updateTokenDB() {
    const tokenLocation = join(this.dbLocation, "user_tokens.json");
    await this.fs.writeFile(
      tokenLocation,
      JSON.stringify(await this.mapToObject(this.tokens)),
      { mode: "0777" }
    );
  }

  private async initTokenDB() {
    const user_token_path = join(this.dbLocation, "user_tokens.json");
    try {
      this.tokens = await this.objToMap(
        JSON.parse(await this.fs.readFile(user_token_path))
      );
    } catch (e) {
      this.tokens = new Map<string, any>();
    }
  }

  private async initUserDB() {
    const user_db_path = join(this.dbLocation, "user_db.json");
    try {
      const userDb = await this.fs.readFile(user_db_path);
      this.users = await this.objToMap(JSON.parse(userDb));
    } catch (err) {
      await this.fs.writeFile(user_db_path, JSON.stringify({}));
      this.users = new Map();
    }
  }

  public async verifyToken(token: string): Promise<string> {
    if (this.tokens.has(token)) {
      const tkn = this.tokens.get(token);
      if (typeof tkn === "string") {
        return tkn;
      }
    }

    throw new Error("Invalid token");
  }

  private async mapToObject(map: Map<string, any>): Promise<object> {
    const object: any = {};
    map.forEach((v: any, k: string) => {
      object[k] = v;
    });
    return object;
  }

  private async objToMap(obj: any): Promise<Map<string, any>> {
    const map = new Map();
    await Promise.all(
      Object.keys(obj).map(async (k: string) => {
        map.set(k, obj[k]);
      })
    );
    return map;
  }

  public async storageInit(): Promise<boolean> {
    const exists = await this.fs.exists(this.dbLocation);
    if (!exists) {
      try {
        await this.fs.createDirectory(this.dbLocation);
      } catch (err) {
        console.log(err);
        return false;
      }
    }
    await Promise.all([this.initUserDB(), this.initTokenDB()]);
    return true;
  }

  private static async generateToken(): Promise<string> {
    return crypto.randomBytes(64).toString("hex");
  }
}

interface IUser {
  username: string;
  password: string;
  email: string;
}
