import * as colors from 'colors';
import { NextFunction, Request, Response } from "express";

export default class Logger {

  constructor() {
  }

  public routerLogger(req: Request, res: Response, next: NextFunction) {
    console.log("\nMETHOD:", req.method, ", URL:", decodeURIComponent(req.originalUrl));
    next();
  }

  public log(...messages: any[]) {-
    messages.forEach(function (message) {
      console.log(message);
    });
  }

  public info(...messages: any[]) {
    messages.forEach(function (message) {
      console.info(colors.green(message));
    });
  }

  public warn(...messages: any[]) {
    messages.forEach(function (message) {
      console.warn(colors.yellow(message));
    });
  }

  public error(...messages: any[]) {
    messages.forEach(function (message) {
      console.error(colors.red(message));
    });
  }

  public debug(...messages: any[]) {
    messages.forEach(function (message) {
      console.debug(colors.blue(message));
    });
  }

}