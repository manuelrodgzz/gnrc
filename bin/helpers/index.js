const message = require('./message');
const validation = require('./validation');
const getConfig = require('./getConfig')
const {hasArg, VALID_ARGS} = require('./args')

module.exports = {
    VALID_ARGS,
    hasArg,
    message,
    validation,
    getConfig
}