import AuthProvider from "./auth/auth-provider";
import JsonProvider from "./auth/json-provider";
import Container from "./util/container";
import Init, { IConfig } from "./init";

export default class ApNpmApplication {
  private container: Container;
  private authProvider: AuthProvider;
  private config: IConfig;

  constructor(config: IConfig, auth?: AuthProvider) {
    this.config = config;
    this.container = Init(config);
    if (typeof auth !== "undefined") {
      this.authProvider = auth;
    } else {
      const map = new Map();
      map.set("workDir", config.workDir);
      this.authProvider = new JsonProvider(map);
    }
  }

  public listen(): void {
    this.container.get("command-serve").run().then(() => 0);
  }
}

export {
  AuthProvider
};