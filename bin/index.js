#!/usr/bin/env node

/**Main function */
const gnrc = () => {
    const {message, getOptions, createComponentFiles} = require('./helpers')
    const updateNotifier = require('update-notifier');
    const data = require('./data.json')
    const pkg = require('../package.json');
    const userArgs = process.argv.slice(2);
    const notifier = updateNotifier({pkg, updateCheckInterval: 0});

    let options
    try {
        options = getOptions(userArgs)
    }
    catch(err) {
        message.yellow(err)
        return
    }

    if(options.config){
        return
    }

    if(options.help)
        return console.log(data.help.join('\r\n'));

    if(options.version)
        return message.normal(`v${pkg.version}`)

    try {
        createComponentFiles(options)
    }
    catch(err){
        message.red(err)
        return
    }

    notifier.notify({isGlobal: true});
}

const validateConfigFile = () => {
    const {createConfigFile} = require('./helpers/createFiles')
    const fs = require('fs')

    if(!fs.existsSync(`${__dirname}/config.json`)){
        createConfigFile(__dirname)
        gnrc()
    }
}

try{
    validateConfigFile()
    gnrc()
}
catch(err) {
    console.log(err)
}