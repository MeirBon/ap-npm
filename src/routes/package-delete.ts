import * as semver from "semver";
import Route from "./route";
import Filesystem from "../storage/filesystem";
import Validator from "../util/validator";
import { Request, Response } from "express";
import { version } from "punycode";

export default class PackageDelete extends Route {
  private storage: Filesystem;
  private packageValidator: Validator;
  private config: Map<string, any>;
  private readonly remove: boolean;

  constructor(
    storage: Filesystem,
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

    const packageName = req.body._packageName;
    const packageScope = req.body._scope;
    let referer = req.headers.referer;
    let packageVersion;

    if (!referer) {
      res.status(400).send({ message: "No referer given" });
      return;
    }

    if (typeof referer === "object") {
      referer = referer[0];
    }

    if (referer.indexOf("@") > -1) {
      const spliced = referer.split("@");
      packageVersion = spliced[spliced.length - 1];
    } else {
      const spliced = referer.split(" ");
      packageVersion = spliced[0];
    }

    if (packageVersion === "unpublish") {
      const result = await this.storage.removePackage({
        name: packageName,
        scope: packageScope
      });

      if (result === true) {
        res.status(200).send({ ok: "Package deleted" });
      } else {
        res
          .status(500)
          .send({ message: "Cannot delete package from filesystem" });
      }
    } else if (semver.valid(packageVersion)) {
      const result = await this.storage.removePackageVersion({
        name: packageName,
        scope: packageScope,
        version: packageVersion
      });

      if (result === true) {
        res.status(200).send({ ok: `Package version: ${version} deleted` });
      } else {
        res
          .status(500)
          .send({ message: "Cannot delete package from filesystem" });
      }
    }
  }
}
