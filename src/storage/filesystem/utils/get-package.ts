import { join } from "path";
import * as fs from "async-file";
import { IRequest } from "../index";

export default async function(request: IRequest, storageLocation: string): Promise<Buffer> {
  let packageName = request.name;
  let packageScope = request.scope;
  let fileName = request.file;

  if (fileName) {

    const fileLocation = packageScope ? join(storageLocation, packageScope, packageName, fileName)
      : join(storageLocation, packageName, fileName);

    return fs.readFile(fileLocation);
  } else {
    throw Error("No filename given");
  }
}