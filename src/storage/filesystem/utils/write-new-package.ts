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
  let attachmentName = "~invalid";

  for (const key in packageData._attachments) {
    attachmentName = key;
  }

  if (attachmentName === "~invalid") {
    throw Error("Invalid attachment name");
  }

  const folderPath = packageScope
    ? join(storageLocation, packageScope, packageName)
    : join(storageLocation, packageName);
  const filePath = packageScope
    ? join(folderPath, attachmentName.substr(packageScope.length + 1))
    : join(folderPath, attachmentName);

  await fs.mkdirp(folderPath);

  const packageJsonPath = join(folderPath, "package.json");

  await fs.writeFile(
    filePath,
    Buffer.from(packageData._attachments[attachmentName].data, "base64"),
    { mode: "0777" }
  );
  const packageJson = packageData;
  delete packageJson._attachments;

  try {
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson));
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
