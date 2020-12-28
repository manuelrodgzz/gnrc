# Generate New React Component (gnrc)
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

Save your time and generate your react components in a simple and fast way.

## Command
`gnrc <path> [{-f | -c}] [-i] [-s [<language>]]`

*If only component name is specified instead of the whole path, the component will be created in components folder*

## Flags table
| Flag | Description | Default |
|-----:|:-----------:|:--------|
|  -f  | The new component will be a functional component | Yes |
|  -c  | The new component will be a class component | No |
|  -i  | Generates an extra index file which will export the new component | No |
|  -s \<language\>  | Generates a styles sheet file. If no laguange is specified, a css file will be generated | No |

## Supported styles languages
- css
- scss
- sass
- less

## Example 1
`gnrc MyComponent -i -s`
```
.
+-- components
|   +-- MyComponent
|       +-- MyComponent.js //functional component
|       +-- index.js
|       +-- MyComponent.module.css
```

## Example 2
`gnrc components/NewFolder/MyComponent -c -s sass`
```
.
+-- components
|   +-- NewFolder
|       +-- MyComponent
|           +-- MyComponent.js //class component
|           +-- MyComponent.module.sass
```

[forks-shield]: https://img.shields.io/github/forks/manuelrodgzz/gnrc
[forks-url]: https://github.com/manuelrodgzz/gnrc/network/members
[stars-shield]: https://img.shields.io/github/stars/manuelrodgzz/gnrc
[stars-url]: https://github.com/manuelrodgzz/gnrc/stargazers
[issues-shield]: https://img.shields.io/github/issues/manuelrodgzz/gnrc
[issues-url]: https://github.com/manuelrodgzz/gnrc/issues
[license-shield]: https://img.shields.io/github/license/manuelrodgzz/gnrc
[license-url]: https://github.com/manuelrodgzz/gnrc/blob/main/LICENSE.md
