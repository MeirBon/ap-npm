import Route from "./route";
import { Request, Response } from "express";

export default class AdminConfigRoute extends Route {
  private readonly config: Map<string, any>;

  constructor(config: Map<string, any>) {
    super();
    this.config = config;
  }

  public async process(req: Request, res: Response): Promise<void> {
    res.status(200).send(this.config);
  }
}