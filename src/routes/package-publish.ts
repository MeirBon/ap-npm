import Route from "./route";
import Filesystem from "../storage/filesystem";
import Validator from "../util/validator";
import { Request, Response } from "express";

export default class PackagePublish extends Route {
  private storage: Filesystem;
  private packageValidator: Validator;

  constructor(storage: Filesystem, validator: Validator) {
    super();
    this.storage = storage;
    this.packageValidator = validator;
  }


  public async process(req: Request, res: Response): Promise<void> {
    let packageData = req.body;
    let packageName = packageData._packageName;
    let packageScope = packageData._scope;

    if (!packageData._attachments) {
      this.deprecateUpdater(packageData).then((result) => {
        if (result) {
          res.status(200).send({ ok: "package.json updated" });
        } else {
          res.status(500).send({ message: "Error, cannot update package.json" });
        }
      });
    }

    const available = await this.storage.isPackageAvailable({ name: packageName, scope: packageScope });
    if (available === true) {
      await this.writePackage(req, res);
    } else {
      await this.writeNewPackage(req, res);
    }
  }

  private async deprecateUpdater(packageData: any): Promise<void> {
    await this.storage.updatePackageJson({ name: packageData._packageName, scope: packageData._scope }, packageData);
  }

  private async writePackage(req: Request, res: Response): Promise<void> {
    let distTag = "~invalid";
    for (let key in req.body["dist-tags"]) {
      distTag = key;
    }

    if (distTag === "~invalid") {
      res.status(400).send({ message: "Invalid request, no dist-tag given" });
      return;
    }

    let packageName = req.body._packageName;
    let packageScope = req.body._scope;
    let packageData = req.body;

    const hasDistTag = await this.packageValidator.hasDistTag({
        name: packageName,
        scope: packageScope
      }, distTag
    );

    if (hasDistTag === true) {
      const result = await this.packageValidator.isVersionHigher({
        name: packageName,
        scope: packageScope,
        version: packageData["dist-tags"][distTag]
      }, distTag);

      if (result === false) {
        res.status(400).send({ message: "Cannot publish, given version already exists or is invalid" });
      } else {
        const result = await this.storage.writePackage({
          name: packageName,
          scope: packageScope
        }, packageData);

        if (result === true) {
          res.status(201).send({ ok: "package published" });
        } else {
          res.status(500).send({ message: "Error while writing package" });
        }
      }
    } else {
      res.status(400).send({ message: "Cannot publish, given version already exists or is invalid" });
    }
  }

  private async writeNewPackage(req: Request, res: Response): Promise<void> {
    let packageName = req.body._packageName;
    let packageScope = req.body._scope;
    const result = await this.storage.writeNewPackage({
      name: packageName,
      scope: packageScope
    }, req.body);

    if (result === true) {
      res.status(201).send({ ok: "package published" });
    } else {
      res.status(500).send({ message: "Error while writing package" });
    }
  }
}