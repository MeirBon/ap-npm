import Route from "./route";
import Filesystem from "../storage/filesystem";
import PackageProxy from "../util/package-proxy";
import { Request, Response } from "express";

export default class PackageGetJson extends Route {
  private storage: Filesystem;
  private proxy: PackageProxy;
  private readonly proxyEnabled: boolean;

  constructor(storage: Filesystem, proxy: PackageProxy, proxyEnabled: boolean) {
    super();
    this.storage = storage;
    this.proxy = proxy;
    this.proxyEnabled = proxyEnabled;
  }

  public async process(req: Request, res: Response): Promise<void> {
    try {
      const packageJson = await this.storage.getPackageJson({
        name: req.body._packageName,
        scope: req.body._scope
      });

      if (typeof packageJson === "object") {
        res.status(200).send(packageJson);
      } else {
        res.status(404).send({ message: "Package not found" });
      }
    } catch (err) {
      if (this.proxyEnabled) {
        await this.proxy.process(req, res);
      } else {
        res.status(404).send({ message: err });
      }
    }
  }
}
