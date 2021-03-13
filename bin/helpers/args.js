const fs = require('fs')
const config = require('../config.json')

const VALID_ARGS = {
    path: {
        flags: []
    },
    function : {
        flags: ['-f']
    },
    class: {
        flags: ['-c']
    },
    index: {
        flags: ['-i']
    },
    styles: {
        flags: ['-s'],
        validValues: ['css', 'sass', 'scss', 'less']
    },
    help: {
        flags: ['-h', '--help'],
        validationIgnorer: true
    },
    noFolder: {
        flags: ['--no-folder'],
        value: false
    },
    state: {
        flags: ['--state']
    },
    effect: {
        flags: ['--effect']
    },
    fileCase: {
        flags: ['--file-case'],
        validValues: ['camel', 'pascal'],
        valueRequired: true
    },
    module: {
        flags: ['-m', '--module']
    },
    version: {
        flags: ['-v', '--version'],
        validationIgnorer: true
    }
}

const validFlags =  Object.values(VALID_ARGS).map(validArg =>  validArg.flags).flat()

const validationIgnorerFlags = Object.values(VALID_ARGS).filter(validArg => validArg.validationIgnorer).map(validArg => validArg.flags).flat()

const isValidFlag = (flag) => validFlags.includes(flag)

const isValidValue = (flag, value) => {
    const validArg = Object.values(VALID_ARGS).filter(validArg => validArg.flags.includes(flag))[0]
    return validArg && validArg.validValues ? validArg.validValues.includes(value) : false
}

const validateConflicts = (argsArray) => {
    if(argsArray.some(arg => validationIgnorerFlags.includes(arg)))
        return {conflict: false}

    for(let idx in argsArray){
        const arg = argsArray[idx]

        if(idx == '0'){
            if(arg[0] === '-')
                return {conflict: true, reason: 'Missing component path'}
            else
                continue
        }
        
        //if flag is not valid
        if(arg[0] === '-' && !isValidFlag(arg))
            return {conflict: true, reason: `Invalid flag ${arg}`}

        //If is not a flag
        if(arg[0] !== '-' ){
            const prevArg = argsArray[Number(idx) - 1]
            console.log(arg, prevArg)
            if(prevArg[0] === '-'){ //If previous argument was a flag
                if(!isValidValue(prevArg, arg)) //If argument is not a valid value
                    return {conflict: true, reason: `Invalid value ${arg}`}
            }
            else
                return {conflict: true, reason: `Unknown argument ${arg}`}

        }

        //Avoids having function and class flags simultaneously
        if(VALID_ARGS.function.flags.includes(arg) || VALID_ARGS.class.flags.includes(arg)){
            const functionAndClassFlags = [...VALID_ARGS.function.flags, ...VALID_ARGS.class.flags]
            const rgx = new RegExp(`(?<=(\\s))(${functionAndClassFlags.join('|')})(?=(\\s|))`, 'g')
            if(argsArray.join(' ').match(rgx).length > 1)
                return {conflict: true, reason: 'Only one function flag or one class flag is allowed'}
        }

        //Avoids duplicating flags
        const rgx = new RegExp(`(?<=(\\s))${arg}(?=(\\s|))`, 'g')
        if(argsArray.join(' ').match(rgx).length > 1)
            return { conflict: true, reason: `Duplicated flag ${arg}`}
    }

    return {conflict: false}
}

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
    
        if(!VALID_ARGS.noFolder.flags.some(flag => args.includes(flag)))
            dir += `/${componentName}`
    
        return dir
    })();
    return dirToCreate
}

/**
 * 
 * @param {string[]} argsArray 
 */
const getArgs = (argsArray) => {
    const validation = validateConflicts(argsArray)

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

                if(VALID_ARGS[key].validValues) {
                    if(key === 'styles') //check here!!!!!!!!!!!!!!!!! I need to firgure out how to know if user specified styles languages at this point
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
    validateConflicts,
    validFlags
}