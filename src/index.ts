import AuthProvider from "./auth/auth-provider";
import JsonProvider from "./auth/json-provider";
import Container from "./util/container";
import IStorageProvider, { IRequest } from "./storage/storage-provider";
import Init, { IConfig } from "./init";
import ServeCommand from "./commands/serve";

export default class ApNpmApplication {
  private readonly container: Container;
  private readonly authProvider: AuthProvider | JsonProvider;

  constructor(config: IConfig, auth?: AuthProvider) {
    this.container = Init(config);
    if (typeof auth !== "undefined") {
      this.authProvider = auth;
    } else {
      const map = new Map<string, any>(Object.entries(config));
      this.authProvider = new JsonProvider(map, this.container.get("fs"));
    }
  }

  public async listen(): Promise<void> {
    if (this.authProvider instanceof JsonProvider)
      await this.authProvider.storageInit();
    this.container.set("auth", this.authProvider);
    const commandServe: ServeCommand = this.container.get("command-serve");
    return commandServe.run();
  }
}

export { AuthProvider, IStorageProvider, IRequest };
