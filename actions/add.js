let { basename, resolve } = require('path'),
  { existsySync } = require('fs'),
  cosmetic = require('cosmetic'),
  { abbreviateDirectory, getDirectories } = require('../helpers'),
  emporium = require('../emporium'),
  Shortcut = emporium.models.Shortcut;

module.exports = async (err, options) => {
  if (err) return console.log(`${cosmetic.red(err.name)} ${err.message}`);
  let name;
  let dirs = options.dirs || ['.'];
  for (let dir of dirs) {
    dir = resolve(dir).toLowerCase();
    if (!existsSync(dir)) {
      console.log(`${cosmetic.red('Error:')} ${cosmetic.cyan(abbreviateDirectory(dir))} is not an existing directory`)
      continue;
    };
    if (options.all) {
      for (dir of getDirectories(dir)) await add(dir, null, options.force);
    } else {
      if (options.name && dirs.length === 1) name = options.name.toLowerCase();
      await add(dir, name, options.force);
    };
  };
  return;
};

let add = async (dir, name, force) => {
  name = name || basename(dir);
  if (name.includes('/') || name.startsWith('.')) return console.log(`${cosmetic.red('Error:')} Shortcut name cannot include ${cosmetic.cyan('.')} or ${cosmetic.cyan('/')}`);
  if (name === 'add' || name === 'clean' || name === 'list' || name === 'remove') return console.log(`${cosmetic.red('Error:')} Shortcut name cannot be ${cosmetic.cyan('add')}, ${cosmetic.cyan('clean')}, ${cosmetic.cyan('list')}, or ${cosmetic.cyan('remove')}`);
  let existing = await Shortcut.fetchOne({ dir });
  if (existing) {
    if (!force) return console.log(`${cosmetic.red('Error:')} Shortcut already exists for ${cosmetic.cyan(abbreviateDirectory(dir))} named ${cosmetic.cyan(existing.name)}`);
    await existing.remove();
  };
  existing = await Shortcut.fetchOne({ name });
  if (existing) {
    if (!force) return console.log(`${cosmetic.red('Error:')} Shortcut ${cosmetic.cyan(name)} already added for ${cosmetic.cyan(abbreviateDirectory(existing.dir))}`);
    await existing.remove();
  };
  let shortcut = new Shortcut({name, dir});
  await shortcut.save();
  return console.log(`${cosmetic.green('Added:')} Shortcut ${cosmetic.cyan(shortcut.name)} for ${cosmetic.cyan(abbreviateDirectory(shortcut.dir))}`);
};
