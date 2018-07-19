let stringLength = require('string-length');

module.exports = (string, padding) => {
  while (stringLength(string) < padding) string += ' ';
  return string;
};
