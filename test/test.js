const assert = require('assert');
const mock = require('mock-fs');
const fs = require('fs');
const {spawnSync, execSync, exec} = require('child_process')

describe('Testing component generation', () => {

    /**
     * 
     * @param {{folderPath: string, componentFile: {path: string, type: string}, indexPath: string, stylePath: string}} component 
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
            const cat = execSync(`cat ${component.componentFile.path}`, {shell: 'powershell.exe'})

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

                return fileOk
            })()
        }

        return result
    }

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
            execSync('del components -Force -Recurse', {shell: 'powershell.exe'})
    })

    it('Creating functional component with index and css file', (done) => {

        const expected = {
            folder: true,
            file: true,
            style: true,
            index: true
        }

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

        const expected = {
            folder: true,
            file: true,
            index: false,
            style: true
        }

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

        const expected = {
            folder: false,
            file: true,
            index: false,
            style: true
        }

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
});