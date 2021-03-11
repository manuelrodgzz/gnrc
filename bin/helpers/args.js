const VALID_ARGS = {
    function : {
        flags: ['-f'],
        value: true
    },
    class: {
        flags: ['-c'],
        value: true
    },
    index: {
        flags: ['-i'],
        value: true
    },
    styles: {
        flags: ['-s'],
        validValues: ['css', 'sass', 'scss', 'less']
    },
    help: {
        flags: ['-h', '--help'],
        value: true
    },
    noFolder: {
        flags: ['--no-folder'],
        value: false
    },
    state: {
        flags: ['--state'],
        value: true
    },
    effect: {
        flags: ['--effect'],
        value: true
    },
    fileCase: {
        flags: ['--file-case'],
        validValues: ['camel', 'pascal'],
        valueRequired: true
    },
    module: {
        flags: ['-m', '--module'],
        value: true
    }
}

const validFlags =  Object.values(VALID_ARGS).map(validArg =>  validArg.flags).flat()

const isValidFlag = (flag) => validFlags.includes(flag)

const isValidValue = (flag, value) => {
    const validArg = Object.values(VALID_ARGS).filter(validArg => validArg.flags.includes(flag))[0]
    return validArg && validArg.validValues ? validArg.validValues.includes(value) : false
}

// const findValidValues = (flag) => {
//     for (let validArg of Object.values(VALID_ARGS)) {
//         if(validArg.flags.includes(flag))
//             return validArg.validValues || 'No valid values'
//     }

//     return 'Invalid'
// }

const validateConflicts = (argsArray) => {
    argsArrayAux = [...argsArray]

    for(let idx in argsArray){
        const arg = argsArray[idx]

        //if flag is not valid
        if(arg[0] === '-' && !isValidFlag(arg))
            return {conflict: true, reason: 'Invalid flag'}

        //If is not a flag
        if(arg[0] !== '-' ){
            const prevArg = argsArray[Number(idx) - 1]
            if(prevArg[0] === '-'){ //If previous argument was a flag
                if(!isValidValue(prevArg, arg)) //If argument is not a valid value
                    return {conflict: true, reason: 'Invalid value'}
            }
            else
                return {conflict: true, reason: 'Unknown argument'}

        }

        //Avoids having function and class flags simultaneously
        if(VALID_ARGS.function.flags.includes(arg) || VALID_ARGS.class.flags.includes(arg)){
            const functionAndClassFlags = [...VALID_ARGS.function.flags, ...VALID_ARGS.class.flags]
            const rgx = new RegExp(`(?<=(\s|))(${functionAndClassFlags.join('|')})(?=(\s|))`, 'g')
            if(argsArray.join(' ').match(rgx).length > 1)
                return {conflict: true, reason: 'Only one function flag or one class flag is allowed'}
        }

        //Avoids duplicating flags
        const rgx = new RegExp(`(?<=(\\s|))${arg}(?=(\\s|))`, 'g')
        if(argsArray.join(' ').match(rgx).length > 1)
            return { conflict: true, reason: 'Duplicated flag'}
    }

    return {conflict: false}
}

const getFlagValue = (argsArray, flag, validArg) => {
    const foundValue = argsArray[argsArray.indexOf(flag) + 1]
    const value = (foundValue === undefined || foundValue[0] === '-') && !validArg.valueRequired
        ? validArg.validValues[0] : foundValue
    return { value, valid: validArg.validValues.includes(value)}
}

/**
 * 
 * @param {string} argsString 
 * @param {{}} validArgToFind 
 */
const hasArg = (argsArray, validArgToFind) => {

    if(!validArgToFind)
        throw new Error('Argument to find is not valid')

    for(let flag of validArgToFind.flags){

        for(let arg of argsArray){

            if(arg === flag){
                //If found flag is styles or fileCase
                if(VALID_ARGS.styles.flags.includes(flag) || VALID_ARGS.fileCase.flags.includes(flag)) {
                    const {value, valid: validValue} = getFlagValue(argsArray, flag, VALID_ARGS.styles)
                    return { found: true , value, validValue, flag }
                }
                
                return { found: true, value: validArgToFind.value, flag }
            }
        }
    }

    return false
}

module.exports = {
    hasArg,
    VALID_ARGS,
    validateConflicts,
    validFlags
}