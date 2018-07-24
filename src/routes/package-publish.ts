import Route from "./route";
import Validator from "../util/validator";
import { Request, Response } from "express";
import IStorageProvider from "../storage/storage-provider";

export default class PackagePublish extends Route {
  private storage: IStorageProvider;
  private packageValidator: Validator;

  constructor(storage: IStorageProvider, validator: Validator) {
    super();
    this.storage = storage;
    this.packageValidator = validator;
  }

  public async process(req: Request, res: Response): Promise<void> {
    const packageData = req.body;
    const packageName = req.params.package;
    const packageScope = req.params.scope;

    if (!packageData._attachments) {
      const result = await this.storage.updatePackageJson(
        { name: packageName, scope: packageScope },
        packageData
      );
      if (result === true) {
        res.status(200).send({ ok: "package.json updated" });
        return;
      } else {
        res.status(500).send({ message: "Error, cannot update package.json" });
        return;
      }
    }

    const available = await this.storage.isPackageAvailable({
      name: packageName,
      scope: packageScope
    });

    if (available) {
      await this.writePackage(
        { name: packageName, scope: packageScope },
        req,
        res
      );
    } else {
      await this.writeNewPackage(
        { name: packageName, scope: packageScope },
        req,
        res
      );
    }
  }

  private async writePackage(
    pkg: INameScope,
    req: Request,
    res: Response
  ): Promise<void> {
    const keys = Object.keys(req.body["dist-tags"] ? req.body["dist-tags"] : {});
    if (keys.length === 0) {
      res
        .status(400)
        .send({ ok: false, message: "Invalid request, no dist-tag given" });
      return;
    }
    const distTag = keys[0];
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
        try {
          if (await this.storage.writePackage(pkg, packageData)) {
            res.status(201).send({ ok: true, message: "Package published" });
            return;
          }
        } catch (err) {}
        res.status(500).send({ ok: false, message: "Error while writing package" });
      }
    } else {
      res.status(400).send({
        message: "Cannot publish, given version already exists or is invalid"
      });
    }
  }

  private async writeNewPackage(
    pkg: INameScope,
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (await this.storage.writeNewPackage(pkg, req.body)) {
        res.status(201).send({ ok: true, message: "package published" });
        return;
      }
    } catch (err) {}
    res.status(500).send({ ok: false, message: "Error while writing package" });
  }
}

interface INameScope {
  name: string;
  scope: string;
}
