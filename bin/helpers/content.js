const indexString = (componentName) => `export {default} from './${componentName}'`

const fnComponentString = (componentName, selectedStyle) => `import React from 'react'
${selectedStyle ? `import styles from './${componentName}.module.${selectedStyle}'\r\n` : ''}
const ${componentName} = (props) => {
    return(
        <div>${componentName} is working!</div>
    )
}

export default ${componentName}`

const classComponentString = (componentName, selectedStyle) => `import React from 'react'
${selectedStyle ? `import styles from './${componentName}.module.${selectedStyle}'\r\n` : ''}
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

export default ${componentName}`

module.exports = {
    indexString,
    fnComponentString,
    classComponentString
}