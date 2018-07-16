import * as crypto from "crypto";

export default abstract class AuthProvider {
  /**
   * Retrieves token for user
   * @param {string} username
   * @param {string} password
   * @param {string} email
   * @returns {Promise<string>}
   */
  public abstract async userLogin(
    username: string,
    password: string,
    email?: string
  ): Promise<string | boolean>;

  /**
   * Adds user to db and returns a token as string
   * @param {string} username
   * @param {string} password
   * @param {string} email
   * @returns {Promise<string>}
   */
  public abstract async userAdd(
    username: string,
    password: string,
    email: string
  ): Promise<string | boolean>;

  /**
   * Removes user from db
   * @param {string} username
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  public abstract async userRemove(
    username: string,
    password: string
  ): Promise<boolean>;

  /**
   * Verifies whether token is a valid user
   * @param {Token} token
   * @returns {Promise<boolean>}
   */
  public abstract async verifyToken(token: string): Promise<boolean>;

  protected async generateToken(): Promise<string> {
    return crypto.randomBytes(64).toString("hex");
  }
}
