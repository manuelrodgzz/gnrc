const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const VALID_ARGS = require('../bin/helpers/validArgs');

const execConfig =
  process.platform === 'win32' ? { shell: 'powershell.exe' } : undefined;

const deleteFiles = (path) => {
  if (process.platform === 'win32')
    execSync('del components -Force -Recurse', execConfig);
  else execSync(`rm -r ${path}`);
};

function fileExistsWithCaseSync(filepath) {
  const pathArray = filepath.split('/');

  try {
    return fs.readdirSync(pathArray.slice(0,pathArray.length-1).join('/')).includes(pathArray[pathArray.length-1])
  }
  catch(e){
    return false
  }
}

/**
 *
 * @param {{folderPath: string, componentFile: {path: string, type: string, hooks: [string]}, indexPath: string, stylePath: string}} component
 */
const filesExist = (component) => {
  const result = {};

  //Check if folder, component file, index and style file exist
  result.folder = fileExistsWithCaseSync(component.folderPath);
  result.file = fileExistsWithCaseSync(component.componentFile.path);
  result.index = fileExistsWithCaseSync(component.indexPath);
  result.style = fileExistsWithCaseSync(component.stylePath);

  //If component file exist, it's content is read and checks if it was created correctly
  if (result.file) {
    const cat = execSync(`cat ${component.componentFile.path}`, execConfig);

    result.file = (() => {
      let fileOk = true;

      //If style file was created, check if component file imports this styles
      if (result.style) fileOk = cat.includes('import styles');

      if (!fileOk) return fileOk;

      //Check if component file was created with the correct type (function or class)
      if (component.componentFile.type === 'function')
        fileOk = cat.includes('const MyComponent');
      else fileOk = cat.includes('class MyComponent');

      if (
        component.componentFile.hooks &&
        component.componentFile.hooks.length > 0
      )
        fileOk = cat.includes(
          `import React, {${component.componentFile.hooks.join(
            ', '
          )}} from 'react'`
        );

      return fileOk;
    })();
  }

  return result;
};

/**
 *
 * @param {boolean} folderShouldExist
 * @param {boolean} fileShouldExist
 * @param {boolean} indexShouldExist
 * @param {boolean} styleShouldExist
 */
const createExpected = (
  folderShouldExist,
  fileShouldExist,
  indexShouldExist,
  styleShouldExist
) => ({
  folder: folderShouldExist,
  file: fileShouldExist,
  index: indexShouldExist,
  style: styleShouldExist,
});

const createConfigExpected = (
  fileCase,
  componentType,
  styles,
  stylesLanguage,
  stylesModule,
  componentFolder,
  createIndex
) => ({
  fileCase,
  componentType,
  styles,
  stylesLanguage,
  stylesModule,
  componentFolder,
  createIndex,
});

const deleteSrcAndComponents = () => {
  if (fs.existsSync('./components')) deleteFiles('components');

  if (fs.existsSync('./src')) deleteFiles('src');
};

describe('Testing component generation with default config', function () {
  this.timeout(5000);

  afterEach(() => {
    deleteSrcAndComponents();
  });

  it('Creating functional component with index and css file', (done) => {
    const expected = createExpected(true, true, true, true);

    execSync('node bin MyComponent -i -s');

    const actual = filesExist({
      folderPath: './components/MyComponent',
      componentFile: {
        path: './components/MyComponent/MyComponent.js',
        type: 'function',
      },
      indexPath: './components/MyComponent/index.js',
      stylePath: './components/MyComponent/MyComponent.module.css',
    });

    assert.deepStrictEqual(actual, expected);
    done();
  });

  it('Creating class component with sass file', (done) => {
    const expected = createExpected(true, true, false, true);

    execSync('node bin MyComponent -c -s sass');

    const actual = filesExist({
      folderPath: './components/MyComponent',
      componentFile: {
        path: './components/MyComponent/MyComponent.js',
        type: 'class',
      },
      indexPath: './components/MyComponent/index.js',
      stylePath: './components/MyComponent/MyComponent.module.sass',
    });

    assert.deepStrictEqual(actual, expected);
    done();
  });

  it('Creating functional component explicitly with path, less file and without folder', (done) => {
    const expected = createExpected(false, true, false, true);

    execSync('node bin ./components/MyComponent -f -s less --no-folder');

    const actual = filesExist({
      folderPath: './components/MyComponent',
      componentFile: {
        path: './components/MyComponent.js',
        type: 'function',
      },
      indexPath: './components/index.js',
      stylePath: './components/MyComponent.module.less',
    });

    assert.deepStrictEqual(actual, expected);
    done();
  });

  it('Creating functional component with useState and useEffect hooks', (done) => {
    const expected = createExpected(true, true, false, false);

    execSync('node bin MyComponent --state --effect');

    const actual = filesExist({
      folderPath: './components/MyComponent',
      componentFile: {
        path: './components/MyComponent/MyComponent.js',
        type: 'function',
        hooks: ['useState', 'useEffect'],
      },
      indexPath: './components/MyComponent/index.js',
      stylePath: './components/MyComponent/MyComponent.module.css',
    });

    assert.deepStrictEqual(actual, expected);
    done();
  });

  it('Creating class component with index when src folder exist', (done) => { 
    const expected = createExpected(true, true, true, false);

    execSync('mkdir src');
    execSync('node bin MyComponent -c -i');

    const actual = filesExist({
      folderPath: './src/components/MyComponent',
      componentFile: {
        path: './src/components/MyComponent/MyComponent.js',
        type: 'class',
      },
      indexPath: './src/components/MyComponent/index.js',
      stylePath: './components/MyComponent/MyComponent.module.css',
    });

    assert.deepStrictEqual(actual, expected);
    done();
  });
});

