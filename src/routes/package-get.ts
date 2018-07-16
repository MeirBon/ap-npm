import Route from "./route";
import Filesystem from "../storage/filesystem";
import { Request, Response } from "express";

export default class PackageGet extends Route {
  private storage: Filesystem;

  constructor(storage: Filesystem) {
    super();
    this.storage = storage;
  }

  public async process(req: Request, res: Response): Promise<void> {
    const packageName = req.body._packageName;
    const packageScope = req.body._scope;
    const fileName = req.body._requestedFile;

    try {
      const data = await this.storage.getPackage({
        name: packageName,
        scope: packageScope,
        file: fileName
      });
      res.status(200).send(data);
    } catch (err) {
      res.status(404).send({ message: err });
    }
  }
}
