import * as semver from "semver";
import Filesystem from "../storage/filesystem";

export default class Validator {
  private storage: Filesystem;

  constructor(storage: Filesystem) {
    this.storage = storage;
  }

  public async isVersionHigher(
    request: IValidatorRequest,
    distTag: string
  ): Promise<boolean> {

    if (!request.version) {
      throw Error("No version given to check");
    }

    const pkgJson = await this.storage.getPackageJson(request);

    return semver.satisfies(
      request.version,
      ">" + pkgJson["dist-tags"][distTag]
    );
  }

  public async hasDistTag(
    request: IValidatorRequest,
    distTag: string
  ): Promise<boolean> {
    const pkgJson = await this.storage.getPackageJson(request);
    return !!pkgJson["dist-tags"][distTag];
  }
}

interface IValidatorRequest {
  name: string;
  scope?: string;
  version?: string;
}
