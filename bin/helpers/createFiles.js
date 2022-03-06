const fs = require('fs');
const validateFileCreation = require('./validateFileCreation');
const { index, fnComponent, classComponent, config } = require('./content');
const message = require('./message');

/**
 *
 * @param {string} dirPath
 * @param {string} file
 * @param {string} content
 */
const createFile = (dirPath, file, content) => {
  try {
    const filePath = `${dirPath}/${file}`;

    const createFile = validateFileCreation(filePath);

    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

    if (createFile) {
      fs.writeFileSync(filePath, content);
      message.green(`${file} was created successfully!`);
    }
  } catch (err) {
    message.red(`Error while trying to create ${file}. ${err.message}`);
  }
};

/**
 *
 * @param {{}} options
 */
const createComponentFiles = (options) => {
  let pathArray = options.path.split('/'); //Path is converted to array

  //Modified path string is assigned to options object
  options.path = pathArray.join('/');

  //Hooks are added
  const hooksArray = [];
  if (options.state) hooksArray.push('useState');

  if (options.effect) hooksArray.push('useEffect');

  const componentName = pathArray[pathArray.length - 1];
  const stylesFile = options.styles
    ? `${componentName}${options.module ? '.module' : ''}.${options.styles}`
    : false;
  const componentFileContent = options.function
    ? fnComponent(componentName, stylesFile, hooksArray)
    : classComponent(componentName, stylesFile);

  //If user selected "no folder", component name is removed from path
  if (!options.folder)
    options.path = pathArray.slice(0, pathArray.length - 1).join('/');

  createFile(options.path, `${componentName}.js`, componentFileContent);

  if (options.styles) createFile(options.path, stylesFile, '');

  if (options.index) createFile(options.path, 'index.js', index(componentName));
};

const createConfigFile = (path) => createFile(path, 'config.json', config);

module.exports = {
  createComponentFiles,
  createConfigFile,
};