describe('Testing component generation with configuration modifications', function () {
  this.timeout(5000);

  afterEach(() => deleteSrcAndComponents());

  it('Updating config file to fileCase: camel, type: class, styles: true, stylesLanguage: scss, module: false, folder: false, index: true', (done) => {
    const expected = createConfigExpected(
      'camel',
      'class',
      true,
      'scss',
      false,
      false,
      true
    );

    execSync(
      'node bin --config --file-case camel -t class -s true --style-language scss -m false --folder false -i true'
    );
    const actual = require('../bin/config.json');
    assert.deepStrictEqual(actual, expected);
    done();
  });

  it('Creating class component after config was updated', (done) => {
    const expected = createExpected(false, true, true, true);

    execSync('node bin MyComponent');
    const actual = filesExist({
      folderPath: './components/myComponent',
      componentFile: {
        path: './components/myComponent.js',
        type: 'class',
      },
      indexPath: './components/index.js',
      stylePath: './components/myComponent.scss',
    });

    assert.deepStrictEqual(actual, expected);
    done();
  });

  it('Creating functional component with folder, styles module and without index file', (done) => {
    const expected = createExpected(true, true, false, true);

    execSync('node bin MyComponent -f --no-index -m --folder');
    const actual = filesExist({
      folderPath: './components/myComponent',
      componentFile: {
        path: './components/myComponent/myComponent.js',
        type: 'function',
      },
      indexPath: './components/myComponent/index.js',
      stylePath: './components/myComponent/myComponent.module.scss',
    });

    assert.deepStrictEqual(actual, expected);
    done();
  });

  it('Creating class component with pascal case and without styles', (done) => {
    const expected = createExpected(false, true, true, false);

    execSync('node bin MyComponent --no-style --file-case pascal');
    const actual = filesExist({
      folderPath: './components/MyComponent',
      componentFile: {
        path: './components/MyComponent.js',
        type: 'class',
      },
      indexPath: './components/index.js',
      stylePath: './components/MyComponent.scss',
    });

    assert.deepStrictEqual(actual, expected);
    done();
  });

  it('Creating functional component with camel case and with no module styles', (done) => {
    const expected = createExpected(false, true, true, true);

    execSync('node bin MyComponent -f -s --no-module --file-case camel');
    const actual = filesExist({
      folderPath: './components/myComponent',
      componentFile: {
        path: './components/myComponent.js',
        type: 'function'
      },
      indexPath: './components/myComponent.js',
      stylePath: './components/myComponent.scss'
    })

    assert.deepStrictEqual(actual, expected);
    done();
  })

  after(() =>
    fs.writeFileSync(
      path.resolve(__dirname, '../bin/config.json'),
      require('../bin/helpers/content').config
    )
  );
});

describe('Testing extra commands', function () {
  it('Show help', (done) => {
    const output = execSync('node bin -h').toString();

    assert.match(output, /gnrc usage/g);
    done();
  });

  it('Show config help', (done) => {
    const output = execSync('node bin --config -h').toString();

    assert.match(output, /Default config options/g);
    done();
  });

  it('Show current config', (done) => {
    const output = execSync('node bin --config').toString();

    Object.keys(VALID_ARGS.config.arguments).every((key) =>
      output.includes(key)
    )
      ? assert.ok(output)
      : assert.fail(output);
    done();
  });

  it('Show version', (done) => {
    const output = execSync('node bin -v').toString();

    assert.match(output, /v\d.\d.\d/g);
    done();
  });
});
