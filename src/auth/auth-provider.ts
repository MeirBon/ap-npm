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
  ): Promise<string>;

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
  ): Promise<string>;

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
   * Invalidates token
   * @param {string} token
   * @returns {Promise<boolean>}
   */
  public abstract async userLogout(token: string): Promise<boolean>;

  /**
   * Returns username for token
   * @param {Token} token
   * @returns {Promise<boolean>}
   */
  public abstract async verifyToken(token: string): Promise<string>;
}
