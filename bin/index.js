#!/usr/bin/env node

const fs = require('fs')
const message = require('./helpers/message')
const validation = require('./helpers/validation');
const pkg = require('../package.json');
const updateNotifier = require('update-notifier');
const args = process.argv.slice(2);

if(args[0] && (args[0] === '-h' || args[0] === '--help')){
    
    return console.log(`
    gnrc usage:
    
    gnrc {<path> | <component name>} [{-f | -c}] [-i] [--no-folder] [-s [<language>]] [--state] [--effect]
    
        Option     |                Description
    -f  (default)   The new component will be a functional component
    -c              The new component will be a class component
    -i              Generates an extra index file which will export the new component
    -s <language>   Generates a styles sheet file. If no laguange is specified, a css file will be generated
    -h, --help      Shows usage
    --no-folder     The componet will not have it's own folder
    --state         Imports useState hook when component is functional
    --effect        Imports useEffect hook when component is functional	
    `);
}

const path = args[0];

if(!path || path[0] === '-'){
    message.yellow('Component path was not specified');
    return
}

let options;
try{ options = validation.options(args); }
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

    if(!args.includes('--no-folder'))
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

const notifier = updateNotifier({pkg, updateCheckInterval: 0});

notifier.notify({isGlobal: true});