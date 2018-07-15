let { basename, resolve } = require('path'),
  { existsSync } = require('fs'),
  cosmetic = require('cosmetic'),
  { abbreviateDirectory, getDirectories, printError } = require('../helpers'),
  { Shortcut } = require('../emporium');

module.exports = async (options) => {
  let name;
  let dirs = options.dirs;
  if (!dirs || dirs.length === 0) dirs = ['.'];
  for (let dir of dirs) {
    dir = resolve(dir);
    if (!existsSync(dir)) {
      printError(new Error(`${cosmetic.cyan(abbreviateDirectory(dir))} is not an existing directory`));
      continue;
    };
    if (options.all) {
      for (dir of getDirectories(dir)) await add(dir, null, options.force);
    } else {
      if (options.name && dirs.length === 1) name = options.name;
      try {
        await add(dir, name, options.force);
      } catch(err) {
        printError(err);
      };
    };
  };
  return;
};

let add = async (dir, name, force) => {
  name = name || basename(dir);
  if (name.includes('/') || name.startsWith('.')) throw new Error(`Shortcut name cannot include ${cosmetic.cyan('.')} or ${cosmetic.cyan('/')}`);
  if (name === 'add' || name === 'clean' || name === 'list' || name === 'remove') throw new Error(`Shortcut name cannot be ${cosmetic.cyan('add')}, ${cosmetic.cyan('clean')}, ${cosmetic.cyan('list')}, or ${cosmetic.cyan('remove')}`);
  let shortcuts = await Shortcut.get({ filter: { dir: new RegExp(`^${dir}$`, 'i') } });
  let existing = shortcuts[0];
  if (existing) {
    if (!force) throw new Error(`Shortcut already exists for ${cosmetic.cyan(abbreviateDirectory(dir))} named ${cosmetic.cyan(existing.name)}`);
    await existing.delete();
  };
  shortcuts = await Shortcut.get({ filter: { name: new RegExp(`^${name}$`, 'i') } });
  existing = shortcuts[0];
  if (existing) {
    if (!force) throw new Error(`Shortcut ${cosmetic.cyan(name)} already added for ${cosmetic.cyan(abbreviateDirectory(existing.dir))}`);
    await existing.delete();
  };
  let shortcut = new Shortcut({name, dir});
  await shortcut.save();
  return console.log(`${cosmetic.green('Added:')} Shortcut ${cosmetic.cyan(shortcut.name)} for ${cosmetic.cyan(abbreviateDirectory(shortcut.dir))}`);
};
