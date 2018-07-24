import Route from "./route";
import Filesystem from "../storage/filesystem";
import PackageProxy from "./package-proxy";
import { Request, Response } from "express";
import IStorageProvider from "../storage/storage-provider";

export default class PackageGetJson extends Route {
  private storage: IStorageProvider;
  private proxy: PackageProxy;
  private readonly proxyEnabled: boolean;

  constructor(storage: IStorageProvider, proxy: PackageProxy, proxyEnabled: boolean) {
    super();
    this.storage = storage;
    this.proxy = proxy;
    this.proxyEnabled = proxyEnabled;
  }

  public async process(req: Request, res: Response): Promise<void> {
    try {
      const packageJson = await this.storage.getPackageJson({
        name: req.params.package,
        scope: req.params.scope
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
        res.status(500).send({ message: "Internal server error" });
      }
    }
  }
}
