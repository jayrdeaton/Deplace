let cosmetic = require('cosmetic'),
  { existsSync } = require('fs'),
  { Shortcut } = require('../emporium'),
  { abbreviateDirectory, changeDirectory } = require('../helpers');

module.exports = async (options) => {
  let { shortcuts } = options;
  let newWindow = options['new-window'];
  if (shortcuts) for (let name of shortcuts) {
    let shortcuts = await Shortcut.get({ filter: { name: new RegExp(`^${name}$`, 'i') } });
    let shortcut;
    if (shortcuts.length > 0) shortcut = shortcuts[0];
    if (!shortcut) throw new Error(`No shortcut found named ${cosmetic.cyan(name)}`);
    if (!existsSync(shortcut.dir)) throw new Error(`${cosmetic.cyan(abbreviateDirectory(shortcut.dir))} does not exist`);
    await changeDirectory(abbreviateDirectory(shortcut.dir), options.new);
    if (!options.new) options.new = true;
  };
  return;
};
