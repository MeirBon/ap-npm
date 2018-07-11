import { NextFunction, Request, Response } from "express";

export default function(req: Request, res: Response, next: NextFunction) {
  const url = decodeURIComponent(req.url);
  const params = url.split("?");
  for (let i = 1; i < params.length; i++) {
    const param = params[i].split("=");
    req.params[param[0]] = param[1];
  }
  next();
}