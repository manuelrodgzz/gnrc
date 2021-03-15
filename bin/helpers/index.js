const message = require('./message');
const {createComponentFiles, createConfigFile} = require('./createFiles');
const getOptions = require('./getOptions')
const {VALID_ARGS, getPathToCreate} = require('./args')

module.exports = {
    VALID_ARGS,
    message,
    createComponentFiles,
    createConfigFile,
    getOptions,
    getPathToCreate
}