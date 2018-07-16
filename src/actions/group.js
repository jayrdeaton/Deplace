let cosmetic = require('cosmetic'),
  { basename, resolve } = require('path'),
  { Group_Shortcut, Group, Shortcut } = require('../emporium'),
  { abbreviateDirectory, printError } = require('../helpers');

module.exports = async (options) => {
  let { name, replace } = options;
  let { shortcuts } = options._parents.deplace;

  if (shortcuts.length === 0) {
    let dir = resolve('.');
    let shortcut, existingShortcuts = await Shortcut.get({ filter: { dir } });
    if (existingShortcuts.length > 0) {
      shortcut = existingShortcuts[0];
    } else {
      shortcut = await Shortcut.create({ name: basename(dir), dir});
      console.log(`${cosmetic.green('Added:')} Shortcut ${cosmetic.cyan(shortcut.name)} for ${cosmetic.cyan(abbreviateDirectory(shortcut.dir))}`);
    };
    shortcuts.push(shortcut.name);
  };

  let group, groups = await Group.get({ filter: { name: new RegExp(`^${name}$`, 'i') } });
  if (groups.length > 0) {
    group = groups[0];
  } else {
    group = await Group.create({ name });
  };

  let group_shortcuts = await Group_Shortcut.get({ filter: { group: group.uuid } });
  if (replace) {
    for (let group_shortcut of group_shortcuts) {
      await group_shortcut.delete();
    };
    group_shortcuts = [];
  };

  for (let name of shortcuts) {
    let shortcut = await Shortcut.get({ filter: { name: new RegExp(`^${name}$`, 'i') } });
    if (shortcut.length === 0) {
      printError(new Error(`No shortcut found named ${cosmetic.cyan(name)}`));
      continue;
    };
    shortcut = shortcut[0];
    let found;
    for (let group_shortcut of group_shortcuts) if (group_shortcut.shortcut === shortcut.uuid) found = true;

    if (found) {
      console.log(`${cosmetic.yellow('Skipped:')} Shortcut ${cosmetic.cyan(shortcut.name)} already in group ${cosmetic.cyan(group.name)}`);
      continue;
    };

    let group_shortcut = await Group_Shortcut.create({ group: group.uuid, shortcut: shortcut.uuid });
    console.log(`${cosmetic.green('Added:')} Shortcut ${cosmetic.cyan(shortcut.name)} to group ${cosmetic.cyan(group.name)}`);
  };
};
