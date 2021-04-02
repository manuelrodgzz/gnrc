# Generate New React Component (gnrc)

[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

Save your time and generate your react components in a simple and fast way.

**3.0.0 - New configuration feature.** Set your default component generation preferences such as styles language, index file, styles modules, etc.

## Installation

`npm i -g gnrc`

## Command

`gnrc {<path> | <component name>} [{-f | -c}] [-i] [{--no-folder | --folder}] [{-s [<language>] | --no-styles}] [{-m | --no-module}] [--file-case <case>] [--state] [--effect]`

If only component name is specified instead of path:

- **Case _src_ folder exists:** The component will be created in _components_ folder inside of _src_ folder
- **Case _src_ folder does not exist:** The component will be created in _components_ folder

## Options table

|            Flag                           |                                       Description                                                 |
| -----------------------------------------:| :------------------------------------------------------------------------------------------------:|
|           -f                              |                       The new component will be a functional component                            |
|           -c                              |                       The new component will be a class component                                 |
|           --config                        |                       Shows default configuration for components creation                         |
|           --config &lt;options>           |                       Overwrites the default configuration for components creation                |
|           -i                              |                       Generates an extra index file which will export the new component           |
| -s &lt;language>, --styles &lt;language>  | Generates a styles sheet file. If no laguange is specified, a css file will be generated          |
|           --no-styles                     |                       Avoids creation of styles file                                              |
|           -h, --help                      |                       Shows usage                                                                 |
|           --folder                        |                       The component will have it's own folder                                     |
|           --no-folder                     |                       The componet will not have it's own folder                                  |
|           --state                         |                       Imports useState hook when component is functional                          |
|           --effect                        |                       Imports useEffect hook when component is functional                         |
|           --file-case &lt;case>           |                       Case that will be used when naming new files                                |
|           --module                        |                       Styles file will be a module                                                |
|           --no-module                     |                       Styles file will not be a module                                            |
|           -v, --version                   |                       Shows current gnrc version                                                  |
## Config options table
|            Flag                                               |                                       Description                                     |
| ------------------------------------------------------------: | :------------------------------------------------------------------------------------:|
|       --file-case &lt;case>                                   |       Default case that will be used when naming new files (camel or pascal)          |
|   --component-type &lt;type>, --type &lt;type>, -t &lt;type>  |       Default type of component (function or class)                                   |
|       -s &lt;boolean>, --styles &lt;boolean>                  |       Styles file should be created? (true or false)                                  |
|       --styles-language &lt;language>                         |       Default styles language                                                         |
|       --module &lt;boolean>, -m &lt;boolean>                  |       Styles files should be modules? (true or false)                                 |
|       --folder &lt;boolean>                                   |       Folder should be created for new components? (true or false)                    |
|       -i &lt;boolean>, --index &lt;boolean>                   |       Index file should be created? (true or false)                                   |

## Supported casing for files

- camel
- pascal

## Supported styles languages

- css
- scss
- sass
- less

# Component generation examples

## Example 1

_src folder exist_

`gnrc MyComponent -i -s --file-case camel`

```
.
+-- src
    +-- components
|       +-- myComponent
|           +-- myComponent.js //functional component
|           +-- index.js
|           +-- myComponent.module.css
```

## Example 2

_src folder does not exist_

`gnrc ./components/MyComponent -c --no-folder -s sass --no-module`

```
.
+-- components
|    +-- MyComponent.js //class component
|    +-- MyComponent.sass
```

# Changing default configuration example
```
gnrc --config -m false --type class //set configuration to "no styles modules" and "class components"
gnrc --config //show current configuration
[ gnrc ] :    {
 fileCase: "pascal",
 componentType: "class",
 styles: false,
 stylesLanguage: "css",
 stylesModule: false,
 componentFolder: true,
 createIndex: false
}
```

[forks-shield]: https://img.shields.io/github/forks/manuelrodgzz/gnrc
[forks-url]: https://github.com/manuelrodgzz/gnrc/network/members
[stars-shield]: https://img.shields.io/github/stars/manuelrodgzz/gnrc
[stars-url]: https://github.com/manuelrodgzz/gnrc/stargazers
[issues-shield]: https://img.shields.io/github/issues/manuelrodgzz/gnrc
[issues-url]: https://github.com/manuelrodgzz/gnrc/issues
[license-shield]: https://img.shields.io/github/license/manuelrodgzz/gnrc
[license-url]: https://github.com/manuelrodgzz/gnrc/blob/main/LICENSE.md
