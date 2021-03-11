module.exports = (string, selectedCase) => {
  string = string
    .split('')
    .map((char, idx) =>
      idx === 0
        ? `${
            selectedCase === 'camel' ? char.toLowerCase() : char.toUpperCase()
          }`
        : char
    )
    .join('');
  return string;
};
