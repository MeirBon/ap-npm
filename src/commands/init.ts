import * as fs from "async-file";
import * as child_process from "child_process";
import * as path from "path";
import Logger from "../util/logger";

export default class InitCommand {
  private host: string;
  private port: number;
  private ssl: boolean;
  private logger: Logger;

  constructor(config: Map<string, any>, logger: Logger) {
    this.host = config.get("hostname");
    this.port = config.get("port");
    this.ssl = config.get("ssl").enabled;
    this.logger = logger;
  }

  public async run(pathToProject: string) {
    let spawn = child_process.spawnSync;
    let shell = (cmd: string, opts: string[]) => {
      process.stdin.pause();
      return spawn(cmd, opts, {
        stdio: [0, 1, 2]
      });
    };

    await shell("npm", ["init"]);

    const file = await fs.readFile(path.join(pathToProject, "package.json"));
    let publishConfig;

    if (this.ssl) {
      publishConfig = {
        "registry": "https://" + this.host + ":" + this.port
      };
    } else {
      publishConfig = {
        "registry": "http://" + this.host + ":" + this.port
      };
    }
    this.logger.info("\nUpdating package.json with publishConfig:", publishConfig);
    let packageJson = JSON.parse(file);
    packageJson.publishConfig = publishConfig;
    await fs.writeFile(path.join(pathToProject, "package.json"), JSON.stringify(packageJson, null, 2), { "mode": "0664" });
    this.logger.info("ap-npm project created in: " + pathToProject + "\n");
  }
}
