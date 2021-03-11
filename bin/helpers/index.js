const message = require('./message');
const { createComponentFiles, createConfigFile } = require('./createFiles');
const getOptions = require('./getOptions');
const { VALID_ARGS, getPathToCreate } = require('./args');
const updateConfig = require('./updateConfig')
const config = require('./getConfig')

module.exports = {
  VALID_ARGS,
  message,
  config,
  createComponentFiles,
  createConfigFile,
  getOptions,
  getPathToCreate,
  updateConfig
};
