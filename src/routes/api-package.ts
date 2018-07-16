import Route from "./route";
import { Request, Response } from "express";
import PackageRepository from "../api/package-repository";

export default class ApiPackage extends Route {
  private repository: PackageRepository;

  constructor(repository: PackageRepository) {
    super();
    this.repository = repository;
  }

  public async process(req: Request, res: Response): Promise<void> {
    if (req.params.package !== undefined) {
      try {
        let pkg;
        if (req.params.scope !== undefined) {
          pkg = await this.repository.getPackage(
            req.params.package,
            req.params.scope
          );
        } else {
          pkg = await this.repository.getPackage(
            req.params.package,
            req.params.scope
          );
        }

        res.status(200).send({
          package: await pkg.toObject()
        });
      } catch (err) {
        res.status(404).send({
          message: "Package not found"
        });
      }
    } else {
      const pkgs = await this.repository.getPackages();
      const pkgsObjs: Array<object> = [];

      await Promise.all(
        pkgs.map(async pkg => {
          pkgsObjs.push(await pkg.toObject());
        })
      );

      res.status(200).send({
        packages: pkgsObjs
      });
    }
  }
}
