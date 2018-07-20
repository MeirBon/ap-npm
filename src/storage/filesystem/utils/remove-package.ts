import * as fs from "async-file";
import { join } from "path";
  import { IRequest } from "../../storage-provider";

export default async (
  request: IRequest,
  storageLocation: string
): Promise<boolean> => {
  const packageName = request.name;
  const packageScope = request.scope;

  const packageLocation = packageScope !== undefined
    ? join(storageLocation, packageScope, packageName)
    : join(storageLocation, packageName);

  if (!(await fs.exists(join(packageLocation, "package.json")))) {
    throw Error("Package does not exist");
  }

  await fs.rimraf(packageLocation);
  return true;
};
