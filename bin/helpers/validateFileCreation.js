const readline = require('readline-sync');
const fs = require('fs');

module.exports = (file) => {

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