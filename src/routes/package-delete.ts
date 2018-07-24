import * as semver from "semver";
import Route from "./route";
import Filesystem from "../storage/filesystem";
import Validator from "../util/validator";
import { Request, Response } from "express";
import { version } from "punycode";
import { IncomingHttpHeaders } from "http";
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
      const auth = this.config.get("auth");
      if (auth) {
        this.remove = auth.remove;
      } else {
        this.remove = false;
      }
    } else {
      this.remove = false;
    }
  }

  public async process(req: Request, res: Response): Promise<void> {
    if (!this.remove) {
      res.status(403).send({ message: "Not allowed to delete packages" });
      return;
    }

    const packageName = req.params.package;
    const packageScope = req.params.scope;
    const headers: IncomingHttpHeaders = req.headers;

    if (!req.headers.referer) {
      res.status(400).send({ message: "No referer given" });
      return;
    }

    const referer: string = Array.isArray(headers.referer) ?
      String(headers.referer![0]) :
      String(headers.referer);

    const packageVersion: string = referer.indexOf("@") > -1 ?
      referer.split("@")[referer.split("@").length - 1] :
      referer.split(" ")[0];

    if (packageVersion === "unpublish") {
      const result = await this.storage.removePackage({
        name: packageName,
        scope: packageScope
      });

      if (result === true) {
        res.status(200).send({ ok: "Package deleted" });
        return;
      } else {
        res
          .status(500)
          .send({ message: "Cannot delete package from filesystem" });
        return;
      }
    } else if (semver.valid(packageVersion)) {
      const result = await this.storage.removePackageVersion({
        name: packageName,
        scope: packageScope,
        version: packageVersion
      });

      if (result === true) {
        res.status(200).send({ ok: `Package version: ${version} deleted` });
        return;
      } else {
        res
          .status(500)
          .send({ message: "Cannot delete package from filesystem" });
        return;
      }
    }
  }
}
