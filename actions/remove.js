let cosmetic = require('cosmetic'),
  fs = require('fs'),
  path = require('path'),
  emporium = require('../emporium'),
  Shortcut = emporium.models.Shortcut,
  { abbreviateDirectory } = require('../helpers');

module.exports = async (err, options) => {
  if (err) return console.log(`${cosmetic.red(err.name)} ${err.message}`);
  if (!options.vars) {
    await remove(process.cwd());
  } else {
    for (let variable of options.vars) await remove(variable, options.all);
  };
  return;
};

let remove = async (variable, all) => {
  if (variable.includes('/') || variable.startsWith('.')) {
    if (!fs.existsSync(variable)) return console.log(`${cosmetic.red('Error:')} ${cosmetic.cyan(variable)} is not an existing directory`);
    let dir = path.resolve(variable);
    if (all) {
      let shortcuts = await Shortcut.fetch({dir: new RegExp(dir, 'i')});
      if (shortcuts.length === 0) return console.log(`${cosmetic.red('Error:')} No shortcuts found within ${cosmetic.cyan(abbreviateDirectory(dir))}`);
      for (let shortcut of shortcuts) {
        await shortcut.remove();
        console.log(`${cosmetic.green('Removed:')} Shortcut ${cosmetic.cyan(shortcut.name)} for ${cosmetic.cyan(abbreviateDirectory(shortcut.dir))}`);
      };
      return;
    } else {
      let shortcut = await Shortcut.fetchOne({ dir: new RegExp(`^${dir}$`, 'i') });
      if (!shortcut) return console.log(`${cosmetic.red('Error:')} No shortcut found for ${cosmetic.cyan(abbreviateDirectory(dir))}`);
      await shortcut.remove();
      return console.log(`${cosmetic.green('Removed:')} Shortcut ${cosmetic.cyan(shortcut.name)} for ${cosmetic.cyan(abbreviateDirectory(shortcut.dir))}`);
    };
  } else {
    let name = variable;
    let shortcut = await Shortcut.fetchOne({ name: new RegExp(`^${dir}$`, 'i') });
    if (!shortcut) return console.log(`${cosmetic.red('Error:')} No shortcut found named ${cosmetic.cyan(name)}`);
    await shortcut.remove();
    return console.log(`${cosmetic.green('Removed:')} Shortcut ${cosmetic.cyan(shortcut.name)} for ${cosmetic.cyan(abbreviateDirectory(shortcut.dir))}`);
  };
};
