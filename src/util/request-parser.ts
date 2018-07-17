import { NextFunction, Request, Response } from "express";

export default function(req: Request, res: Response, next: NextFunction) {
  console.log(req.url);
  return;
  const url = decodeURIComponent(req.url);
  const splitUrl = url.split("/");
  let requestedFile;

  if (typeof req.body !== "object") {
    req.body = { "npm-args": req.body };
  }

  if (splitUrl[1] === "api") {
    next();
    return;
  }

  if (splitUrl[2] === "package") {
    if (splitUrl[3].indexOf("@") !== -1) {
      req.body._scope = splitUrl[3];
      req.body._packageName = splitUrl[4];
      if (splitUrl[5] === "dist-tags" && !!splitUrl[6]) {
        req.body._disttag = splitUrl[6];
      }
    } else {
      req.body._packageName = splitUrl[3];
      if (splitUrl[4] === "dist-tags" && !!splitUrl[5]) {
        req.body._disttag = splitUrl[5];
      }
    }
    next();
    return;
  }

  if (req.body._scope) {
    for (let i = 3; i < splitUrl.length; i++) {
      if (splitUrl[i].indexOf("-") !== -1) {
        if (requestedFile) break;
        requestedFile = splitUrl[i + 2];
      }
    }
  } else {
    for (let i = 2; i < splitUrl.length; i++) {
      if (splitUrl[i].indexOf("-") !== -1) {
        if (requestedFile) break;
        requestedFile = splitUrl[i + 1];
      }
    }
  }

  if (!req.body._packageName) {
    for (let i = 0; i < splitUrl.length; i++) {
      if (req.body._packageName) break;
      if (splitUrl[i] !== "") {
        req.body._packageName = splitUrl[i];
        if (splitUrl[i + 1] === "-") {
          requestedFile = splitUrl[i + 2];
        }
      }
    }
  }

  if (requestedFile) {
    req.body._requestedFile = requestedFile;
  }

  if (req.body._packageName && requestedFile) {
    req.url += "/-/" + requestedFile;
  }

  next();
}
