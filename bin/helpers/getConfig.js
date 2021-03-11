const isDevelopment = process.env.NODE_ENV === 'development' ? true : false
const config = require(`../config${isDevelopment ? '.dev' : ''}.json`)
const {VALID_ARGS, validFlags, hasArg, validateConflicts} = require('./args')
const message = require('./message')

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
 * @param {*} userArgs 
 */

module.exports = (userArgs) => {
    const realConfig = {}
    const validation = validateConflicts(userArgs)


    if(validation.conflict)
        throw new Error(validation.reason)

    Object.keys(config).map(key => {

        let arg

        switch(key){
            case 'fileCase':
                arg = hasArg(userArgs, VALID_ARGS[key])
                break;

            case 'stylesLanguage':
                arg = hasArg(userArgs, VALID_ARGS.styles)
                break;

            case 'componentType':
                arg = hasArg(userArgs, VALID_ARGS.function) || hasArg(userArgs, VALID_ARGS.class)
                break;

            case 'stylesModule':
                arg = hasArg(userArgs, VALID_ARGS.module)
                break;

            case 'createIndex':
                arg = hasArg(userArgs, VALID_ARGS.index)
                break;
        }
        
        realConfig[key] = arg ? arg.value : config[key]
    })

    return realConfig

}