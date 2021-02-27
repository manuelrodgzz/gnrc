const assert = require('assert');
const fs = require('fs');
const {execSync} = require('child_process');

describe('Testing component generation', function() {

    const execConfig = process.platform === 'win32' ? {shell: 'powershell.exe'} : undefined
    this.timeout(5000)

    const deleteFiles = (path) => {

        if(process.platform === 'win32')
            execSync('del components -Force -Recurse', execConfig);
        else
            execSync(`rm -r ${path}`);
    }

    /**
     * 
     * @param {{folderPath: string, componentFile: {path: string, type: string, hooks: [string]}, indexPath: string, stylePath: string}} component 
     */
    const filesExist = (component) => {
        const result = {}

        //Check if folder, component file, index and style file exist
        result.folder = fs.existsSync(component.folderPath)
        result.file = fs.existsSync(component.componentFile.path)
        result.index = fs.existsSync(component.indexPath)
        result.style = fs.existsSync(component.stylePath)
        
        //If component file exist, it's content is read and checks if it was created correctly
        if(result.file){            
            const cat = execSync(`cat ${component.componentFile.path}`, execConfig)

            result.file = (() => {
                let fileOk = true

                //If style file was created, check if component file imports this styles
                if(result.style)
                    fileOk = cat.includes('import styles')

                if(!fileOk)
                    return fileOk

                //Check if component file was created with the correct type (function or class)
                if(component.componentFile.type === 'function')
                    fileOk = cat.includes('const MyComponent')
                else
                    fileOk = cat.includes('class MyComponent')

                if(component.componentFile.hooks && component.componentFile.hooks.length > 0)
                    fileOk = cat.includes(`import React, {${component.componentFile.hooks.join(', ')}} from 'react'`)

                return fileOk
            })()
        }

        return result
    }

    /**
     * 
     * @param {boolean} folderShouldExist 
     * @param {boolean} fileShouldExist 
     * @param {boolean} indexShouldExist 
     * @param {boolean} styleShouldExist 
     */
    const createExpected = (folderShouldExist, fileShouldExist, indexShouldExist, styleShouldExist) => ({
        folder: folderShouldExist,
        file: fileShouldExist,
        index: indexShouldExist,
        style: styleShouldExist
    }) 

    beforeEach(() => {

        component = {
            folder: false,
            file: false,
            style: false,
            index: false
        }
    })

    afterEach(() => {
        if(fs.existsSync('./components'))
            deleteFiles('components')
        
        if(fs.existsSync('./src'))
            deleteFiles('src')
    })

    it('Creating functional component with index and css file', (done) => {

        const expected = createExpected(true, true, true, true)

        execSync('node bin MyComponent -i -s')

        const actual = filesExist({
            folderPath: './components/MyComponent', 
            componentFile: {path: './components/MyComponent/MyComponent.js', type: 'function'}, 
            indexPath: './components/MyComponent/index.js',
            stylePath: './components/MyComponent/MyComponent.module.css'
        })

        assert.deepStrictEqual(actual, expected)
        done()
    })

    it('Creating class component with sass file', (done) => {

        const expected = createExpected(true, true, false, true)

        execSync('node bin MyComponent -c -s sass')

        const actual = filesExist({
            folderPath: './components/MyComponent',
            componentFile: {path: './components/MyComponent/MyComponent.js', type: 'class'},
            indexPath: './components/MyComponent/index.js',
            stylePath: './components/MyComponent/MyComponent.module.sass'
        })

        assert.deepStrictEqual(actual, expected)
        done()
    })

    it('Creating functional component explicitly with path, less file and without folder', (done) => {

        const expected = createExpected(false, true, false, true)

        execSync('node bin ./components/MyComponent -f -s less --no-folder')

        const actual = filesExist({
            folderPath: './components/MyComponent',
            componentFile: {path: './components/MyComponent.js', type: 'function'},
            indexPath: './components/index.js',
            stylePath: './components/MyComponent.module.less'
        })

        assert.deepStrictEqual(actual, expected)
        done()
    })

    it('Creating functional component with useState and useEffect hooks', (done) => {

        const expected = createExpected(true, true, false, false)

        execSync('node bin MyComponent --state --effect')

        const actual = filesExist({
            folderPath: './components/MyComponent',
            componentFile: {
                path: './components/MyComponent/MyComponent.js', 
                type: 'function', 
                hooks: ['useState', 'useEffect']
            },
            indexPath: './components/MyComponent/index.js',
            stylePath: './components/MyComponent/MyComponent.module.css'
        })

        assert.deepStrictEqual(actual, expected)
        done()
    })

    it('Creating class component with index when src folder exist', (done) => {
        const expected = createExpected(true, true, true, false)

        execSync('mkdir src')
        execSync('node bin MyComponent -c -i')

        const actual = filesExist({
            folderPath: './src/components/MyComponent',
            componentFile: {
                path: './src/components/MyComponent/MyComponent.js',
                type: 'class'
            },
            indexPath: './src/components/MyComponent/index.js',
            stylePath: './components/MyComponent/MyComponent.module.css'
        })

        assert.deepStrictEqual(actual, expected)
        done()
    })
});