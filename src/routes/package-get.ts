import Route from "./route";
import { Request, Response } from "express";
import IStorageProvider from "../storage/storage-provider";

export default class PackageGet extends Route {
  private storage: IStorageProvider;

  constructor(storage: IStorageProvider) {
    super();
    this.storage = storage;
  }

  public async process(req: Request, res: Response): Promise<void> {
    const packageName = req.params.package;
    const packageScope = req.params.scope;
    const fileName = req.params.filename;

    try {
      const data = await this.storage.getPackage({
        name: packageName,
        scope: packageScope,
        file: fileName
      });
      res.status(200).send(data);
    } catch (err) {
      res.status(404).send({ ok: false, message: err });
    }
  }
}
