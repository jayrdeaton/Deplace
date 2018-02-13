let cosmetic = require('cosmetic'),
  { existsSync } = require('fs'),
  emporium = require('../emporium'),
  Shortcut = emporium.models.Shortcut,
  { abbreviateDirectory, changeDirectory } = require('../helpers');

module.exports = async (err, options) => {
  if (err) return console.log(`${cosmetic.red(err.name)} ${err.message}`);
  let newWindow = options.new;
  for (let name of options.shortcuts) {
    let shortcut = await Shortcut.fetchOne({ name: new RegExp(`^${name}$`, 'i') });
    if (!shortcut) return console.log(`${cosmetic.red('Error:')} No shortcut found named ${cosmetic.cyan(name)}`);
    if (!existsSync(shortcut.dir)) console.log(`${cosmetic.red('Error:')} ${cosmetic.cyan(abbreviateDirectory(shortcut.dir))} does not exist`);
    await changeDirectory(abbreviateDirectory(shortcut.dir), options.new);
    if (!options.new) options.new = true;
  };
  return;
};
