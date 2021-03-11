/* eslint-disable no-console */
const colours = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m',
  },
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m',
  },
};

const me = `[ gnrc ] : `;

const green = (text) =>
  console.log(
    colours.dim,
    me,
    colours.reset,
    colours.fg.green,
    text,
    colours.reset
  );
const yellow = (text) =>
  console.log(
    colours.dim,
    me,
    colours.reset,
    colours.fg.yellow,
    text,
    colours.reset
  );
const red = (text) =>
  console.log(
    colours.dim,
    me,
    colours.reset,
    text,
    colours.fg.red,
    colours.reset
  );
const normal = (text) => console.log(colours.dim, me, colours.reset, text);

module.exports = {
  green,
  yellow,
  red,
  normal,
  colours,
  me,
};
