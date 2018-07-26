import * as commander from "commander";
import containerInit from "./init";
import * as fs from "async-file";
import * as path from "path";
import ServeCommand from "./commands/serve";
import * as process from "process";

export function serveAction(config: any) {
  if (typeof config === "string") {
    fs.exists(config).then((result: boolean) => {
      if (!result) {
        throw Error(`Config file: ${config} does not exist`);
      }

      fs.readFile(config).then((file: string) => {
        const container = containerInit(JSON.parse(file));
        const logger = container.get("logger");
        logger.info("using config: " + config + "\n");

        const command: ServeCommand = container.get("command-serve");
        command.run().then(() => 0);
      });
    });
  } else {
    const configLocation = path.join(__dirname, "../", "config.json");
    fs.readFile(configLocation).then((file: string) => {
      const container = containerInit(JSON.parse(file));
      const logger = container.get("logger");
      logger.info("using default config\n");

      const command: ServeCommand = container.get("command-serve");
      command.run().then(() => 0);
    });
  }
}

export function initAction() {
  const configLocation = path.join(__dirname, "../", "config.json");
  fs.readFile(configLocation).then((file: string) => {
    const container = containerInit(JSON.parse(file));
    const command = container.get("command-init");
    command.run(process.cwd());
  });
}

commander
  .command("serve")
  .alias("s")
  .description("serve ap-npm")
  .option("-c, --config", "config file to use", "")
  .action(serveAction);

commander
  .command("init")
  .description("init a npm project using ap-npm publishConfig")
  .action(initAction);

commander
  .command("version")
  .alias("v")
  .action(function() {
    const configLocation = path.join(__dirname, "../", "config.json");
    fs.readFile(configLocation).then((file: string) => {
      const logger = containerInit(JSON.parse(file)).get("logger");
      fs.readFile(path.join(__dirname, "../package.json")).then(
        (file: string) => {
          logger.log(JSON.parse(file).version);
        }
      );
    });
  });

commander.parse(process.argv);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
}
