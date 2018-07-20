import { Auth, AccessType } from "./index";
import { NextFunction, Request, RequestHandler, Response } from "express";

export default class Access {
  private auth: Auth;
  private isPublic: boolean;

  constructor(auth: Auth, isPublic: boolean = false) {
    this.auth = auth;
    this.isPublic = isPublic;
  }

  public can(access: AccessType): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (this.isPublic) {
        next();
        return;
      }

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
            return;
          } else {
            res.status(401).send({ message: "Unauthorized" });
            return;
          }
        } catch (err) {
          res.status(401).send({ message: "Unauthorized" });
          return;
        }
      }
      res.status(401).send({ message: "Unauthorized" });
    };
  }
}
