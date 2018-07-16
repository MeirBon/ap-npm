import * as bodyParser from "body-parser";
import Access from "./auth/access";
import requestParser from "./util/request-parser";
import paramParser from "./util/param-parser";
import { Application } from "express";
import Container from "./util/container";
import { AccessType } from "./auth";
import Route from "./routes/route";

export default function InitRoutes(app: Application, container: Container) {
  const access = new Access(container.get("auth"));
  const logger = container.get("logger");

  app.use(logger.routerLogger);
  app.use(bodyParser.json({ strict: false, limit: "10mb" }));
  app.use(requestParser);
  app.use(paramParser);

  app.get("/api/authenticate", (req, res) => {
    const route: Route = container.get("route-api-authenticate");
    return route.process(req, res);
  });

  app.get("/api/packages", access.can(AccessType.Access), (req, res) => {
    const route: Route = container.get("route-api-package");
    return route.process(req, res);
  });

  app.get(
    "/api/package/:package?",
    access.can(AccessType.Access),
    (req, res) => {
      const route: Route = container.get("route-api-package");
      return route.process(req, res);
    }
  );

  app.get(
    "/api/package/:scope/:package",
    access.can(AccessType.Access),
    (req, res) => {
      const route: Route = container.get("route-api-package");
      return route.process(req, res);
    }
  );

  app.get("/-/ping", (req, res) => {
    res.send({
      message: "ap-npm is running"
    });
  });

  // *** AUTH ***
  app.put("/-/user/org.couchdb.user:_rev?/:revision?", (req, res) => {
    const route: Route = container.get("route-auth-user-login");
    return route.process(req, res);
  });
  // Logout
  app.delete("/-/user/token/*", (req, res) => {
    const route: Route = container.get("route-auth-user-logout");
    return route.process(req, res);
  });
  // for "npm whoami"
  app.get("/whoami", (req, res) => {
    const route: Route = container.get("route-auth-whoami");
    return route.process(req, res);
  });
  // for "npm whoami"
  app.get("/-/whoami", (req, res) => {
    const route: Route = container.get("route-auth-whoami");
    return route.process(req, res);
  });

  // *** INSTALL ***
  // Get version of package
  app.get("/:package/:version?", access.can(AccessType.Access), (req, res) => {
    const route: Route = req.params.write
      ? container.get("route-package-unpublish")
      : container.get("route-package-get-json");
    return route.process(req, res);
  });
  // Request for package file data
  app.get(
    "/:package/-/:filename",
    access.can(AccessType.Access),
    (req, res) => {
      const route: Route = container.get("route-package-get");
      return route.process(req, res);
    }
  );

  // *** DIST-TAGS ***
  app.get(
    "/-/package/:package/dist-tags",
    access.can(AccessType.Access),
    (req, res) => {
      const route: Route = container.get("route-package-get-dist-tags");
      return route.process(req, res);
    }
  );
  app.delete(
    "/-/package/:package/dist-tags/:tag",
    access.can(AccessType.Publish),
    (req, res) => {
      const route: Route = container.get("route-package-delete-dist-tags");
      return route.process(req, res);
    }
  );
  app.put(
    "/-/package/:package/dist-tags/:tag",
    access.can(AccessType.Publish),
    (req, res) => {
      const route: Route = container.get("route-package-add-dist-tags");
      return route.process(req, res);
    }
  );

  // *** PUBLISH ***
  app.put(
    "/:package/:_rev?/:revision?",
    access.can(AccessType.Publish),
    (req, res) => {
      const route: Route = container.get("route-package-publish");
      return route.process(req, res);
    }
  );

  app.delete(
    "/:package/:rev?/:revision?",
    access.can(AccessType.Publish),
    (req, res) => {
      const route: Route = container.get("route-package-delete");
      return route.process(req, res);
    }
  );

  // To test if ap-npm is running
  app.get("/", (req, res) => {
    if (req.url === "/" || req.url === "") {
      res.send("ap-npm is running\n");
    }
  });

  return app;
}
