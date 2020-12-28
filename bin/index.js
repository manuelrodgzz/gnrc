#!/usr/bin/env node

const fs = require('fs')
const message = require('./helpers/message')
const validation = require('./helpers/validation');
const args = process.argv.slice(2)
const path = args[0]

let options 

try{ options = validation.options(args); }
catch(err) {
    message.red(err.message);
    return
}

if(!path || path[0] === '-'){
    message.yellow('Component path was not specified');
    return
}

const pathArray = path.split('/');
const componentName = pathArray[pathArray.length-1][0].toUpperCase() + pathArray[pathArray.length-1].slice(1);

const dirToCreate = `${pathArray.length > 1 
    ? './' + pathArray.slice(0,pathArray.length-1).join('/')
    : './components'}/${componentName}`;

if(!fs.existsSync(dirToCreate))
    fs.mkdirSync(dirToCreate, {recursive: true});


let file
//Component file is created
try{
    file = `${dirToCreate}/${componentName}.js`

    const createFile = validation.fileExists(file)

    if(createFile){
        fs.writeFileSync(file, options.componentContent(componentName, options.selectedStyle));
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