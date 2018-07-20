import AuthProvider from "./auth/auth-provider";
import JsonProvider from "./auth/json-provider";
import Container from "./util/container";
import IStorageProvider, { IRequest } from "./storage/storage-provider";
import Init, { IConfig } from "./init";

export default class ApNpmApplication {
  private readonly container: Container;
  private readonly authProvider: AuthProvider;
  private readonly config: IConfig;

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
    this.container.set("auth", this.authProvider);
    this.container
      .get("command-serve")
      .run()
      .then(() => 0);
  }
}

export {
  AuthProvider,
  IStorageProvider,
  IRequest
};
