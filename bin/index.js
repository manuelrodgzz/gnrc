#!/usr/bin/env node

const fs = require('fs');
const {message, validation, getConfig, hasArg, VALID_ARGS} = require('./helpers')
const data = require('./data.json')
const pkg = require('../package.json');
const updateNotifier = require('update-notifier');
const userArgs = process.argv.slice(2);

const isDevelopment = process.env.NODE_ENV === 'development' ? true : false
const notifier = updateNotifier({pkg, updateCheckInterval: 0});

let config

try {
    config = getConfig(userArgs)
}
catch(err) {
    message.red(err.message)
}


if(hasArg(userArgs, VALID_ARGS.help)){
    
    return console.log(data.help.join('\r\n'));``
}

const path = userArgs[0];

if(!path || path[0] === '-'){
    message.yellow('Component path was not specified');
    return
}

let options;
try{ options = validation.options(userArgs); }
catch(err) {
    message.red(err.message);
    return
}


const pathArray = path.split('/');
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

    if(!userArgs.includes('--no-folder'))
        dir += `/${componentName}`

    return dir
})();

if(!fs.existsSync(dirToCreate))
    fs.mkdirSync(dirToCreate, {recursive: true});


let file
//Component file is created
try{
    file = `${dirToCreate}/${componentName}.js`

    const createFile = validation.fileExists(file)

    if(createFile){
        fs.writeFileSync(file, options.componentContent(componentName));
        message.green(`${componentName}.js was created successfully!`);
    }
}
catch(err){
    message.red(`Error while trying to create ${file}.\r\n${err.message}`);
    return
}

//index file is created if user wanted it
if(options.indexString) {
    try{
        file = `${dirToCreate}/index.js`
        const createFile = validation.fileExists(file)
        if(createFile) {
            fs.writeFileSync(file, options.indexString(componentName));
            message.green('index.js was created successfully!');
        }
    }
    catch(err){
        message.red(`Error while trying to create ${file}.\r\n${err.message}`);
        return
    }
}

//styles file is created if user wanted it
if(options.selectedStyle) {
    try{
        file = `${dirToCreate}/${componentName}.module.${options.selectedStyle}`

        const createFile = validation.fileExists(file)

        if(createFile){
            fs.writeFileSync(file, '');
            message.green(`${componentName}.${options.selectedStyle} was created successfully!`);
        }
    }
    catch(err){
        message.red(`Error while trying to create ${file}.\r\n${err.message}`);
        return
    }
}

notifier.notify({isGlobal: true});