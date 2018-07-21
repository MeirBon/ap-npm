import { join } from "path";
import * as semver from "semver";
import { IRequest } from "../../storage-provider";
import IFS from "../fs-interface";

export default async (
  fs: IFS,
  request: IRequest,
  storageLocation: string,
  getPackageJson: any,
  removePackage: any,
  updatePackageJson: any
): Promise<boolean> => {
  const packageName = request.name;
  const packageScope = request.scope;
  const packageVersion = request.version;

  const packageLocation = packageScope
    ? join(storageLocation, packageScope, packageName)
    : join(storageLocation, packageName);

  const tarballLocation = join(
    packageLocation,
    packageName + packageVersion + ".tgz"
  );

  const pkgExists = await fs.exists(tarballLocation);

  if (!pkgExists) {
    throw Error("Version does not exist");
  }

  await fs.unlink(tarballLocation);

  const packageJson = await getPackageJson(request);
  if (packageVersion) {
    delete packageJson.versions[packageVersion];
  }

  if (Object.keys(packageJson.versions).length === 0) {
    await removePackage(request);
    return true;
  }

  if (packageJson["dist-tags"].latest === packageVersion) {
    let highestVersion: any = undefined;
    Object.keys(packageJson.versions).forEach((key) => {
      if (highestVersion === undefined) {
        highestVersion = key;
      } else {
        if (semver.satisfies(key, ">" + highestVersion)) {
          highestVersion = key;
        }
      }
    });
    packageJson["dist-tags"].latest = highestVersion;
  }

  return await updatePackageJson(request, packageJson);
};
