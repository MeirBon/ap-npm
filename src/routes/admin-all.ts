import Route from "./route";
import Filesystem from "../storage/filesystem";
import { Request } from "express";
import { Response } from "express-serve-static-core";

export default class AdminAllRoute extends Route {

  private storage: Filesystem;

  constructor(storage: Filesystem) {
    super();
    this.storage = storage;
  }

  public async process(req: Request, res: Response): Promise<void> {
    const listing = await this.storage.getPackageListing();
    res.status(200).send(listing);
  }

}