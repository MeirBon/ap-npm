import { join } from "path";
import * as fs from "async-file";
import { IRequest } from "../index";
import Logger from "../../../util/logger";

export default async (
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

  await fs.mkdirp(folderPath);

  let attachmentName: string = "~invalid";
  for (const key in packageData._attachments) {
    attachmentName = key;
  }

  let newVersion: string = "~invalid";
  for (const key in packageData.versions) {
    newVersion = key;
  }

  if (attachmentName === "~invalid" || newVersion === "~invalid") {
    throw Error("Invalid attachment-name or new-version");
  }

  const filePath = folderPath + "/" + packageName + "-" + newVersion + ".tgz";

  const packageJson = JSON.parse(await fs.readFile(packageInfoLocation));

  packageJson.versions[newVersion] = packageData.versions[newVersion];

  const distTags = packageJson["dist-tags"];
  const newDistTags = packageData["dist-tags"];

  for (const key in newDistTags) {
    distTags[key] = newDistTags[key];
  }

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
    logger.info(`Published new package: ${packageScope}/${packageName}`);
  } else {
    logger.info(`Published new package: ${packageName}`);
  }

  return true;
};
