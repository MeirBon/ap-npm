import * as fs from "async-file";
import * as path from "path";
import Logger from "../util/logger";

export default class ConfigCommand {
  private logger: Logger;
  private readonly configPath: string;

  constructor(logger: Logger) {
    this.configPath = path.join(__dirname, "../..", "config.json");
    this.logger = logger;
  }

  public async listConfig(configLocation: string) {
    this.logger.log("Config location: " + configLocation);

    const value = await fs.readFile(configLocation);
    this.logger.log("Config:\n", JSON.parse(value));
  }

  public async updateProp(property: string, value: any): Promise<number> {
    const propArgs = property.split(".");

    const file = await fs.readFile(this.configPath);

    const config = JSON.parse(file);

    switch (propArgs.length) {
      case 1:
        if (
          config.hasOwnProperty(propArgs[0]) &&
          typeof config[propArgs[0]] !== "object"
        ) {
          config[propArgs[0]] = ConfigCommand.convertValue(value);
          break;
        }
        throw Error("Unknown property: " + property);
      case 2:
        if (config.hasOwnProperty(propArgs[0])) {
          if (
            config[propArgs[0]].hasOwnProperty(propArgs[1]) &&
            typeof config[propArgs[0]][propArgs[1]] !== "object"
          ) {
            config[propArgs[0]][propArgs[1]] = ConfigCommand.convertValue(
              value
            );
            break;
          }
        }
        throw Error("Unknown property: " + property);
      case 3:
        if (config.hasOwnProperty(propArgs[0])) {
          if (config[propArgs[0]].hasOwnProperty(propArgs[1])) {
            if (config[propArgs[0]][propArgs[1]].hasOwnProperty(propArgs[2])) {
              config[propArgs[0]][propArgs[1]][
                propArgs[2]
              ] = ConfigCommand.convertValue(value);
              break;
            }
          }
          throw Error("Unknown property: " + property);
        }
        throw Error("Unknown property: " + property);
      default:
        throw Error("Unknown property: " + property);
    }

    await fs.writeFile(this.configPath, JSON.stringify(config, undefined, 2));
    return 0;
  }

  private static convertValue(value: any) {
    if (value === "true") {
      return true;
    } else if (value === "false") {
      return false;
    } else if (!isNaN(value)) {
      return parseInt(value, 10);
    }
    return value;
  }
}
