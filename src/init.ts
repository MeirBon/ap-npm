import * as fs from 'fs';
import Container from "./util/container";
import StorageInit from "./init/storage-init";
import RoutesInit from "./init/routes-init";
import AuthInit from "./init/auth-init";
import CommandInit from "./init/command-init";
import UtilInit from "./init/util-init";
import AdminInit from "./init/admin-init";
import Logger from "./util/logger";

export default function Init(configFile: string) {
  let container = new Container();

  container.set("config", function() {
    let map = new Map();
    const object = JSON.parse(fs.readFileSync(configFile).toString('utf8'));
    Object.keys(object).forEach(key => {
      map.set(key, object[key]);
    });
    return map;
  });

  container.set("logger", function() {
    return new Logger();
  });

  StorageInit(container);
  RoutesInit(container);
  AuthInit(container);
  CommandInit(container);
  UtilInit(container);
  AdminInit(container);

  return container;
}