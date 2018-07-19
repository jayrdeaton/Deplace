let cosmetic = require('cosmetic'),
  stringLength = require('string-length'),
  padString = require('./padString');

module.exports = (array, keys) => {
  let padding = {};

  if (keys) for (let [index, key] of keys.entries())if (!padding[index] || stringLength(key) > padding[index]) padding[index] = stringLength(key);

  for (let row of array) for (let [index, cell] of row.entries()) if (cell !== null && (!padding[index] || stringLength(cell) > padding[index])) padding[index] = stringLength(cell);

  if (keys) {
    let string = '';
    for (let [index, key] of keys.entries()) {
      string += padString(key, padding[index]);
      if (index !== keys.length - 1) string += '  ';
    };
    console.log(cosmetic.underline(string));
  };

  for (let row of array) {
    let string = '';
    for (let [index, cell] of row.entries()) {
      if (cell === null) cell = '';
      string += padString(cell, padding[index]);
      if (index !== row.length - 1) string += '   ';
    };
    console.log(string);
  };
};
