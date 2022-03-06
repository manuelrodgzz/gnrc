const toCase = require('./toCase');

const index = (componentName) => `export {default} from './${componentName}'`;

const fnComponent = (componentName, stylesFile, hooks) => {
  componentName = toCase(componentName, 'pascal');
  return `import React${
    hooks.length > 0 ? `, {${hooks.join(', ')}} ` : ' '
  }from 'react'
${stylesFile ? `import styles from './${stylesFile}'\r\n` : ''}
const ${componentName} = (props) => {
    return(
        <div>${componentName} is working!</div>
    )
}

export default ${componentName}`;
};

const classComponent = (componentName, stylesFile) => {
  componentName = toCase(componentName, 'pascal');
  return `import React from 'react'
${stylesFile ? `import styles from './${stylesFile}'\r\n` : ''}
class ${componentName} extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div>${componentName} is working!</div>
        )
    }
}

export default ${componentName}`;
};

const config = JSON.stringify(
  {
    componentType: 'function',
    styles: false,
    stylesLanguage: 'css',
    stylesModule: true,
    componentFolder: true,
    createIndex: false,
  },
  undefined,
  1
);

module.exports = {
  index,
  fnComponent,
  classComponent,
  config,
};
