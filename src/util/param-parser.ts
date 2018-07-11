import { NextFunction, Request, Response } from "express";

export default function(req: Request, res: Response, next: NextFunction) {
  let url = decodeURIComponent(req.url);
  let params = url.split("?");
  for (let i = 1; i < params.length; i++) {
    let param = params[i].split("=");
    req.params[param[0]] = param[1];
  }
  next();
}