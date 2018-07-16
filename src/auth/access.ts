import { Auth, AccessType } from "./index";
import { NextFunction, Request, RequestHandler, Response } from "express";

export default class Access {
  private auth: Auth;

  constructor(auth: Auth) {
    this.auth = auth;
  }

  public can(access: AccessType): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (typeof req.headers.authorization === "string") {
        try {
          if (!req.headers.authorization.startsWith("Bearer ")) {
            res.status(400).send({ message: "Invalid authorization header" });
            return;
          }
          const shouldBeAbleTo = await this.auth.shouldBeAbleTo(
            access,
            req.params.package,
            req.headers.authorization
          );

          if (shouldBeAbleTo) {
            next();
          } else {
            res.status(401).send({ message: "Unauthorized" });
          }
        } catch (err) {
          res.status(401).send({ message: "Unauthorized" });
        }
      }
    };
  }
}
