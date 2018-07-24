import * as path from "path";

import removePackage from "./utils/remove-package";
import removePackageVersion from "./utils/remove-package-version";
import getPackage from "./utils/get-package";
import getPackageJson from "./utils/get-package-json";
import isPackageAvailable from "./utils/is-package-available";
import updatePackageJson from "./utils/update-packagejson";
import writePackage from "./utils/write-package";
import writeNewPackage from "./utils/write-new-package";
import getPackageListing from "./utils/get-package-listing";
import Logger from "../../util/logger";
import IStorageProvider, { IRequest } from "../storage-provider";
import IFS from "./fs-interface";

export default class Filesystem implements IStorageProvider {
  private config: Map<string, any>;
  private readonly logger: Logger;
  private readonly storageLocation: string;
  private readonly fs: IFS;

  constructor(config: Map<string, any>, logger: Logger, fs: IFS) {
    this.config = config;
    this.logger = logger;
    this.fs = fs;

    this.storageLocation = path.join(
      this.config.get("workDir"),
      this.config.get("storage").directory
    );

    fs.exists(this.storageLocation)
      .then(result => {
        if (!result) {
          return fs.createDirectory(this.storageLocation);
        }
      })
      .catch(err => {
        logger.error(
          "Failed to initialize filesystem-structure in " + this.storageLocation,
          err
        );
      });
  }

  public async removePackage(request: IRequest): Promise<boolean> {
    return await removePackage(this.fs, request, this.storageLocation);
  }

  public async removePackageVersion(request: IRequest): Promise<boolean> {
    return await removePackageVersion(
      this.fs,
      request,
      this.storageLocation,
      this.getPackageJson,
      this.removePackage,
      this.updatePackageJson
    );
  }

  public async writeNewPackage(
    request: IRequest,
    packageData: any
  ): Promise<boolean> {
    return await writeNewPackage(
      this.fs,
      request,
      packageData,
      this.storageLocation,
      this.logger
    );
  }

  public async writePackage(
    request: IRequest,
    packageData: any
  ): Promise<boolean> {
    return await writePackage(
      this.fs,
      request,
      packageData,
      this.storageLocation,
      this.logger
    );
  }

  public async getPackage(request: IRequest): Promise<Buffer> {
    return await getPackage(this.fs, request, this.storageLocation);
  }

  public async getPackageJson(request: IRequest): Promise<any> {
    return await getPackageJson(this.fs, request, this.storageLocation);
  }

  public async isPackageAvailable(request: IRequest): Promise<boolean> {
    return await isPackageAvailable(this.fs, request, this.storageLocation);
  }

  public async updatePackageJson(
    request: IRequest,
    packageJson: any
  ): Promise<boolean> {
    return await updatePackageJson(
      this.fs,
      request,
      packageJson,
      this.storageLocation
    );
  }

  public async getPackageListing(): Promise<Map<string, any>> {
    return await getPackageListing(this.fs, this.storageLocation);
  }
}
