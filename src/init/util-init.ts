import * as express from "express";
import Container from "../util/container";
import InitRoutes from "../routes";
import { AuthManager } from "../auth";
import JsonProvider from "../auth/json-provider";
import Validator from "../util/validator";
import PackageProxy from "../util/package-proxy";
import Logger from "../util/logger";
import * as Process from "process";

export default function(container: Container) {
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
      container.get("config"),
      container.get("logger")
    );
  });

  container.set("auth-adapter", function() {
    let AuthAdapter;
    if (container.get("config").get("auth").adapter === "./src/auth/json-db") {
      return new JsonProvider(container.get("config"));
    }
    AuthAdapter = require(container.get("config").get("auth").adapter).default;
    return new AuthAdapter(container.get("config"));
  });

  container.set("proxy", function() {
    return new PackageProxy(container.get("config").get("proxyUrl"));
  });

  container.set("logger", function () {
    return new Logger(Process.stdout);
  });
}
