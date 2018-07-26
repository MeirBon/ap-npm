import Route from "./route";
import { Request, Response } from "express";
import IStorageProvider from "../storage/storage-provider";

export default class PackageGetDistTags extends Route {
  private storage: IStorageProvider;

  constructor(storage: IStorageProvider) {
    super();
    this.storage = storage;
  }

  public async process(req: Request, res: Response): Promise<void> {
    const packageName = req.params.package;
    const packageScope = req.params.scope;

    try {
      const packageJson = await this.storage.getPackageJson({
        name: packageName,
        scope: packageScope
      });

      if (typeof packageJson === "object") {
        const distTags = packageJson["dist-tags"];
        res.status(200).send(distTags !== undefined ? distTags : {});
        return;
      }
    } catch (err) {}

    res.status(404).send({ ok: false, message: "Could not find package" });
  }
}
