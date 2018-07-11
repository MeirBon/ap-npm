import * as https from "https";
import Route from "../routes/route";
import { Request, Response } from "express";

export default class PackageProxy extends Route {
  private proxyUrl: string;

  constructor(proxyUrl: string) {
    super();
    this.proxyUrl = proxyUrl;
  }

  public async process(req: Request, res: Response): Promise<void> {
    try {
      let pkgData = req.body;
      let urlPath;

      if (pkgData._scopedName) {
        urlPath = pkgData._scopedName;
      } else {
        urlPath = "/" + pkgData._packageName;
      }

      let url = this.proxyUrl + urlPath;
      https.get(url,
        function(response) {
          response.pipe(res);
        }
      );
    } catch (err) {
      res.status(500).send(err);
    }
  }
}