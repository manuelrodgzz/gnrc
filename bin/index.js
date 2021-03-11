#!/usr/bin/env node
const { message, getOptions, createComponentFiles } = require('./helpers');
/**Main function */
const gnrc = () => {
  const updateNotifier = require('update-notifier');
  const data = require('./data.json');
  const pkg = require('../package.json');
  const {updateConfig, config} = require('./helpers');
  const userArgs = process.argv.slice(2);
  const notifier = updateNotifier({ pkg, updateCheckInterval: 0 });

  //Get users options
  let options;
  try {
    options = getOptions(userArgs);
  } catch (err) {
    message.yellow(err);
    return;
  }

  if (options.config) {
    if (options.help)
      //If --config --help
      return message.normal(data.help.config.join('\r\n'));
    else if (Object.keys(options.config).length === 0)
      //If --config
      return message.normal(config);
    //If --config ...arguments
    else return updateConfig(options);
  }

  //If --help
  if (options.help) return message.normal(data.help.gnrc.join('\r\n'));

  //If -v
  if (options.version) return message.normal(`v${pkg.version}`);

  try {
    createComponentFiles(options);
  } catch (err) {
    message.red(err);
    return;
  }

  notifier.notify({ isGlobal: true });
};

/**Validates if config.json exist, else it is created */
const validateConfigFile = () => {
  const { createConfigFile } = require('./helpers');
  const fs = require('fs');

  if (!fs.existsSync(`${__dirname}/config.json`)) {
    createConfigFile(__dirname);
  }
};

try {
  validateConfigFile();
  gnrc();
} catch (err) {
  message.red(err);
}
