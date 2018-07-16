import Auth, { AccessType } from "./index";
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
          const shouldBeAbleTo = await this.auth.shouldBeAbleTo(
            access,
            req.params.package,
            req.headers.authorization
          );

          if (shouldBeAbleTo) {
            next();
          }
        } catch (err) {
          console.log(err);
          res.status(401).send({
            code: 401,
            message: "Unauthorized"
          });
        }
      }
    };
  }
}
