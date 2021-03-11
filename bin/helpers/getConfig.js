const isDevelopment = process.env.NODE_ENV === 'development' ? true : false
const config = require(`../config${isDevelopment ? '.dev' : ''}.json`)
const {validArgs, hasArg} = require('./args')

//      realConfig mus have this next props
// {
//     "fileCase": string,
//     "componentType": function,
//     "stylesLanguage": string,
//     "stylesModule": boolean,
//     "createIndex": boolean
// }

/**
 * 
 * @param {*} args 
 */

module.exports = (args) => {
    const realConfig = {}

    const fileCase = hasArg(args, validArgs.fileCase)
    realConfig.fileCase =  fileCase && (fileCase.fileCase !== 'Invalid') ? fileCase.fileCase : config.fileCase

    const componentType = !function(){ 
        if(hasArg(args, validArgs.function))
            return 'function'

        if(hasArg(args, validArgs.class))
            return 'class'

        return null
    }()
    realConfig.componentType = componentType ? componentType : config.componentType

    const styles = hasArg(args, validArgs.styles)
    realConfig.stylesLanguage = styles && (styles.stylesLanguage !== 'Invalid') ? styles.stylesLanguage : config.stylesLanguage

    const module = hasArg(args, validArgs.module)
    realConfig.stylesModule = module ? true : config.stylesModule

    const index = hasArg(args, validArgs.index)
    realConfig.createIndex = index ? true : config.createIndex

    return realConfig

}