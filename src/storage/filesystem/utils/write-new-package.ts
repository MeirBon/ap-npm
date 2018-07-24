import { join } from "path";
import { IRequest } from "../../storage-provider";
import Logger from "../../../util/logger";
import IFS from "../fs-interface";
import { satisfies } from "semver";

export default async (
  fs: IFS,
  request: IRequest,
  packageData: any,
  storageLocation: string,
  logger: Logger
): Promise<boolean> => {
  const packageName = request.name;
  const packageScope = request.scope;

  let keys = Object.keys(packageData._attachments);
  if (keys.length === 0) {
    throw Error("Invalid attachment");
  }
  const attachmentName = keys[0];

  keys = Object.keys(packageData.versions);
  if (keys.length === 0) {
    throw Error("Invalid version");
  }
  const version = await getHighestVersion(keys);

  const folderPath = packageScope
    ? join(storageLocation, packageScope, packageName)
    : join(storageLocation, packageName);

  await fs.createDirectory(folderPath);
  const filePath = join(folderPath, packageName + "-" + version + ".tgz");
  const packageJsonPath = join(folderPath, "package.json");
  const packageJson = JSON.parse(JSON.stringify(packageData));
  delete packageJson._attachments;

  try {
    await Promise.all([
      fs.writeFile(
        filePath,
        Buffer.from(packageData._attachments[attachmentName].data, "base64"),
        { mode: "0777" }
      ),
      fs.writeFile(packageJsonPath, JSON.stringify(packageJson))
    ]);
  } catch (err) {
    logger.error("Error writing package: ", err);
    return false;
  }

  if (packageScope) {
    logger.info(`Published package: ${packageScope}/${packageName}`);
  } else {
    logger.info(`Published package: ${packageName}`);
  }
  return true;
};

async function getHighestVersion(keys: Array<string>) {
  let highest = keys[0];
  keys.forEach((v: string) => {
    if (satisfies(v, ">" + highest)) {
      highest = v;
    }
  });

  return highest;
}
