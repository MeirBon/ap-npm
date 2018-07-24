import AuthProvider from "../../src/auth/auth-provider";

export default class CustomAuthProvider extends AuthProvider {
  async userAdd(username: string, password: string, email: string): Promise<string> {
    return "";
  }

  async userLogin(username: string, password: string, email?: string): Promise<string> {
    return "";
  }

  async userLogout(token: string): Promise<boolean> {
    return true;
  }

  async userRemove(username: string, password: string): Promise<boolean> {
    return true;
  }

  async verifyToken(token: string): Promise<string> {
    return "";
  }
}
