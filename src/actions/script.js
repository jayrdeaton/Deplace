let cosmetic = require('cosmetic'),
  { basename, resolve } = require('path'),
  { Group, Script, Shortcut } = require('../emporium'),
  { abbreviateDirectory, printError } = require('../helpers');

module.exports = async (options) => {
  let { scripts, replace } = options;
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

  for (let name of shortcuts) {
    let filter = { name: new RegExp(`^${name}$`, 'i') };
    let groups = await Group.get({ filter });
    if (replace) for (let group of groups) {
      let scripts = await Script.get({ filter: { group: group.uuid }});
      for (let script of scripts) {
        await script.delete();
        console.log(`${cosmetic.red('Deleted:')} Script ${cosmetic.cyan(script.string)} from Group ${cosmetic.cyan(group.name)}`);
      };
    };
    for (let group of groups) for (let string of scripts) {
      await Script.create({ group: group.uuid, string });
      console.log(`${cosmetic.green('Added:')} Script ${cosmetic.cyan(string)} to Group ${cosmetic.cyan(group.name)}`);
    };
    let shortcuts = await Shortcut.get({ filter });
    if (replace) for (let shortcut of shortcuts) {
      let scripts = await Script.get({ filter: { shortcut: shortcut.uuid }});
      for (let script of scripts) {
        await script.delete();
        console.log(`${cosmetic.red('Deleted:')} Script ${cosmetic.cyan(script.string)} from Shortcut ${cosmetic.cyan(shortcut.name)}`);
      };
    };
    for (let shortcut of shortcuts) for (let string of scripts) {
      await Script.create({ shortcut: shortcut.uuid, string });
      console.log(`${cosmetic.green('Added:')} Script ${cosmetic.cyan(string)} to Shortcut ${cosmetic.cyan(shortcut.name)}`);
    };
  };
};
