const { getArgs } = require('./args');

/**
 * Gets options selected by user and returns the final configuration for the
 * component creation depending on user options and current configuration
 * @param {string[]} userArgs
 */
module.exports = (userArgs) => {
  const config = require('./getConfig');

  let options = getArgs(userArgs);

  if (!options.index && !options.noIndex) options.index = config.createIndex;

  if (!options.fileCase) options.fileCase = config.fileCase;

  if (!options.function && !options.class) options[config.componentType] = true;

  if (!options.styles && !options.noStyles && config.styles)
    options.styles = config.stylesLanguage;

  if (!options.module && !options.noModule)
    options.module = config.stylesModule;

  if (!options.folder && !options.noFolder)
    options.folder = config.componentFolder;

  return options;
};
