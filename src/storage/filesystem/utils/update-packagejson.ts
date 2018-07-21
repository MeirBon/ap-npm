import { join } from "path";
import { IRequest } from "../../storage-provider";
import IFS from "../fs-interface";

export default async (
  fs: IFS,
  request: IRequest,
  packageJson: object,
  storageLocation: string
): Promise<boolean> => {
  const packageName = request.name;
  const packageScope = request.scope;

  const packageInfoLocation = packageScope
    ? join(storageLocation, packageScope, packageName, "package.json")
    : join(storageLocation, packageName, "package.json");

  try {
    await fs.writeFile(packageInfoLocation, JSON.stringify(packageJson));
  } catch (err) {
    return false;
  }
  return true;
};
