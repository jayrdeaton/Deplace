let cosmetic = require('cosmetic'),
  fs = require('fs'),
  path = require('path'),
  { Group_Shortcut, Group, Shortcut } = require('../emporium'),
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
      for (let shortcut of shortcuts) await removeShortcut(shortcut);
    } else {
      let shortcut, shortcuts = await Shortcut.get({ filter: { dir: new RegExp(`^${dir}$`, 'i') } });
      if (shortcuts.length > 0) shortcut = shortcuts[0];
      if (!shortcut) throw new Error(`No shortcut found for ${cosmetic.cyan(abbreviateDirectory(dir))}`);
      await removeShortcut(shortcut);
    };
  } else {
    let filter = { name: new RegExp(`^${variable}$`, 'i') };
    let group, groups = await Group.get({ filter });
    if (groups.length > 0) {
      group = groups[0];
      await group.delete();
      console.log(`${cosmetic.green('Removed:')} Group ${cosmetic.cyan(group.name)}`);
    } else {
      let shortcut, shortcuts = await Shortcut.get({ filter });
      if (shortcuts.length > 0) shortcut = shortcuts[0];
      if (!shortcut) throw new Error(`No shortcut found named ${cosmetic.cyan(variable)}`);
      await removeShortcut(shortcut);
    };
  };
};

let removeShortcut = async (shortcut) => {
  let group_shortcuts = await Group_Shortcut.get({ filter: { shortcut: shortcut.uuid } });
  for (let group_shortcut of group_shortcuts) await group_shortcut.delete();
  await shortcut.delete();
  console.log(`${cosmetic.green('Removed:')} Shortcut ${cosmetic.cyan(shortcut.name)} for ${cosmetic.cyan(abbreviateDirectory(shortcut.dir))}`);
};
