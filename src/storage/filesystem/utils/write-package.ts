import { join } from "path";
import { IRequest } from "../../storage-provider";
import Logger from "../../../util/logger";
import IFS from "../fs-interface";
import { valid } from "semver";

export default async (
  fs: IFS,
  request: IRequest,
  packageData: any,
  storageLocation: string,
  logger: Logger
): Promise<boolean> => {
  const packageName = request.name;
  const packageScope = request.scope;

  const packageInfoLocation = packageScope
    ? join(storageLocation, packageScope, packageName, "package.json")
    : join(storageLocation, packageName, "package.json");
  const folderPath = packageScope
    ? join(storageLocation, packageScope, packageName)
    : join(storageLocation, packageName);

  await fs.createDirectory(folderPath);

  let keys = Object.keys(packageData._attachments);
  if (keys.length === 0) {
    throw Error("Invalid attachment");
  }
  const attachmentName = keys[0];

  keys = Object.keys(packageData.versions);
  if (keys.length === 0) {
    throw Error("Invalid new-version");
  }
  const newVersion = keys[0];

  const filePath = join(folderPath, packageName + "-" + newVersion + ".tgz");

  let packageJson;
  try {
    const string = await fs.readFile(packageInfoLocation);
    packageJson = JSON.parse(string);
  } catch (err) {
    return false;
  }

  if (!valid(newVersion)) {
    throw Error("Invalid new version");
  }

  packageJson.versions[newVersion] = packageData.versions[newVersion];

  const distTags = packageJson["dist-tags"];
  const newDistTags = packageData["dist-tags"];

  await Promise.all(Object.keys(newDistTags)
    .map(async (k: string) => {
      distTags[k] = newDistTags[k];
    })
  );

  packageJson["dist-tags"] = distTags;

  try {
    await Promise.all([
      fs.writeFile(packageInfoLocation, JSON.stringify(packageJson)),
      fs.writeFile(
        filePath,
        Buffer.from(packageData._attachments[attachmentName].data, "base64"),
        { mode: "0777" }
      )
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
