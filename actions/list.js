let cosmetic = require('cosmetic'),
  { existsSync } = require('fs'),
  { resolve } = require('path'),
  emporium = require('../emporium'),
  Shortcut = emporium.models.Shortcut,
  { abbreviateDirectory } = require('../helpers');

module.exports = async (err, options) => {
  if (err) return console.log(`${cosmetic.red(err.name)} ${err.message}`);
  let dir;
  let shortcuts;
  if (options.dir) {
    dir = resolve(options.dir).toLowerCase();
    shortcuts = await Shortcut.fetch().filter({ dir: new RegExp(dir) }).sort({dir: 1});
  } else {
    shortcuts = await Shortcut.fetch().sort({name: 1});
  };
  if (shortcuts.length === 0) {
    if (dir) {
      console.log(`No shortcuts found within ${cosmetic.cyan(abbreviateDirectory(dir))}`);
    } else {
      console.log('No shortcuts found');
    };
    return;
  } else {
    let pluralization = 'shortcut';
    if (shortcuts.length > 1) pluralization += 's';
    if (dir) console.log(`${shortcuts.length} ${pluralization} found within ${cosmetic.cyan(abbreviateDirectory(dir))}`);
  }
  let table = [];
  for (let shortcut of shortcuts) {
    let broken = '';
    if (!existsSync(shortcut.dir)) broken = ' Broken'
    table.push([shortcut.name, abbreviateDirectory(shortcut.dir), cosmetic.red(broken)]);
  };
  let padding = {};
  for (let array of table) {
    for (let [index, string] of array.entries()) {
      if (index !== array.length - 1 && (!padding[index] || string.length > padding[index])) {
        padding[index] = string.length;
      };
    };
  };
  let lines = [''];
  for (let array of table) {
    let line;
    for (let [index, string] of array.entries()) {
      if (padding[index] && padding[index] !== string.length) {
        while (string.length < padding[index]) string += ' ';
      };
      if (line) {
        line += `  ${string}`;
      } else {
        line = cosmetic.cyan(string);
      };
    };
    lines.push(line);
  };
  lines.push('');
  for (let line of lines) {
    console.log(line);
  };
};
