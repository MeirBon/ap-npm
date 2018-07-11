import Auth from "../auth";
import { NextFunction, Request, Response } from "express";

export default class AdminAccess {
  private auth: Auth;

  constructor(auth: Auth) {
    this.auth = auth;
  }

  public async process(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      res.status(401).header("WWW-Authenticate", "Basic realm=\"ap-npm\"").send("Unauthorized");
    } else {
      if (req.headers.authorization) {
        let userLogin = (Buffer.from(req.headers.authorization.substr(6), "base64")).toString("UTF-8");
        let userInfo = userLogin.split(":");
        let username = userInfo[0];
        let password = userInfo[1];

        this.auth.verifyLogin(username, password).then((loggedIn) => {
          if (loggedIn === true) {
            next();
          } else {
            res.status(401).send("Invalid username and password, unauthorized");
          }
        });
      } else {
        res.status(400).send({ message: "No authorization header" });
      }
    }
  }
}