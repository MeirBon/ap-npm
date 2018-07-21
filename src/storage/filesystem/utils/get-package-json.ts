import { join } from "path";
import { IRequest } from "../../storage-provider";
import IFS from "../fs-interface";

/**
 * @param fs
 * @param {Object} request {name: string, scope: string}
 * @param {String} storageLocation storage location
 * @return {Object} package.json
 */
export default async (fs: IFS, request: IRequest, storageLocation: string) => {
  const packageName = request.name;
  const packageScope = request.scope;

  const jsonPath = packageScope
    ? join(storageLocation, packageScope, packageName, "package.json")
    : join(storageLocation, packageName, "package.json");

  const exists = await fs.exists(jsonPath);
  if (exists) {
    return JSON.parse(await fs.readFile(jsonPath));
  } else {
    throw Error(
      `package.json of ${packageScope ? packageScope + "/" + packageName : packageName} does not exist`
    );
  }
};
