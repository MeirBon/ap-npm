import * as crypto from "crypto";
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
    let userInfo: IUserInfo = {
      username: req.body.name,
      password: req.body.password,
      email: req.body.email,
      type: req.body.type
    };

    const result = await this.loginUser(userInfo);

    if (result === true) {
      const token = await this.generateToken(userInfo);
      res.status(201);
      res.send({ token });
    }
    else {
      const result = await this.createUser(userInfo);
      if (result === true) {
        const token = await this.generateToken(userInfo);
        res.status(201);
        res.send({ token });
      } else {
        res.status(401).send({ error: "Cannot create user" });
      }
    }
  }

  private async createUser(userInfo: IUserInfo): Promise<boolean> {
    return this.auth.userAdd(userInfo.username, userInfo.password, userInfo.email);
  }

  private async loginUser(userInfo: IUserInfo): Promise<boolean> {
    return this.auth.userLogin(userInfo.username, userInfo.password, userInfo.email);
  }

  private async generateToken(userInfo: IUserInfo): Promise<string> {
    let token = crypto.randomBytes(64).toString("hex");
    await this.auth.addTokenToDB(userInfo.username, token);
    return token;
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