let cosmetic = require('cosmetic'),
  emporium = require('../emporium'),
  Shortcut = emporium.models.Shortcut,
  helpers = require('../helpers'),
  getDirectory = helpers.getDirectory,
  abbreviateDirectory = helpers.abbreviateDirectory;

module.exports = async (err, options) => {
  if (err) {
    console.log(`${cosmetic.red('Error:')} ${err}`);
    return;
  };
  let query = {_sort: {name: 1}};
  if (options.dir) query._sort = {dir: 1};
  let shortcuts = await Shortcut.fetch(query);
  let dir;
  if (options.dir) {
    dir = await getDirectory(options.dir);
    for (let i = 0; i < shortcuts.length; i++) {
      if (!shortcuts[i].dir.includes(dir)) {
        shortcuts.shift(i);
        i--;
      };
    };
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
    table.push([shortcut.name, abbreviateDirectory(shortcut.dir)]);
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
        line += `    ${string}`;
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
