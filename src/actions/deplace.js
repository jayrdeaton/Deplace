let cosmetic = require('cosmetic'),
  { existsSync } = require('fs'),
  { Shortcut } = require('../emporium'),
  { abbreviateDirectory, changeDirectory } = require('../helpers');

module.exports = async (err, options) => {
  if (err) return console.log(`${cosmetic.red(err.name)} ${err.message}`);
  let newWindow = options.new;
  for (let name of options.shortcuts) {
    let shortcuts = await Shortcut.get({ filter: { name: new RegExp(`^${name}$`, 'i') } });
    let shortcut;
    if (shortcuts.length > 0) shortcut = shortcuts[0];
    if (!shortcut) return console.log(`${cosmetic.red('Error:')} No shortcut found named ${cosmetic.cyan(name)}`);
    if (!existsSync(shortcut.dir)) console.log(`${cosmetic.red('Error:')} ${cosmetic.cyan(abbreviateDirectory(shortcut.dir))} does not exist`);
    await changeDirectory(abbreviateDirectory(shortcut.dir), options.new);
    if (!options.new) options.new = true;
  };
  return;
};
