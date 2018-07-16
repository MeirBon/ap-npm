import * as https from "https";
import Route from "../routes/route";
import { Request, Response } from "express";

export default class PackageProxy extends Route {
  private readonly proxyUrl: string;

  constructor(proxyUrl: string) {
    super();
    this.proxyUrl = proxyUrl;
  }

  public async process(req: Request, res: Response): Promise<void> {
    try {
      const pkgData = req.body;
      let urlPath;

      if (pkgData._scopedName) {
        urlPath = pkgData._scopedName;
      } else {
        urlPath = "/" + pkgData._packageName;
      }

      const url = this.proxyUrl + urlPath;
      https.get(url, function(response) {
        response.pipe(res);
      });
    } catch (err) {
      res.status(500).send(err);
    }
  }
}
