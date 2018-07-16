import * as fs from "async-file";
import { join } from "path";
import { IRequest } from "../index";

/**
 * @param {Object} request {name: ?, scope: ?}
 * @param {String} storageLocation storage location
 * @return {Object} package.json
 */
export default async (request: IRequest, storageLocation: string) => {
  const packageName = request.name;
  const packageScope = request.scope;

  const jsonPath = packageScope
    ? join(storageLocation, packageScope, packageName, "package.json")
    : join(storageLocation, packageName, "package.json");

  const exists = await fs.exists(jsonPath);
  if (exists) {
    return JSON.parse(await fs.readFile(jsonPath));
  } else {
    throw Error(`package.json of ${packageName} does not exist`);
  }
};
