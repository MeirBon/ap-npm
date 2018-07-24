import Route from "./route";
import { Request, Response } from "express";
import * as semver from "semver";
import IStorageProvider from "../storage/storage-provider";

export default class PackageAddDistTags extends Route {
  private storage: IStorageProvider;

  constructor(storage: IStorageProvider) {
    super();
    this.storage = storage;
  }

  public async process(req: Request, res: Response): Promise<void> {
    const packageName = req.params.package;
    const packageScope = req.params.scope;
    const distTag = req.params.tag;

    if (typeof req.body !== "string" || !semver.valid(req.body)) {
      res.status(400).send({ message: "Invalid version for dist tag given" });
      return;
    }

    const distTagVersion = req.body;

    try {
      const packageJson = await this.storage.getPackageJson({
        name: packageName,
        scope: packageScope
      });

      if (
        typeof packageJson === "object" &&
        typeof packageJson.versions[distTagVersion] === "object"
      ) {
        packageJson["dist-tags"][distTag] = distTagVersion;
        const result = await this.storage.updatePackageJson(
          { name: packageName, scope: packageScope },
          packageJson
        );
        if (result) {
          res.status(200).send({ ok: true, message: "dist-tags added" });
        } else {
          res
            .status(404)
            .send({ ok: true, message: "Could not get dist-tags" });
        }
        return;
      }
    } catch (err) {}

    res
      .status(404)
      .send({
        ok: false,
        message: "Could not find package or version of package"
      });
  }
}
