const fs = require('fs')
const {VALID_ARGS} = require('./args')
const validateFileCreation = require('./validateFileCreation')
const {index, fnComponent, classComponent} = require('./content')
const toCase = require('./toCase')
const message = require('./message')

const createFile = (dirPath, file, content) => {
    try{
        filePath = `${dirPath}/${file}`
    
        const createFile = validateFileCreation(filePath)
        
        if(!fs.existsSync(dirPath))
            fs.mkdirSync(dirPath, {recursive: true});

        if(createFile){
            fs.writeFileSync(filePath, content);
            message.green(`${file} was created successfully!`);
        }
    }
    catch(err){
        message.red(`Error while trying to create ${file}. ${err.message}`);
        return
    }
}

module.exports = (options) => {
    let pathArray = options.path.split('/')
    pathArray = pathArray.map((string, idx) => idx === pathArray.length - 1 ? toCase(string, options.fileCase) : string)
    
    options.path = pathArray.join('/')
    const hooksArray = []
    if(options.state)
        hooksArray.push('useState')

    if(options.effect)
        hooksArray.push('useEffect')

    const componentName = pathArray[pathArray.length - 1]
    const stylesFile = options.styles ? `${componentName}${options.module ? '.module' : ''}.${options.styles}` : false
    const componentFileContent = options.function ? fnComponent(componentName, stylesFile, hooksArray) : classComponent(componentName, stylesFile)
    
    createFile(options.path, `${componentName}.js`, componentFileContent)
    
    if(options.styles)
        createFile(options.path, stylesFile, '')

    if(options.index)
        createFile(options.path, 'index.js', index(componentName))
    
}