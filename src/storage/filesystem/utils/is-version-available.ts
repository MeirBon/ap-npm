import { join } from "path";
import * as fs from "async-file";
  import { IRequest } from "../../storage-provider";

export default async (
  request: IRequest,
  storageLocation: string
): Promise<boolean> => {
  const packageName = request.name;
  const packageScope = request.scope;
  const packageVersion = request.version;

  const packageInfoLocation = packageScope
    ? join(storageLocation, packageScope, packageName, "package.json")
    : join(storageLocation, packageName, "package.json");

  try {
    const packageJson = JSON.parse(await fs.readFile(packageInfoLocation));
    let versionExists = false;

    for (const version in packageJson.versions) {
      if (version === packageVersion) {
        versionExists = true;
      }
    }

    const fileName = packageScope
      ? packageName.substr(packageScope.length + 1)
      : packageName;
    const fileLoc = packageScope
      ? join(
          storageLocation,
          packageScope,
          packageName,
          packageName + "-" + packageVersion + ".tgz"
        )
      : join(
          storageLocation,
          packageName,
          fileName + "-" + packageVersion + ".tgz"
        );

    return versionExists && (await fs.exists(fileLoc));
  } catch (err) {
    return false;
  }
};
