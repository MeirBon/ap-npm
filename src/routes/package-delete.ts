import * as semver from "semver";
import Route from "./route";
import Validator from "../util/validator";
import { Request, Response } from "express";
import IStorageProvider from "../storage/storage-provider";

export default class PackageDelete extends Route {
  private storage: IStorageProvider;
  private packageValidator: Validator;
  private config: Map<string, any>;
  private readonly remove: boolean;

  constructor(
    storage: IStorageProvider,
    validator: Validator,
    config: Map<string, any>
  ) {
    super();
    this.storage = storage;
    this.packageValidator = validator;
    this.config = config;
    if (this.config.has("auth")) {
      this.remove = this.config.get("auth").remove;
    } else {
      this.remove = false;
    }
  }

  public async process(req: Request, res: Response): Promise<void> {
    if (this.remove !== true) {
      res.status(403).send({ message: "Not allowed to delete packages" });
      return;
    }

    const packageName = req.params.package;
    const packageScope = req.params.scope;

    if (!req.headers.referer) {
      res.status(400).send({ message: "No referer given" });
      return;
    }

    let packageVersion: string | undefined = undefined;
    const referer: string = Array.isArray(req.headers.referer)
      ? String(req.headers.referer[0])
      : String(req.headers.referer);

    const slices: string[] = referer.split(" ");
    if (slices.length < 2) {
      res.status(400).send({ ok: false, message: "Invalid referer" });
      return;
    }

    const command: string = slices[0];

    if (command !== "unpublish") {
      res
        .status(400)
        .send({ ok: false, message: `Unknown command ${command}` });
      return;
    }

    if (slices[1].indexOf("@") > -1) {
      const pkgSlices = slices[1].split("@");
      packageVersion = pkgSlices[1];
    }

    if (packageVersion !== undefined && semver.valid(packageVersion)) {
      try {
        if (
          await this.storage.removePackageVersion({
            name: packageName,
            scope: packageScope,
            version: packageVersion
          })
        ) {
          res
            .status(200)
            .send({
              ok: true,
              message: `Package version: ${packageVersion} deleted`
            });
          return;
        }
      } catch (err) {}
    } else {
      try {
        if (
          await this.storage.removePackage({
            name: packageName,
            scope: packageScope
          })
        ) {
          res.status(200).send({ ok: true, message: "Package deleted" });
          return;
        }
      } catch (err) {}
    }

    res
      .status(500)
      .send({ ok: false, message: "Cannot delete package from filesystem" });
  }
}
