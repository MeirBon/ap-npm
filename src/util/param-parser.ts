import { NextFunction, Request, Response } from "express";

export default function(req: Request, res: Response, next: NextFunction) {
  const url = decodeURIComponent(req.url);
  const queryString: string[] = url.split("?");

  if (queryString.length > 1) {
    const params = queryString[1].split("&");

    for (let i = 0; i < params.length; i++) {
      const param = params[i].split("=");

      if (param[0].endsWith("[]")) {
        const key = param[0].substr(0, param[0].length - 2);

        if (typeof req.params[key] !== "object") {
          req.params[key] = [param[1]];
        } else {
          req.params[key].push(param[1]);
        }
      } else {
        req.params[param[0]] = param[1];
      }
    }
  }
  next();
}
