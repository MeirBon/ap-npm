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
      const urlPath = pkgData._scope ?
        `/${pkgData._scope}/${pkgData._packageName}` :
        `/${pkgData._packageName}`;

      const url = this.proxyUrl + urlPath;
      https.get(url, function(response) {
        response.pipe(res);
      });
    } catch (err) {
      res.status(500).send(err);
    }
  }
}
