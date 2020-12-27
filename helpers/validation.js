const {indexString, fnComponentString, classComponentString} = require('./content');
const readline = require('readline-sync');
const fs = require('fs');

module.exports = {
    options: (args) => {

        let selectedStyle;

        //if -s exists 
        if(args.includes('-s')) {

            //if user specified a styles language, it is converted to lower case. Else it will be css
            selectedStyle = args[args.indexOf('-s') + 1] ? args[args.indexOf('-s') + 1].toLowerCase() : 'css'

            if(!['css','sass','scss','less'].includes(selectedStyle))
                throw Error('Please select a valid styles language (css, sass, scss, less)');
        }

        return {
            componentContent: (args.includes('-f') && fnComponentString) || (args.includes('-c') && classComponentString) || fnComponentString,
            indexString: args.includes('-i') ? indexString : undefined,
            selectedStyle: selectedStyle
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