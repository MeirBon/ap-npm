import * as express from "express";
import Container from "../util/container";
import InitRoutes from "../routes";
import Auth from "../auth";
import JsonProvider from "../auth/json-provider";
import Validator from "../util/validator";

export default function(container: Container) {
  container.set("express", function() {
    let app = express();
    InitRoutes(app, container);
    app.set("env", process.env.NODE_ENV || "production");
    return app;
  });

  container.set("validator", function() {
    return new Validator(container.get("storage"));
  });

  container.set("auth", function() {
    return new Auth(container.get("auth-adapter"), container.get("config"), container.get("logger"));
  });

  container.set("auth-adapter", function() {
    let AuthAdapter;
    if (container.get("config").get('auth').adapter === "./src/auth/json-db") {
      return new JsonProvider(container.get("config"));
    }
    AuthAdapter = require(container.get("config").get('auth').adapter).default;
    return new AuthAdapter(container.get("config"));
  });

  container.set("proxy", function() {
    let Util = require("../util/package-proxy").default;
    return new Util(container.get("config").proxyUrl);
  });

}