const config = require(`../config.json`)
const {getArgs} = require('./args')

//      config.json template
// {
//     {
//     "fileCase": "pascal",
//     "componentType": "function",
//     "styles": false,
//     "stylesLanguage": "css",
//     "stylesModule": true,
//     "componentFolder": true,
//     "createIndex": false
// }
// }

/**
 * 
 * @param {*} userArgs 
 */

module.exports = (userArgs) => {
    let options = getArgs(userArgs)
    console.log(options)
    if(!options.index)
        options.index = config.createIndex

    if(!options.fileCase)
        options.fileCase = config.fileCase

    if(!options.function && !options.class)
        options[config.componentType] = true

    if(!options.styles && config.styles)
        options.styles = config.stylesLanguage

    if(!options.module)
        options.module = config.stylesModule

    if(!options.noFolder)
        options.noFolder = config.componentFolder

    console.log(options)
    return options

}