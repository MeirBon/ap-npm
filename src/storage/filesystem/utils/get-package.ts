import { join } from "path";
import { IRequest } from "../../storage-provider";
import IFS from "../fs-interface";

export default async function(
  fs: IFS,
  request: IRequest,
  storageLocation: string
): Promise<Buffer> {
  const packageName = request.name;
  const packageScope = request.scope;
  const fileName = request.file;

  if (fileName) {
    const fileLocation = packageScope
      ? join(storageLocation, packageScope, packageName, fileName)
      : join(storageLocation, packageName, fileName);

    return await fs.readFile(fileLocation);
  } else {
    throw Error("No filename given");
  }
}
