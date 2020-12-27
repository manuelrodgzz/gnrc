# new-comp
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

Save your time and generate your react components in a simple and fast way.

## Command
`new-comp <path> [{-f | -c}] [-i] [-s [<language>]]`

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
`new-comp MyComponent -i -s`
```
.
+-- components
|   +-- MyComponent
|       +-- MyComponent.js //functional component
|       +-- index.js
|       +-- MyComponent.module.css
```

## Example 2
`new-comp components/NewFolder/MyComponent -c -s sass`
```
.
+-- components
|   +-- NewFolder
|       +-- MyComponent
|           +-- MyComponent.js //class component
|           +-- MyComponent.module.sass
```

[forks-shield]: https://img.shields.io/github/forks/manuelrodgzz/new-comp
[forks-url]: https://github.com/manuelrodgzz/new-comp/network/members
[stars-shield]: https://img.shields.io/github/stars/manuelrodgzz/new-comp
[stars-url]: https://github.com/manuelrodgzz/new-comp/stargazers
[issues-shield]: https://img.shields.io/github/issues/manuelrodgzz/new-comp
[issues-url]: https://github.com/manuelrodgzz/new-comp/issues
[license-shield]: https://img.shields.io/github/license/manuelrodgzz/new-comp
[license-url]: https://github.com/manuelrodgzz/new-comp/blob/main/LICENSE.md
