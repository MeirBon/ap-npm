import Route from "./route";
import Filesystem from "../storage/filesystem";
import { Request, Response } from "express";
import IStorageProvider from "../storage/storage-provider";

export default class PackageDeleteDistTags extends Route {
  private storage: IStorageProvider;

  constructor(storage: IStorageProvider) {
    super();
    this.storage = storage;
  }

  public async process(req: Request, res: Response): Promise<void> {
    const packageName = req.params.package;
    const packageScope = req.params.scope;
    const distTag = req.params.tag;

    try {
      const packageJson = await this.storage.getPackageJson({
        name: packageName,
        scope: packageScope
      });

      if (typeof packageJson === "object") {
        delete packageJson["dist-tags"][distTag];

        const result = await this.storage.updatePackageJson(
          {
            name: packageName,
            scope: packageScope
          },
          packageJson
        );

        if (result === true) {
          res.status(200).send({
            ok: true,
            message: "dist-tags updated"
          });
        } else {
          res.status(404).send({ message: "Could not update dist-tags" });
        }
        return;
      }
    } catch (err) {}
    res.status(404).send({ message: "Could not get dist-tags" });
  }
}
