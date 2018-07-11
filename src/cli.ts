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

        fs.readFile(config).then(file => {
          const container = containerInit(JSON.parse(file));
          const logger = container.get("logger");
          logger.info("using config: " + config + "\n");

          const command: ServeCommand = container.get("command-serve");
          command.run().then(() => 0);
        });
      });
    } else {
      const configLocation = path.join(__dirname, "../", "config.json");
      fs.readFile(configLocation).then((file) => {
        const container = containerInit(JSON.parse(file));
        const logger = container.get("logger");
        logger.info("using default config\n");

        const command: ServeCommand = container.get("command-serve");
        command.run().then(() => 0);
      });
    }
  });

commander
  .command("config [prop] [value]")
  .description("list or set config properties")
  .action(function(property, value) {
    const configLocation = path.join(__dirname, "../", "config.json");
    fs.readFile(configLocation).then(file => {
      const container = containerInit(JSON.parse(file));
      const command = container.get("command-config");

      if (!property || !value) {
        command.listConfig(configLocation).then(() => 0);
      } else {
        command.updateProp(property, value).then(() => 0);
      }
    });
  });

commander
  .command("init")
  .description("init a npm project using ap-npm publishConfig")
  .action(function() {
    const configLocation = path.join(__dirname, "../", "config.json");
    fs.readFile(configLocation).then((file) => {
      const container = containerInit(JSON.parse(file));
      const command = container.get("command-init");
      command.run(process.cwd());
    });
  });

commander
  .command("version")
  .alias("v")
  .action(function() {
    const configLocation = path.join(__dirname, "../", "config.json");
    fs.readFile(configLocation).then(file => {
      const logger = containerInit(JSON.parse(file)).get("logger");
      fs.readFile(path.join(__dirname, "../package.json")).then((file) => {
        logger.log(JSON.parse(file).version);
      });
    });
  });

commander.parse(process.argv);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
}