/**
 * Initial interface for abstracting away filesystem requirement
 */
export default interface IStorageProvider {
  removePackage(request: IRequest): Promise<boolean>;

  removePackageVersion(request: IRequest): Promise<boolean>;

  writeNewPackage(request: IRequest, packageData: any): Promise<boolean>;

  writePackage(request: IRequest, packageData: any): Promise<boolean>;

  getPackage(request: IRequest): Promise<Buffer>;

  getPackageJson(request: IRequest): Promise<any>;

  isPackageAvailable(request: IRequest): Promise<boolean>;

  isVersionAvailable(request: IRequest): Promise<boolean>;

  updatePackageJson(request: IRequest, packageJson: any): Promise<boolean>;

  getPackageListing(): Promise<Map<string, any>>;
}

export interface IRequest {
  name: string;
  scope?: string;
  version?: string;
  file?: string;
}