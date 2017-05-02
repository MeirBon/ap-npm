import commander from 'commander';
import containerInit from './init';
import fs from 'fs';
import path from 'path';

commander
  .command('serve')
  .alias('s')
  .description('serve ap-npm')
  .option('-c, --config', "config file to use")
  .action(function(config) {
    let container;

    if (fs.existsSync(config)) {
      console.log("using config: " + config + '\n');
      container = containerInit(config);
    } else {
      console.log("using default config\n");
      let configLocation = path.join(__dirname, '../', 'config.json');
      container = containerInit(configLocation);
    }

    let command = container.get('command-serve');
    command.run();
  });

commander
  .command('config [prop] [value]')
  .description('list or set config properties')
  .action(function(property, value) {
    let configLocation = path.join(__dirname, '../', 'config.json');
    let container = containerInit(configLocation);
    let command = container.get('command-config');

    if (!property || !value) {
      command.listConfig(configLocation);
    } else {
      command.updateProp(property, value);
    }
  });

commander
  .command('init')
  .description('init a npm project using ap-npm publishConfig')
  .action(function() {
    let container = containerInit(path.join(__dirname, '../', 'config.json'));
    let command = container.get('command-init');
    command.run(process.cwd());
  });

commander.parse(process.argv);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
}