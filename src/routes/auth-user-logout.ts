import Route from "./route";
import Auth from "../auth";
import { Request, Response } from "express";

export default class AuthUserLogout extends Route {
  private auth: Auth;

  constructor(auth: Auth) {
    super();
    this.auth = auth;
  }

  public async process(req: Request, res: Response): Promise<void> {
    if (req.headers.authorization) {
      const token = req.headers.authorization.substr(7);
      await this.auth.userLogout(token);
    }

    res.status(200);
    res.send({ ok: "Logged out" });
  }
}