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
    const userInfo: IUserInfo = {
      username: req.body.name,
      password: req.body.password,
      email: req.body.email,
      type: req.body.type
    };

    try {
      const result = await this.loginUser(userInfo);
      if (typeof result === "string") {
        res.status(201).send({ token: result });
        return;
      }
    } catch (err) {}

    try {
      const result = await this.createUser(userInfo);
      if (typeof result === "string") {
        res.status(201).send({ token: result });
      } else {
        res.status(401).send({ error: "Cannot create user" });
      }
    } catch (err) {
      res.status(401).send({ error: "Cannot create user" });
    }
  }

  private async createUser(userInfo: IUserInfo): Promise<string | boolean> {
    return this.auth.userAdd(
      userInfo.username,
      userInfo.password,
      userInfo.email
    );
  }

  private async loginUser(userInfo: IUserInfo): Promise<string | boolean> {
    return this.auth.userLogin(
      userInfo.username,
      userInfo.password,
      userInfo.email
    );
  }
}

interface IUserInfo {
  username: string;
  password: string;
  email: string;
  type: IUserType;
}

enum IUserType {
  User,
  Admin
}
