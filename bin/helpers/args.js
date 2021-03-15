const fs = require('fs')
const config = require('../config.json')
const VALID_ARGS = require('./validArgs')


/**Object with arrays of the conflictive flags.
 * 
 * Conflictive flags ares flags which can not be used in the same execution
 */
const conflictMap = (() => {
    const conflictMap = {}

    Object.values(VALID_ARGS).forEach(validArg => {
        if(validArg.conflictId){
            if(conflictMap[validArg.conflictId])
                conflictMap[validArg.conflictId].push(validArg)
            else    
                conflictMap[validArg.conflictId] = [validArg]
        }
    })

    return conflictMap
})()

/**Array of valid flags */
const validFlags =  Object.values(VALID_ARGS).map(validArg =>  validArg.flags).flat()

const validConfigFlags = Object.values(VALID_ARGS.config.arguments).map(arg => arg.flags).flat()

/**Flags which will be ignored during validation*/
const validationIgnorerFlags = Object.values(VALID_ARGS).filter(validArg => validArg.validationIgnorer).map(validArg => validArg.flags).flat()

/**
 * 
 * @param {string} flag 
 */
const isValidFlag = (flag) => validFlags.includes(flag)

/**
 * @param {{}} arguments
 * @param {string} flag 
 * @param {string} value 
 */
const isValidValue = (arguments, flag, value) => {
    const validArg = Object.values(arguments).filter(validArg => validArg.flags.includes(flag))[0]
    console.log(validArg, 1)
    return validArg && validArg.validValues ? validArg.validValues.includes(value) : false
}

const isValidConfigFlag = (flag) => validConfigFlags.includes(flag)

/**
 * 
 * @param {string[]} configArgs 
 */
const validateConfigConflicts = (configArgs) => {
    for(let idx in configArgs){
        const arg = configArgs[idx]
        
        const flagsValidation =  validateFlagsConflicts(VALID_ARGS.config.arguments, arg, idx, configArgs)

        if(flagsValidation.conflict)
            return flagsValidation
    }

    return {conflict: false}
}

/**
 * 
 * @param {string[]} validArgs 
 * @param {string} arg 
 * @param {string | number} argIndex 
 * @param {string[]} argsArray
 * @param {{}} conflictiveFlagsDecteted
 */
const validateFlagsConflicts = (validArgs, currentArg, argIndex, argsArray, conflictiveFlagsDetected) => {
    //if flag is not valid
    if(currentArg[0] === '-' && !isValidFlag(currentArg))
        return {conflict: true, reason: `Invalid flag ${currentArg}`}

    //If is not a flag
    if(currentArg[0] !== '-' ){
        const prevArg = argsArray[Number(argIndex) - 1]
        if(prevArg[0] === '-'){ //If previous argument was a flag
            console.log(validArgs)
            if(!isValidValue(validArgs, prevArg, currentArg)) //If argument is not a valid value
                return {conflict: true, reason: `Invalid value ${currentArg}`}
        }
        else
            return {conflict: true, reason: `Unknown argument ${currentArg}`}

    }

    //Avoids duplicating flags
    const rgx = new RegExp(`(?<=(\\s|^))${currentArg}(?=(\\s|))`, 'g')
    console.log(rgx.source, argsArray.join(' '))
    if(argsArray.join(' ').match(rgx).length > 1)
        return { conflict: true, reason: `Duplicated flag ${currentArg}`}

    //Avoids use of conflictive flags in the same execution. (e.g. -f and -c, --module and --no-module)
    for(let validArg of Object.values(validArgs)){
        if(validArg.flags.includes(currentArg) && validArg.conflictId){
            conflictiveFlagsDetected[validArg.conflictId]++
            if(conflictiveFlagsDetected[validArg.conflictId] > 1)
                return {conflict: true, reason: `You can't use ${currentArg} with ${conflictMap[validArg.conflictId].filter(_validArg => !_validArg.flags.includes(currentArg)).map(_validArg => _validArg.flags).flat()} flag(s)`}

            break
        }
    }

    return {conflict: false}
}

/**Looks for conflicts in the arguments that user selected
 * @param {string[]} argsArray
 */
const validateAllConflicts = (argsArray) => {

    const conflictiveFlagsDetected = Object.fromEntries(Object.keys(conflictMap).map(key => [key, 0]))

    //If there is some arg which is validation ignorer, validation is skipped
    if(argsArray.some(arg => validationIgnorerFlags.includes(arg)))
        return {conflict: false}

    if(argsArray.includes(VALID_ARGS.config.flags[0])){
        if(argsArray[0] === VALID_ARGS.config.flags[0])
            return validateConfigConflicts(argsArray.slice(1))
        else
            return {conflict: true, reason: 'Config argument must be the first argument'}
    }
        
    //Args loop
    for(let idx in argsArray){
        const arg = argsArray[idx]

        //If component path is missing
        if(idx == '0'){
            if(arg[0] === '-')
                return {conflict: true, reason: 'Missing component path'}
            else
                continue
        }
        
        const flagValidation = validateFlagsConflicts(VALID_ARGS, arg, idx, argsArray, isValidValue, conflictiveFlagsDetected)

        if(flagValidation.conflict)
            return flagValidation
    }

    return {conflict: false}
}

/**Returns path where component should be created
 * @param {string[]} args
 */
const getPathToCreate = (args) => {
    const pathArray = args[0].split('/');
    const componentName = pathArray[pathArray.length-1][0].toUpperCase() + pathArray[pathArray.length-1].slice(1);

    const dirToCreate = (() => {
        let dir
        if(pathArray.length > 1)
            dir =  pathArray.slice(0,pathArray.length-1).join('/')
        else{
    
            if(fs.existsSync('./src'))
                dir = `./src/components`
            else
                dir = `./components`;
        }
    
        dir += `/${componentName}`
    
        return dir
    })();
    return dirToCreate
}

const getConfigArgs = (argsArray) => {
    const args = {}

    argsArray.forEach(arg => {
        for( let key of Object.keys(VALID_ARGS.config.arguments)) {
            if(VALID_ARGS.config.arguments[key].flags.includes(arg)){
                args[key] = true
                continue
            }                
        }
    })

    return args
}

/**
 * Returns an object with all the arguments that user selected
 * @param {string[]} argsArray 
 */
const getArgs = (argsArray) => {
    const validation = validateAllConflicts(argsArray)

    if(validation.conflict)
        throw new Error(validation.reason)

    const validArgsKeys = Object.keys(VALID_ARGS)
    const args = Object.fromEntries(validArgsKeys.map(key => [key, false]))

    argsArray.forEach((arg,idx) => {


        if(arg[0] !== '-'){
            if(idx === 0){
                args.path = getPathToCreate(argsArray)
                return
            }
            else
                return
        }

        validArgsKeys.forEach(key => {
            if(!VALID_ARGS[key].flags)
                return

            if(VALID_ARGS[key].flags.includes(arg)) {
                
                if(VALID_ARGS[key].arguments){
                    args[key] = getConfigArgs(argsArray.slice(1))
                    return
                }

                if(VALID_ARGS[key].validValues) {
                    const nextArg = argsArray[idx + 1]

                    if(VALID_ARGS[key] === VALID_ARGS.styles && nextArg && nextArg[0] !== '-') 
                        args[key] = nextArg
                    else
                        args[key] = config.stylesLanguage
                }
                else
                    args[key] = true
            }
        })
    })

    //If function or class flags were not specified, function will be the default
    if(!args.function && !args.class)
        args.function = true

    return args
}

module.exports = {
    getArgs,
    VALID_ARGS,
    validFlags
}