#!/usr/bin/env node
const fs = require('fs');
const updateNotifier = require('update-notifier');
const {message, getOptions, createFiles} = require('./helpers')
const data = require('./data.json')
const pkg = require('../package.json');
const userArgs = process.argv.slice(2);
const notifier = updateNotifier({pkg, updateCheckInterval: 0});

let options
try {
    options = getOptions(userArgs)
}
catch(err) {
    message.yellow(err.message)
    return
}

if(options.help)
    return console.log(data.help.join('\r\n'));

if(options.version)
    return message.normal(`v${pkg.version}`)

try {
    createFiles(options)
}
catch(err){
    message.red(err)
    return
}

notifier.notify({isGlobal: true});