import RestObject from "./rest-object";
import { Md5 } from "ts-md5";

class Package extends RestObject {
  entityIdentifier: string = "package";
  private name: string;
  private scope: string | undefined;
  private versions: string[];
  private packageJson: object;

  constructor(name: string, versions: string[], packageJson: object, scope?: string) {
    super();
    this.name = name;
    this.scope = scope;
    this.versions = versions;
    this.packageJson = packageJson;
  }

  public async getName(): Promise<string> {
    return this.name;
  }

  public async getScope(): Promise<string | undefined> {
    return this.scope;
  }

  public async toObject(): Promise<object> {
    return {
      id: Md5.hashStr(this.scope ? this.name + "/" + this.scope : this.name),
      name: this.name,
      scope: this.scope,
      versions: this.versions,
      packageJson: this.packageJson
    };
  }
}

export default Package;