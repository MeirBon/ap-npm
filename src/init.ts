import Container from "./util/container";
import StorageInit from "./init/storage-init";
import RoutesInit from "./init/routes-init";
import AuthInit from "./init/auth-init";
import CommandInit from "./init/command-init";
import UtilInit from "./init/util-init";
import ApiInit from "./init/api-init";
import Logger from "./util/logger";
import { stdout } from "process";
import { Url } from "url";

export default function Init(config: IConfig) {
  const container = new Container();

  container.set("config", function() {
    const map = new Map();
    const object: any = config;
    Object.keys(object).forEach(key => {
      map.set(key, object[key]);
    });
    return map;
  });

  container.set("logger", function() {
    return new Logger(stdout);
  });

  StorageInit(container);
  AuthInit(container);
  CommandInit(container);
  ApiInit(container);
  UtilInit(container);
  RoutesInit(container);

  return container;
}

export interface IConfig {
  workDir: string;
  storage: {
    directory: string;
  };
  port: number;
  hostname: string;
  proxyEnabled: boolean;
  proxyUrl: Url;
  proxyAudit: boolean;
  auth: {
    users: {
      canPublish: boolean;
      canAccess: boolean;
    };
    register: true;
    public: false;
    remove: true;
  };
  ssl: {
    enabled: boolean;
    key: string;
    cert: string;
  };
}
