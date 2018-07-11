import * as fs from "async-file";
import { join } from "path";
import { IRequest } from "../index";

export default async (request: IRequest, storageLocation: string): Promise<boolean> => {
  let packageName = request.name;
  let packageScope = request.scope;

  const packageLocation = packageScope ? join(storageLocation, packageScope, packageName)
    : join(storageLocation, packageName);

  if (!await fs.exists(join(packageLocation, "package.json"))) {
    throw Error("Package does not exist");
  }

  await fs.rimraf(packageLocation);
  return true;
}