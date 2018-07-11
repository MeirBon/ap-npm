import * as commander from "commander";
import containerInit from "./init";
import * as fs from "async-file";
import * as path from "path";
import ServeCommand from "./commands/serve";

commander
  .command("serve")
  .alias("s")
  .description("serve ap-npm")
  .option("-c, --config", "config file to use", "")
  .action((config) => {
    if (typeof config === "string") {
      fs.exists(config).then((result) => {
        if (!result) {
          throw Error(`Config file: ${config} does not exist`);
        }
        const container = containerInit(config);
        const logger = container.get("logger");
        logger.info("using config: " + config + "\n");

        let command: ServeCommand = container.get("command-serve");
        command.run().then(() => 0);
      });
    } else {
      const configLocation = path.join(__dirname, "../", "config.json");
      const container = containerInit(configLocation);
      const logger = container.get("logger");
      logger.info("using default config\n");

      let command: ServeCommand = container.get("command-serve");
      command.run().then(() => 0);
    }
  });

commander
  .command("config [prop] [value]")
  .description("list or set config properties")
  .action(function(property, value) {
    let configLocation = path.join(__dirname, "../", "config.json");
    let container = containerInit(configLocation);
    let command = container.get("command-config");

    if (!property || !value) {
      command.listConfig(configLocation).then(() => 0);
    } else {
      command.updateProp(property, value).then(() => 0);
    }
  });

commander
  .command("init")
  .description("init a npm project using ap-npm publishConfig")
  .action(function() {
    let container = containerInit(path.join(__dirname, "../", "config.json"));
    let command = container.get("command-init");
    command.run(process.cwd());
  });

commander
  .command("version")
  .alias("v")
  .action(function() {
    let logger = containerInit(path.join(__dirname, "../", "config.json")).get("logger");
    fs.readFile(path.join(__dirname, "../package.json")).then((file) => {
      logger.log(JSON.parse(file).version);
    });
  });

commander.parse(process.argv);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
}