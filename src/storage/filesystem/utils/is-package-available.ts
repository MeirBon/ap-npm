import { join } from "path";
import { IRequest } from "../../storage-provider";
import IFS from "../fs-interface";

export default async (fs: IFS, request: IRequest, storageLocation: string) => {
  const packageName = request.name;
  const packageScope = request.scope;

  const packagePath = packageScope
    ? join(storageLocation, packageScope, packageName, "package.json")
    : join(storageLocation, packageName, "package.json");

  return fs.exists(packagePath);
};
