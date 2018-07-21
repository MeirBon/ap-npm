import { join } from "path";
import AuthProvider from "./auth-provider";

/**
 * Use interface to implement AuthManager
 * Using an interface makes it easier to test
 */
interface Auth {
  /**
   * return token for user
   * @param {string} username
   * @param {string} password
   * @param {string} email
   * @returns {Promise<string>}
   */
  userLogin(username: string, password: string, email: string): Promise<string>;

  /**
   * add user
   * @param {string} username
   * @param {string} password
   * @param {string} email
   * @returns {Promise<string>}
   */
  userAdd(username: string, password: string, email: string): Promise<string>;

  /**
   * remove user
   * @param {string} username
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  userRemove(username: string, password: string): Promise<boolean>;

  /**
   * invalidate token
   * @param {string} token
   * @returns {Promise<void>}
   */
  userLogout(token: string): Promise<void>;

  /**
   * returns whether given accessToken has access
   * @param {AccessType} accessType
   * @param {string} packageName
   * @param {string} accessToken
   * @returns {Promise<boolean>}
   */
  shouldBeAbleTo(
    accessType: AccessType,
    packageName: string,
    accessToken: string
  ): Promise<boolean>;

  /**
   * returns token for user if successful
   * differs from userLogin in that it does not require email
   * @param {string} username
   * @param {string} password
   * @returns {Promise<string>}
   */
  verifyLogin(username: string, password: string): Promise<string>;

  /**
   * returns string of username
   * @param {string} token
   * @returns {Promise<string>}
   */
  verifyToken(token: string): Promise<string>;
}

class AuthManager implements Auth {
  private readonly dbLocation: string;
  private settings: IAuthSettings;
  private adapter: AuthProvider;
  private readonly tokens: Map<string, any>;

  constructor(adapter: AuthProvider, config: Map<string, any>) {
    this.dbLocation = join(config.get("workDir"), "db");
    this.tokens = new Map<string, any>();
    this.settings = config.get("auth");
    this.adapter = adapter;
  }

  public async userLogin(
    username: string,
    password: string,
    email: string
  ): Promise<string> {
    try {
      return await this.adapter.userLogin(username, password, email);
    } catch (err) {}
    throw Error("Unauthorized");
  }

  public async userAdd(
    username: string,
    password: string,
    email: string
  ): Promise<string> {
    try {
      return await this.adapter.userAdd(username, password, email);
    } catch (err) {}
    throw Error("Unauthorized");
  }

  public async userRemove(
    username: string,
    password: string
  ): Promise<boolean> {
    if (this.settings.remove === false) {
      return false;
    }

    try {
      return await this.adapter.userRemove(username, password);
    } catch (err) {
      return false;
    }
  }

  public async userLogout(token: string): Promise<void> {
    await this.adapter.userLogout(token);
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
      try {
        return (
          typeof (await this.adapter.verifyToken(accessToken)) === "string"
        );
      } catch (err) {
        return false;
      }
    }

    if (
      accessType === AccessType.Publish &&
      usersSettings.canPublish === true
    ) {
      try {
        return (
          typeof (await this.adapter.verifyToken(accessToken)) === "string"
        );
      } catch (err) {
        return false;
      }
    }

    throw new Error("Unauthorized");
  }

  public async verifyLogin(
    username: string,
    password: string
  ): Promise<string> {
    try {
      return await this.adapter.userLogin(username, password);
    } catch (err) {}
    throw Error("Unauthorized");
  }

  public async verifyToken(token: string): Promise<string> {
    try {
      return await this.adapter.verifyToken(token);
    } catch (err) {}
    throw Error("Unauthorized");
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
