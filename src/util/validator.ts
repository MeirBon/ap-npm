import * as semver from "semver";
import Filesystem from "../storage/filesystem";

export default class Validator {
  private storage: Filesystem;

  constructor(storage: Filesystem) {
    this.storage = storage;
  }

  public async isVersionHigher(request: IValidatorRequest, distTag: string): Promise<boolean> {
    const packageName = request.name;
    const packageVersion = request.version;
    const packageScope = request.scope;

    if (!packageVersion) {
      throw Error("No version given to check");
    }

    const pkgJson = await this.storage.getPackageJson({
      name: packageName,
      scope: packageScope
    });

    return semver.satisfies(packageVersion, ">" + pkgJson["dist-tags"][distTag]);
  }

  public async hasDistTag(request: IValidatorRequest, distTag: string): Promise<boolean> {
    const packageName = request.name;
    const packageScope = request.scope;
    const pkgJson = await this.storage.getPackageJson({
      name: packageName,
      scope: packageScope
    });

    return !!pkgJson["dist-tags"][distTag];
  }
}

interface IValidatorRequest {
  name: string;
  scope?: string;
  version?: string;
}