const fs = require('fs');
const path = require('path');
const config = require('./getConfig');

const updateConfig = (options) => {
  Object.keys(config).forEach((key) =>
    options.config[key] !== undefined
      ? (config[key] = options.config[key])
      : null
  );

  fs.writeFileSync(
    path.resolve(__dirname, '../config.json'),
    JSON.stringify(config, undefined, 1)
  );
};

module.exports = updateConfig;
