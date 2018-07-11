import Route from "./route";
import Filesystem from "../storage/filesystem";
import { Request, Response } from "express";

export default class PackageGetDistTags extends Route {
  private storage: Filesystem;

  constructor(storage: Filesystem) {
    super();
    this.storage = storage;
  }

  public async process(req: Request, res: Response): Promise<void> {
    let packageName = req.body._packageName;
    let packageScope = req.body._scope;

    try {
      const packageJson = await this.storage.getPackageJson({
        name: packageName,
        scope: packageScope
      });

      if (typeof packageJson === "object") {
        let distTags = packageJson["dist-tags"];
        if (distTags) {
          res.send(distTags);
        }
      } else {
        res.status(404).send({ message: "Could not get dist-tags" });
      }
    } catch (err) {
      res.status(404).send({ message: err });
    }
  }
}

