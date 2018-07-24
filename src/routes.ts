import * as bodyParser from "body-parser";
import Access from "./auth/access";
import { Application, NextFunction, Request, Response } from "express";
import Container from "./util/container";
import { AccessType } from "./auth";
import Route from "./routes/route";
import PackageGetDistTags from "./routes/package-get-dist-tags";
import PackagePublish from "./routes/package-publish";
import ApiPackage from "./routes/api-package";
import PackageDelete from "./routes/package-delete";
import PackageGetJson from "./routes/package-get-json";
import PackageGet from "./routes/package-get";
import PackageDeleteDistTags from "./routes/package-delete-dist-tags";
import PackageAddDistTags from "./routes/package-add-dist-tags";
import ApiAuthenticate from "./routes/api-authenticate";
import Logger from "./util/logger";
import AuthWhoami from "./routes/auth-whoami";
import AuthUserLogout from "./routes/auth-user-logout";
import AuthUserLogin from "./routes/auth-user-login";
import Search from "./routes/search";
import AuditProxy from "./routes/audit-proxy";

export default function InitRoutes(app: Application, container: Container) {
  const config: Map<string, any> = container.get("config");
  const access = new Access(container.get("auth"), config.get("auth").public);
  const logger: Logger = container.get("logger");

  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.log(
      `\nMETHOD: ${req.method}, URL: ${decodeURIComponent(req.originalUrl)}\n`
    );

    next();
  });
  app.use(bodyParser.json({ strict: false, limit: "10mb" }));

  app.get("/-/ping", (req: Request, res: Response) => {
    res.send({
      message: "ap-npm is running"
    });
  });

  app.get("/api/authenticate", (req: Request, res: Response) => {
    const route: ApiAuthenticate = container.get("route-api-authenticate");
    return route.process(req, res);
  });

  app.get(
    "/api/packages",
    access.can(AccessType.Access),
    (req: Request, res: Response) => {
      const route: ApiPackage = container.get("route-api-package");
      return route.process(req, res);
    }
  );

  app.get(
    "/api/package/:package?",
    access.can(AccessType.Access),
    (req: Request, res: Response) => {
      const route: ApiPackage = container.get("route-api-package");
      return route.process(req, res);
    }
  );

  app.get(
    "/api/package/:scope%2f:package",
    access.can(AccessType.Access),
    (req: Request, res: Response) => {
      const route: ApiPackage = container.get("route-api-package");
      return route.process(req, res);
    }
  );

  app.get(
    "/:scope%2f:package",
    access.can(AccessType.Publish),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.query.write === "true") {
        const route: PackageDelete = container.get("route-package-delete");
        return route.process(req, res);
      } else {
        next();
      }
    }
  );

  app.get(
    "/:package",
    access.can(AccessType.Publish),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.query.write === "true") {
        const route: PackageDelete = container.get("route-package-delete");
        return route.process(req, res);
      } else {
        next();
      }
    }
  );

  app.get(
    "/-/v1/search",
    access.can(AccessType.Access),
    (req: Request, res: Response) => {
      const route: Search = container.get("route-search");
      return route.process(req, res);
    }
  );

  // *** AUTH ***
  app.post("/-/v1/login", (req: Request, res: Response) => {
    const route: AuthUserLogin = container.get("route-auth-user-login");
    return route.process(req, res);
  });
  app.put(
    "/-/user/org.couchdb.user:_rev?/:revision?",
    (req: Request, res: Response) => {
      const route: AuthUserLogin = container.get("route-auth-user-login");
      return route.process(req, res);
    }
  );
  // Logout
  app.delete("/-/user/token/:token?", (req: Request, res: Response) => {
    const route: AuthUserLogout = container.get("route-auth-user-logout");
    return route.process(req, res);
  });
  // for "npm whoami"
  app.get("/whoami", (req: Request, res: Response) => {
    const route: Route = container.get("route-auth-whoami");
    return route.process(req, res);
  });
  // for "npm whoami"
  app.get("/-/whoami", (req: Request, res: Response) => {
    const route: AuthWhoami = container.get("route-auth-whoami");
    return route.process(req, res);
  });

  app.get(
    "/:scope%2f:package/:version?",
    access.can(AccessType.Access),
    (req: Request, res: Response) => {
      const route: PackageGetJson = container.get("route-package-get-json");
      return route.process(req, res);
    }
  );

  app.get(
    "/:package/:version?",
    access.can(AccessType.Access),
    (req: Request, res: Response) => {
      const route: PackageGetJson = container.get("route-package-get-json");
      return route.process(req, res);
    }
  );

  // Request for package file data
  app.get(
    "/:scope%2f:package/-/:filename",
    access.can(AccessType.Access),
    (req: Request, res: Response) => {
      const route: PackageGet = container.get("route-package-get");
      return route.process(req, res);
    }
  );

  app.get(
    '/:this.config.get("auth")ge/-/:filename',
    access.can(AccessType.Access),
    (req: Request, res: Response) => {
      const route: PackageGet = container.get("route-package-get");
      return route.process(req, res);
    }
  );

  app.get(
    "/-/package/:scope%2f:package/dist-tags",
    access.can(AccessType.Access),
    (req: Request, res: Response) => {
      const route: PackageGetDistTags = container.get(
        "route-package-get-dist-tags"
      );
      return route.process(req, res);
    }
  );

  app.get(
    "/-/package/:package/dist-tags",
    access.can(AccessType.Access),
    (req: Request, res: Response) => {
      const route: PackageGetDistTags = container.get(
        "route-package-get-dist-tags"
      );
      return route.process(req, res);
    }
  );

  app.delete(
    "/-/package/:scope%2f:package/dist-tags/:tag",
    access.can(AccessType.Publish),
    (req: Request, res: Response) => {
      const route: PackageDeleteDistTags = container.get(
        "route-package-delete-dist-tags"
      );
      return route.process(req, res);
    }
  );

  app.delete(
    "/-/package/:package/dist-tags/:tag",
    access.can(AccessType.Publish),
    (req: Request, res: Response) => {
      const route: PackageDeleteDistTags = container.get(
        "route-package-delete-dist-tags"
      );
      return route.process(req, res);
    }
  );

  app.put(
    "/-/package/:scope%2f:package/dist-tags/:tag",
    access.can(AccessType.Publish),
    (req: Request, res: Response) => {
      const route: PackageAddDistTags = container.get(
        "route-package-add-dist-tags"
      );
      return route.process(req, res);
    }
  );

  app.put(
    "/-/package/:package/dist-tags/:tag",
    access.can(AccessType.Publish),
    (req: Request, res: Response) => {
      const route: PackageAddDistTags = container.get(
        "route-package-add-dist-tags"
      );
      return route.process(req, res);
    }
  );

  // *** PUBLISH ***
  app.put(
    "/:scope%2f:package/:_rev?/:revision?",
    access.can(AccessType.Publish),
    (req: Request, res: Response) => {
      const route: PackagePublish = container.get("route-package-publish");
      return route.process(req, res);
    }
  );

  app.put(
    "/:package/:_rev?/:revision?",
    access.can(AccessType.Publish),
    (req: Request, res: Response) => {
      logger.info("PackagePublish");
      const route: PackagePublish = container.get("route-package-publish");
      return route.process(req, res);
    }
  );

  app.post("/-/npm/v1/security/audits", (req: Request, res: Response) => {
    const route: AuditProxy = container.get("route-audit-proxy");
    return route.process(req, res);
  });

  app.post("/-/npm/v1/security/audits/quick", (req: Request, res: Response) => {
    const route: AuditProxy = container.get("route-audit-proxy");
    return route.process(req, res);
  });

  app.get("/", (req: Request, res: Response) => {
    if (req.url === "/" || req.url === "") {
      res.send("ap-npm is running\n");
    }
  });

  return app;
}
