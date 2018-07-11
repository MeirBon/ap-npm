import Route from "./route";
import Filesystem from "../storage/filesystem";
import { Request, Response } from "express";

export default class PackageAddDistTags extends Route {
  private storage: Filesystem;

  constructor(storage: Filesystem) {
    super();
    this.storage = storage;
  }

  public async process(req: Request, res: Response): Promise<void> {
    let packageName = req.body._packageName;
    let packageScope = req.body._scope;
    let distTag = req.body._disttag;
    let distTagVersion = req.body["npm-args"];

    try {
      const packageJson = await this.storage.getPackageJson({ name: packageName, scope: packageScope });

      if (typeof packageJson === "object") {
        if (typeof packageJson.versions[distTagVersion] !== "object") {
          res.send(404).send({ message: "Version does not exist" });
          return;
        }

        packageJson["dist-tags"][distTag] = distTagVersion;
        const result = await this.storage.updatePackageJson({ name: packageName, scope: packageScope }, packageJson);
        if (result) {
          res.status(200).send({ ok: "dist-tags added" });
        } else {
          res.status(404).send({ message: "Could not get dist-tags" });
        }
      }
    } catch (err) {
      res.status(404).send({ message: err });
    }
  }
}

