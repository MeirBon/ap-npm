import * as Https from "https";
import * as fs from "async-file";
import { Application } from "express";
import Logger from "../util/logger";

export default class ServeCommand {
  private app: Application;
  private readonly port: number;
  private ssl: ISslConfig;
  private readonly hostname: string;
  private config: Map<string, any>;
  private logger: Logger;

  constructor(server: Application, config: Map<string, any>, logger: Logger) {
    this.app = server;
    this.port = config.get("port");
    this.ssl = config.get("ssl");
    this.hostname = config.get("hostname");
    this.config = config;
    this.logger = logger;
  }

  public async run() {
    if (this.ssl.enabled) {
      if (await fs.exists(this.ssl.key) && await fs.exists(this.ssl.cert)) {
        const key = await fs.readFile(this.ssl.key);
        const cert = await fs.readFile(this.ssl.cert);

        Https.createServer({
          key: key,
          cert: cert
        }, this.app).listen(this.port, this.hostname, () => {
          this.logger.info("ap-npm is listening on " + this.hostname + ":" + this.port + "\n");
        });
      } else {
        this.config.get("ssl").enabled = false;
        this.logger.warn("ssl setup failed, key/cert files don't exist\n" +
          "ap-npm will run without being accessible using ssl\n");

        this.logger.info(`ap-npm is listening on http://${this.hostname}:${this.port}\n`);
        this.app.listen(this.port);
      }
    } else {
      this.logger.info(`ap-npm is listening on http://${this.hostname}:${this.port}\n`);
      this.app.listen(this.port);
    }
  }
}

interface ISslConfig {
  enabled: boolean;
  key: string;
  cert: string;
}