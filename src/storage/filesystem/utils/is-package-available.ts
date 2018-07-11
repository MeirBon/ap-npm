import { join } from "path";
import * as fs from "async-file";
import { IRequest } from "../index";

export default async (request: IRequest, storageLocation: string) => {
  try {
    const packageName = request.name;
    const packageScope = request.scope;

    const packagePath = packageScope ? join(storageLocation, packageScope, packageName, "package.json")
      : join(storageLocation, packageName, "package.json");

    return fs.exists(packagePath);

  } catch (err) {
    return false;
  }
};