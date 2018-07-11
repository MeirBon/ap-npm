import * as fs from "async-file";
import { join } from "path";
import AuthProvider from "./auth-provider";
import Logger from "../util/logger";

export default class Auth {
  private dbLocation: string;
  private settings: IAuthSettings;
  private adapter: AuthProvider;
  private tokens: Map<string, any>;

  constructor(adapter: AuthProvider, config: Map<string, any>, logger: Logger) {
    this.dbLocation = join(config.get("workDir"), "db");
    this.tokens = new Map<string, any>();
    this.settings = config.get("auth");
    this.adapter = adapter;

    try {
      this.storageInit();
    } catch (err) {
      logger.error("Failed to initialize auth-structure in " + this.dbLocation);
    }

    this.initTokenDB().then(() => {
      this.settings = config.get("auth");
      this.adapter = adapter;
    });
  }

  async storageInit(): Promise<boolean> {
    let userTokens = join(this.dbLocation, "user_tokens.json");
    const dbExists = await fs.exists(this.dbLocation);
    if (!dbExists) {
      await fs.mkdirp(this.dbLocation);
    }

    const userTokensExist = await fs.exists(userTokens);
    if (!userTokensExist) {
      await fs.writeFile(userTokens, JSON.stringify({}));
    }

    return true;
  }

  public async userLogin(username: string, password: string, email: string): Promise<boolean> {
    return this.adapter.userLogin(username, password, email);
  }

  public async userAdd(username: string, password: string, email: string): Promise<boolean> {
    return this.adapter.userAdd(username, password, email);
  }

  public async userRemove(username: string, password: string): Promise<boolean> {
    return this.adapter.userRemove(username, password);
  }

  public async userLogout(token: string): Promise<void> {
    let user_tokens_path = join(this.dbLocation, "user_tokens.json");
    let allTokens;

    try {
      const tokenString = await fs.readFile(user_tokens_path, { encoding: "utf8" });
      allTokens = JSON.parse(tokenString);
      delete allTokens[token];
    } catch (err) {
      allTokens = {};
    }

    await fs.writeFile(user_tokens_path, JSON.stringify(allTokens, null, 2), { mode: "0777" });
    await this.updateTokenDB();
  }

  public async shouldBeAbleTo(
    accessType: AccessType,
    packageName: string,
    accessToken: string
  ): Promise<boolean> {
    if (this.settings.public === true) {
      return true;
    }

    accessToken = accessToken.substr(7);
    const usersSettings = this.settings.users;
    if (accessType === AccessType.Access && usersSettings.canAccess === true) {
      await this.verifyToken(accessToken); // throws error
      return true;
    }

    if (accessType === AccessType.Publish && usersSettings.canPublish === true) {
      await this.verifyToken(accessToken);
      return true;
    }

    throw new Error("Unauthorized");
  }

  public async verifyLogin(username: string, password: string): Promise<boolean> {
    return this.adapter.userLogin(username, password);
  }

  public async verifyToken(token: string): Promise<string> {
    if (this.tokens.has(token)) {
      return this.tokens.get(token);
    }
    throw Error("Invalid token");
  }

  private async updateTokenDB(): Promise<void> {
    let tokenLocation = join(this.dbLocation, "user_tokens.json");
    await fs.writeFile(tokenLocation, JSON.stringify(this.tokens, null, 2), { mode: "0777" });
  }

  public async addTokenToDB(username: string, token: string) {
    let tokenLocation = join(this.dbLocation, "user_tokens.json");
    let tokens;

    const tokenLocExists = await fs.exists(tokenLocation);
    if (tokenLocExists) {
      tokens = JSON.parse(await fs.readFile(tokenLocation));
    } else {
      tokens = {};
    }

    tokens[token] = username;
    await fs.writeFile(tokenLocation, JSON.stringify(tokens, null, 2), { mode: "0777" });
    await this.initTokenDB();
  }

  private async initTokenDB() {
    let user_token_path = join(this.dbLocation, "user_tokens.json");
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

}

export enum AccessType {
  Access,
  Publish
}

export interface IAuthSettings {
  adapter: string,
  users: {
    canPublish: boolean,
    canAccess: boolean
  },
  register: boolean,
  public: boolean,
  remove: boolean
}