import Auth from "../auth";
import { Request, Response } from "express";
import Route from "./route";

export default class AuthUserLogin extends Route {
  private auth: Auth;

  constructor(auth: Auth) {
    super();
    this.auth = auth;
  }

  public async process(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.auth.userLogin(
        req.body.name,
        req.body.password
      );
      if (typeof result === "string") {
        res.status(200).send({ token: result });
        return;
      }
    } catch (err) {}

    try {
      const result = await this.auth.userAdd(req.body.name, req.body.password);
      res.status(201).send({ token: result });
    } catch (err) {}

    res.status(401).send({ error: "Cannot create user" });
  }
}
