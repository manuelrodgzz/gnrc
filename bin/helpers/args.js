const validArgs = {
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
        validLanguages: ['css', 'sass', 'scss', 'less']
    },
    help: {
        flags: ['-h', '--help']
    },
    noFolder: {
        flags: ['--no-folder']
    },
    state: {
        flags: ['--state']
    },
    effect: {
        flags: ['--effect']
    },
    fileCase: {
        flags: ['--file-case'],
        validCases: ['camel', 'pascal']
    },
    module: {
        flags: ['-m', '--module']
    }
}

const getFlagValue = (argsArray, flag, validValues) => {
    const foundValue = argsArray[argsArray.indexOf(flag) + 1]

    if(validValues.includes(foundValue))
        return foundValue
    else
        return 'Invalid'
}

/**
 * 
 * @param {string} argsString 
 * @param {{}} validArgToFind 
 */
const hasArg = (argsArray, validArgToFind) => {
    let stylesLanguage
    let fileCase

    for(let flag of validArgToFind.flags){

        for(let arg of argsArray){
            if(arg === flag){
                //If found flag is styles
                if(validArgs.styles.flags.includes(flag))
                    stylesLanguage = getFlagValue(argsArray, flag, validArgs.styles.validLanguages)
                else if (validArgs.fileCase.flags.includes(flag))
                    fileCase = getFlagValue(argsArray, flag, validArgs.fileCase.validCases)
                
                //Object includes stylesLanguage and fileCase props in case that found flag is styles or file-case
                return { found: true , stylesLanguage, fileCase}
            }
        }
    }

    return false
}

module.exports = {
    validArgs,
    hasArg
}