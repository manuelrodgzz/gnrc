let config;

//If config file is doest not exist, default config will be used
try {
  config = require('../config.json');
} catch {
  config = JSON.parse(require('./content').config);
}

module.exports = config;
