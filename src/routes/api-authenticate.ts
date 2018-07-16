import Route from "./route";
import { Request, Response } from "express";
import Auth from "../auth";

export default class ApiAuthenticate extends Route {
  private auth: Auth;

  constructor(auth: Auth) {
    super();
    this.auth = auth;
  }

  public async process(req: Request, res: Response): Promise<void> {
    if (!req.body.username || !req.body.password || !req.body.email) {
      res.status(400).send({ message: "Invalid request" });
      return;
    }

    try {
      const token = await this.auth.userLogin(
        req.body.username,
        req.body.password,
        req.body.email
      );

      res.status(200).send({ token });
    } catch (err) {
      res.status(401).send({ message: "Invalid username or password" });
    }
  }
}
