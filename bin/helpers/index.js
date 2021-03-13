const message = require('./message');
const createFiles = require('./createFiles');
const getOptions = require('./getOptions')
const {VALID_ARGS, getPathToCreate} = require('./args')
const toCase = require('./toCase')

module.exports = {
    VALID_ARGS,
    message,
    createFiles,
    getOptions,
    getPathToCreate
}