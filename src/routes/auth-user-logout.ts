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
    try {
      if (req.headers.authorization) {
        const token = req.headers.authorization.substr(7);
        await this.auth.userLogout(token);
      } else if (req.params.token) {
        await this.auth.userLogout(req.params.token);
      }
    } catch (err) {
      // don't do anything
      // always act as if token was valid
    }

    res.status(200);
    res.send({ ok: "Logged out" });
  }
}
