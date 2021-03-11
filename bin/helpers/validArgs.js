const validStylesLanguages = ['css', 'sass', 'scss', 'less'];

const VALID_ARGS = {
  path: {
    flags: [],
  },
  function: {
    flags: ['-f'],
    conflictId: 'component',
  },
  class: {
    flags: ['-c'],
    conflictId: 'component',
  },
  index: {
    flags: ['-i'],
    conflictId: 'index',
  },
  noIndex: {
    flags: ['--no-index'],
    conflictId: 'index',
  },
  config: {
    flags: ['--config'],
    arguments: {
      fileCase: {
        flags: ['--file-case'],
        validValues: ['pascal', 'camel'],
      },
      componentType: {
        flags: ['--component-type', '--type', '-t'],
        validValues: ['function', 'class'],
      },
      styles: {
        flags: ['-s', '--styles', '--style'],
        validValues: ['true', 'false'],
      },
      stylesLanguage: {
        flags: ['--styles-language', '--style-language'],
        validValues: validStylesLanguages,
      },
      stylesModule: {
        flags: ['--module', '-m'],
        validValues: ['true', 'false'],
      },
      componentFolder: {
        flags: ['--folder'],
        validValues: ['true', 'false'],
      },
      createIndex: {
        flags: ['-i', '--index'],
        validValues: ['true', 'false'],
      },
    },
  },
  styles: {
    flags: ['-s', '--styles', '--style'],
    validValues: validStylesLanguages,
    conflictId: 'styles',
  },
  noStyles: {
    flags: ['--no-styles', '--no-style'],
    conflictId: 'styles',
  },
  help: {
    flags: ['-h', '--help'],
    validationIgnorer: true,
  },
  folder: {
    flags: ['--folder'],
    conflictId: 'folder',
  },
  noFolder: {
    flags: ['--no-folder'],
    conflictId: 'folder',
  },
  state: {
    flags: ['--state'],
  },
  effect: {
    flags: ['--effect'],
  },
  fileCase: {
    flags: ['--file-case'],
    validValues: ['camel', 'pascal'],
    valueRequired: true,
  },
  module: {
    flags: ['-m', '--module'],
    conflictId: 'module',
  },
  noModule: {
    flags: ['--no-module'],
    conflictId: 'module',
  },
  version: {
    flags: ['-v', '--version'],
    validationIgnorer: true,
  },
};

module.exports = VALID_ARGS;
