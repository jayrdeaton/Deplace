let cosmetic = require('cosmetic'),
  { existsSync } = require('fs'),
  { resolve } = require('path'),
  { Shortcut } = require('../emporium'),
  { abbreviateDirectory } = require('../helpers');

module.exports = async (options) => {
  let dir;
  let shortcuts;
  if (options.dir) {
    dir = resolve(options.dir);
    shortcuts = await Shortcut.get({ filter: { dir: new RegExp(dir, 'i') }, sort: { dir: 1 } });
  } else {
    shortcuts = await Shortcut.get({ sort: { name: 1 } });
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
    let line = [shortcut.name, abbreviateDirectory(shortcut.dir)];
    if (!existsSync(shortcut.dir)) line.push(cosmetic.red('Broken'));
    table.push(line);
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
      if (index !== array.length - 1 && padding[index] && padding[index] !== string.length) {
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
