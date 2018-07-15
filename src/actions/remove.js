let cosmetic = require('cosmetic'),
  fs = require('fs'),
  path = require('path'),
  { Shortcut } = require('../emporium'),
  { abbreviateDirectory, printError } = require('../helpers');

module.exports = async (options) => {
  if (!options.vars) {
    await remove(process.cwd());
  } else {
    for (let variable of options.vars) {
      try {
        await remove(variable, options.all);
      } catch(err) {
        printError(err);
      };
    };
  };
  return;
};

let remove = async (variable, all) => {
  if (variable.includes('/') || variable.startsWith('.')) {
    if (!fs.existsSync(variable)) throw new Error(`${cosmetic.cyan(variable)} is not an existing directory`);
    let dir = path.resolve(variable);
    if (all) {
      let shortcuts = await Shortcut.get({ filter: { dir: new RegExp(dir, 'i') } });
      if (shortcuts.length === 0) throw new Error(`No shortcuts found within ${cosmetic.cyan(abbreviateDirectory(dir))}`);
      for (let shortcut of shortcuts) {
        await shortcut.delete();
        console.log(`${cosmetic.green('Removed:')} Shortcut ${cosmetic.cyan(shortcut.name)} for ${cosmetic.cyan(abbreviateDirectory(shortcut.dir))}`);
      };
      return;
    } else {
      let shortcuts = await Shortcut.get({ filter: { dir: new RegExp(`^${dir}$`, 'i') } });
      let shortcut;
      if (shortcuts.length > 0) shortcut = shortcuts[0];
      if (!shortcut) throw new Error(`No shortcut found for ${cosmetic.cyan(abbreviateDirectory(dir))}`);
      await shortcut.delete();
      return console.log(`${cosmetic.green('Removed:')} Shortcut ${cosmetic.cyan(shortcut.name)} for ${cosmetic.cyan(abbreviateDirectory(shortcut.dir))}`);
    };
  } else {
    let name = variable;
    let shortcuts = await Shortcut.get({ filter: { name: new RegExp(`^${dir}$`, 'i') } });
    let shortcut;
    if (shortcuts.length > 0) shortcut = shortcuts[0];
    if (!shortcut) throw new Error(`No shortcut found named ${cosmetic.cyan(name)}`);
    await shortcut.delete();
    return console.log(`${cosmetic.green('Removed:')} Shortcut ${cosmetic.cyan(shortcut.name)} for ${cosmetic.cyan(abbreviateDirectory(shortcut.dir))}`);
  };
};
