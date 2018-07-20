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
    const packageData = req.body;
    const packageName = req.params.package;
    const packageScope = req.params.scope;

    if (!packageData._attachments) {
      const result = await this.deprecateUpdater(packageData);
      if (result) {
        res.status(200).send({ ok: "package.json updated" });
      } else {
        res
          .status(500)
          .send({ message: "Error, cannot update package.json" });
      }
    }

    const available = await this.storage.isPackageAvailable({
      name: packageName,
      scope: packageScope
    });

    if (available) {
      await this.writePackage(
        { name: packageName, scope: packageScope },
        req, res
      );
    } else {
      await this.writeNewPackage(
        { name: packageName, scope: packageScope },
        req, res
      );
    }
  }

  private async deprecateUpdater(packageData: any): Promise<void> {
    await this.storage.updatePackageJson(
      { name: packageData._packageName, scope: packageData._scope },
      packageData
    );
  }

  private async writePackage(
    pkg: INameScope,
    req: Request, res: Response
  ): Promise<void> {
    let distTag = "~invalid";
    for (const key in req.body["dist-tags"]) {
      distTag = key;
    }

    if (distTag === "~invalid") {
      res.status(400).send({ message: "Invalid request, no dist-tag given" });
      return;
    }

    const packageData = req.body;

    const hasDistTag = await this.packageValidator.hasDistTag(pkg, distTag);

    if (hasDistTag === true) {
      const result = await this.packageValidator.isVersionHigher(
        {
          ...pkg,
          version: packageData["dist-tags"][distTag]
        },
        distTag
      );

      if (result === false) {
        res.status(400).send({
          message: "Cannot publish, given version already exists or is invalid"
        });
      } else {
        const result = await this.storage.writePackage(
          pkg,
          packageData
        );

        if (result === true) {
          res.status(201).send({ ok: "package published" });
        } else {
          res.status(500).send({ message: "Error while writing package" });
        }
      }
    } else {
      res.status(400).send({
        message: "Cannot publish, given version already exists or is invalid"
      });
    }
  }

  private async writeNewPackage(pkg: INameScope, req: Request, res: Response): Promise<void> {
    const result = await this.storage.writeNewPackage(
      pkg,
      req.body
    );

    if (result === true) {
      res.status(201).send({ ok: "package published" });
    } else {
      res.status(500).send({ message: "Error while writing package" });
    }
  }
}

interface INameScope {
  name: string;
  scope: string;
}