import * as express from "express";
import Container from "../util/container";
import InitRoutes from "../routes";
import { AuthManager } from "../auth";
import JsonProvider from "../auth/json-provider";
import Validator from "../util/validator";
import PackageProxy from "../routes/package-proxy";
import Logger from "../util/logger";
import * as axios from "@contentful/axios";
import * as Process from "process";
import * as fs from "async-file";

export default function(container: Container) {
  container.set("fs", function () {
    return fs;
  });

  container.set("express", function() {
    const app = express();
    InitRoutes(app, container);
    app.set("env", process.env.NODE_ENV || "production");
    return app;
  });

  container.set("validator", function() {
    return new Validator(container.get("storage"));
  });

  container.set("auth", function() {
    return new AuthManager(
      container.get("auth-adapter"),
      container.get("config")
    );
  });

  container.set("auth-adapter", function() {
    let AuthAdapter;
    if (container.get("config").get("auth").adapter === "default") {
      return new JsonProvider(container.get("config"), container.get("fs"));
    }
    AuthAdapter = require(container.get("config").get("auth").adapter).default;
    return new AuthAdapter(container.get("config"));
  });

  container.set("axios", function() {
    return axios;
  });

  container.set("logger", function () {
    return new Logger(Process.stdout);
  });
}
