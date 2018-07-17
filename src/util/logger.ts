import * as colors from "colors";
import { NextFunction, Request, Response } from "express";
import WriteStream = NodeJS.WriteStream;

export default class Logger {
  private stream: WriteStream;

  constructor(stream: WriteStream) {
    this.stream = stream;
  }

  public routerLogger(req: Request, res: Response, next: NextFunction) {
    this.write("\nMETHOD: " + req.method + ", URL: " + decodeURIComponent(req.originalUrl));
    next();
  }

  public log(...messages: any[]) {
    messages.forEach((message) => {
      this.write(message);
    });
  }

  public info(...messages: any[]) {
    messages.forEach((message) => {
      this.write(colors.green(message));
    });
  }

  public warn(...messages: any[]) {
    messages.forEach((message) => {
      this.write(colors.yellow(message));
    });
  }

  public error(...messages: any[]) {
    messages.forEach((message) => {
      this.write(colors.red(message));
    });
  }

  public debug(...messages: any[]) {
    messages.forEach((message) => {
      this.write(colors.blue(message));
    });
  }

  private write(message: string) {
    if (this.stream.writable) {
      this.stream.write(message);
    }
  }
}
