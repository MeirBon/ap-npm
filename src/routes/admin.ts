import Route from "./route";
import { Request, Response } from "express";

export default class AdminRoute extends Route {
  public async process(req: Request, res: Response) {
    res.send({
      message: "You are successfully logged in"
    });
  }
}
