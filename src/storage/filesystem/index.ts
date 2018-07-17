import * as path from "path";

import removePackage from "./utils/remove-package";
import removePackageVersion from "./utils/remove-package-version";
import getPackage from "./utils/get-package";
import getPackageJson from "./utils/get-package-json";
import isPackageAvailable from "./utils/is-package-available";
import isVersionAvailable from "./utils/is-version-available";
import updatePackageJson from "./utils/update-packagejson";
import writePackage from "./utils/write-package";
import writeNewPackage from "./utils/write-new-package";
import getPackageListing from "./utils/get-package-listing";
import Logger from "../../util/logger";

export default class Filesystem {
  private config: Map<string, any>;
  private readonly logger: Logger;
  private readonly storageLocation: string;

  constructor(config: Map<string, any>, logger: Logger) {
    this.config = config;
    this.logger = logger;

    this.storageLocation = path.join(
      this.config.get("workDir"),
      this.config.get("storage").directory
    );
  }

  public async removePackage(request: IRequest) {
    return removePackage(request, this.storageLocation);
  }

  public async removePackageVersion(request: IRequest) {
    return removePackageVersion(request, this.storageLocation);
  }

  public async writeNewPackage(request: IRequest, packageData: any) {
    return writeNewPackage(
      request,
      packageData,
      this.storageLocation,
      this.logger
    );
  }

  public async writePackage(request: IRequest, packageData: any) {
    return writePackage(
      request,
      packageData,
      this.storageLocation,
      this.logger
    );
  }

  public async getPackage(request: IRequest) {
    return getPackage(request, this.storageLocation);
  }

  public async getPackageJson(request: IRequest): Promise<any> {
    return getPackageJson(request, this.storageLocation);
  }

  public async isPackageAvailable(request: IRequest) {
    return isPackageAvailable(request, this.storageLocation);
  }

  public async isVersionAvailable(request: IRequest) {
    return isVersionAvailable(request, this.storageLocation);
  }

  public async updatePackageJson(request: IRequest, packageJson: any) {
    return updatePackageJson(request, packageJson, this.storageLocation);
  }

  public async getPackageListing() {
    return getPackageListing(this.storageLocation);
  }
}

export interface IRequest {
  name: string;
  scope?: string;
  version?: string;
  file?: string;
}
