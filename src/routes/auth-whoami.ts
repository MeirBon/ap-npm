import Route from "./route";
import Auth from "../auth";
import { Request, Response } from "express";

export default class AuthWhoami extends Route {
  private auth: Auth;

  constructor(auth: Auth) {
    super();
    this.auth = auth;
  }

  public async process(req: Request, res: Response): Promise<void> {
    if (req.headers.authorization) {
      const token = req.headers.authorization.substr(7);

      try {
        const user = await this.auth.verifyToken(token);
        res.status(200).send({ username: user });
        return;
      } catch (err) {}
    }
    res.status(401).send("Invalid user");
  }
}
