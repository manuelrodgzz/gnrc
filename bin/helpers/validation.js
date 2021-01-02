const {indexString, fnComponentString, classComponentString} = require('./content');
const readline = require('readline-sync');
const fs = require('fs');
const validStyles = ['css', 'less', 'sass', 'scss']
const validOptions = ['-c', '-f', '-s', '-i', '--no-folder', '--state', '--effect', ...validStyles]

module.exports = {
    options: (args) => {

        const hooks = []
        let selectedStyle;
        
        for(let i in args){
            if(!validOptions.includes(args[i]) && i !== '0')
                throw Error(`${args[i]} is not a valid argument`)
        }

        //if -s exists 
        if(args.includes('-s')) {

            //if user specified a styles language, it is converted to lower case. Else it will be css
            selectedStyle = args[args.indexOf('-s') + 1] && args[args.indexOf('-s') + 1][0] !== '-' 
                ? args[args.indexOf('-s') + 1].toLowerCase() 
                : 'css'

            if(!validStyles.includes(selectedStyle))
                throw Error('Please select a valid styles language (css, sass, scss, less)');
        }

        //Check if useState will be used
        if(args.includes('--state'))
            hooks.push('useState')

        //Check if useEffect will be used
        if(args.includes('--effect'))
            hooks.push('useEffect')

        return {
            componentContent: (componentName) => {
                if(args.includes('-c'))
                    return classComponentString(componentName, selectedStyle)
                
                return fnComponentString(componentName, selectedStyle, hooks)
            },
            indexString: args.includes('-i') ? indexString : undefined,
            selectedStyle
        }

    },
    fileExists: (file) => {

        let createFile = true

        if(fs.existsSync(file)){
            let response
            do{
                response = readline.question(`${file} already exists. Do you want to overwrite it's content? (y/n) `)
                
                createFile = response === 'y' ? true : false
            }
            while(response !== 'y' && response !== 'n')
        }

        return createFile
    }
}