import * as fs from "async-file";
import { join } from "path";
import AuthProvider from "./auth-provider";
import Logger from "../util/logger";

/**
 * Use interface to implement AuthManager
 * Using an interface makes it easier to test
 */
interface Auth {
  storageInit(): Promise<boolean>;

  userLogin(username: string, password: string, email: string): Promise<string>;

  userAdd(username: string, password: string, email: string): Promise<string>;

  userRemove(username: string, password: string): Promise<boolean>;

  userLogout(token: string): Promise<void>;

  shouldBeAbleTo(
    accessType: AccessType,
    packageName: string,
    accessToken: string
  ): Promise<boolean>;

  verifyLogin(username: string, password: string): Promise<string>;

  verifyToken(token: string): Promise<string>;
}

class AuthManager implements Auth {
  private readonly dbLocation: string;
  private settings: IAuthSettings;
  private adapter: AuthProvider;
  private readonly tokens: Map<string, any>;

  constructor(adapter: AuthProvider, config: Map<string, any>, logger: Logger) {
    this.dbLocation = join(config.get("workDir"), "db");
    this.tokens = new Map<string, any>();
    this.settings = config.get("auth");
    this.adapter = adapter;

    try {
      this.storageInit().then(() => 0);
    } catch (err) {
      logger.error("Failed to initialize auth-structure in " + this.dbLocation);
    }

    this.settings = config.get("auth");
    this.adapter = adapter;
  }

  public async storageInit(): Promise<boolean> {
    const userTokens = join(this.dbLocation, "user_tokens.json");
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

  public async userLogin(
    username: string,
    password: string,
    email: string
  ): Promise<string> {
    const token = await this.adapter.userLogin(username, password, email);
    if (typeof token === "string") {
      return token;
    }
    throw Error("Unauthorized user");
  }

  public async userAdd(
    username: string,
    password: string,
    email: string
  ): Promise<string> {
    const token = await this.adapter.userAdd(username, password, email);
    if (typeof token === "string") {
      return token;
    }
    throw Error("Unauthorized user");
  }

  public async userRemove(
    username: string,
    password: string
  ): Promise<boolean> {
    return this.adapter.userRemove(username, password);
  }

  public async userLogout(token: string): Promise<void> {
    const user_tokens_path = join(this.dbLocation, "user_tokens.json");
    let allTokens;

    try {
      const tokenString = await fs.readFile(user_tokens_path, {
        encoding: "utf8"
      });
      allTokens = JSON.parse(tokenString);
      delete allTokens[token];
    } catch (err) {
      allTokens = {};
    }

    await fs.writeFile(
      user_tokens_path,
      JSON.stringify(allTokens, undefined, 2),
      { mode: "0777" }
    );
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
      return this.adapter.verifyToken(accessToken);
    }

    if (
      accessType === AccessType.Publish &&
      usersSettings.canPublish === true
    ) {
      return this.adapter.verifyToken(accessToken);
    }

    throw new Error("Unauthorized");
  }

  public async verifyLogin(
    username: string,
    password: string
  ): Promise<string> {
    const token = await this.adapter.userLogin(username, password);
    if (typeof token === "string") {
      return token;
    }
    throw Error("Unauthorized user");
  }

  public async verifyToken(token: string): Promise<string> {
    if (this.tokens.has(token)) {
      return this.tokens.get(token);
    }
    throw Error("Invalid token");
  }

  private async updateTokenDB(): Promise<void> {
    const tokenLocation = join(this.dbLocation, "user_tokens.json");
    await fs.writeFile(
      tokenLocation,
      JSON.stringify(this.tokens, undefined, 2),
      { mode: "0777" }
    );
  }
}

enum AccessType {
  Access,
  Publish
}

interface IAuthSettings {
  adapter: string;
  users: {
    canPublish: boolean;
    canAccess: boolean;
  };
  register: boolean;
  public: boolean;
  remove: boolean;
}

export default Auth;

export { Auth, AccessType, IAuthSettings, AuthManager };
