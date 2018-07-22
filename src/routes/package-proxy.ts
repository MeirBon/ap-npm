import { AxiosInstance } from "@contentful/axios";
import Route from "./route";
import { Request, Response } from "express";

export default class PackageProxy extends Route {
  private readonly proxyUrl: string;
  private client: AxiosInstance;

  constructor(proxyUrl: string, client: AxiosInstance) {
    super();
    this.proxyUrl = proxyUrl;
    this.client = client;
  }

  public async process(req: Request, res: Response): Promise<void> {
    try {
      const scope = req.params.scope;
      const name = req.params.packageName;

      const urlPath = scope ? `${scope}/${name}` : `${name}`;
      const url = this.proxyUrl.endsWith("/")
        ? this.proxyUrl + urlPath
        : this.proxyUrl + "/" + urlPath;

      const response = await this.client.get(url);
      res.status(response.status).send(response.data);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}
