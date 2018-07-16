import * as fs from "async-file";
import { join } from "path";
import * as semver from "semver";
import { IRequest } from "../index";
import getPackageJson from "./get-package-json";
import removePackage from "./remove-package";
import updatePackageJson from "./update-packagejson";

export default async (
  request: IRequest,
  storageLocation: string
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

  const pkgExists = await fs.exists(packageLocation);

  if (!pkgExists) {
    throw Error("Invalid request, aborting");
  }

  await fs.unlink(tarballLocation);

  const packageJson = await getPackageJson(request, storageLocation);
  if (packageJson.hasOwnProperty("versions") && packageVersion) {
    delete packageJson.versions[packageVersion];
  }

  // If this was the last version of the package, we can remove it completely
  if (packageJson.versions.size === 0) {
    await removePackage(request, storageLocation);
    return true;
  }

  if (packageJson["dist-tags"].latest === packageVersion) {
    // need to update dist-tags
    let highestVersion = "0.0.1";
    for (const key in packageJson.versions) {
      if (semver.satisfies(key, ">" + highestVersion)) {
        highestVersion = key;
      }
    }
    packageJson["dist-tags"].latest = highestVersion;
  }

  return await updatePackageJson(request, packageJson, storageLocation);
};
