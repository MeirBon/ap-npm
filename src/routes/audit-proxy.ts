import { AxiosInstance } from "@contentful/axios";
import Route from "./route";
import { Request, Response } from "express";

export default class AuditProxy extends Route {
  private readonly proxyUrl: string;
  private readonly enabled: boolean;
  private client: AxiosInstance;

  constructor(proxyUrl: string, client: AxiosInstance, enabled: boolean) {
    super();
    this.proxyUrl = proxyUrl;
    this.enabled = enabled;
    this.client = client;
  }

  public async process(req: Request, res: Response): Promise<void> {
    if (this.enabled) {
      try {
        const response = await this.client.post(
          this.proxyUrl.endsWith("/")
            ? this.proxyUrl + req.url
            : this.proxyUrl + "/" + req.url,
          req.body
        );

        res.status(200).send(response.data);
      } catch (err) {}
    }

    res.status(500).send({ ok: false });
  }
}
