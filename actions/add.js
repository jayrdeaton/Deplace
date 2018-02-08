let cosmetic = require('cosmetic'),
  helpers = require('../helpers'),
  getDirectory = helpers.getDirectory,
  abbreviateDirectory = helpers.abbreviateDirectory,
  emporium = require('../emporium'),
  Shortcut = emporium.models.Shortcut;

module.exports = async (err, options) => {
  if (err) {
    console.log(`${cosmetic.red('Error:')} ${err}`);
    return;
  };
  let dir;
  if (options.dir) {
    dir = await getDirectory(options.dir);
    if (!dir) {
      console.log(`${cosmetic.red('Error:')} ${cosmetic.cyan(options.dir)} is not an existing directory`);
      return;
    };
  } else {
    dir = process.cwd().toLowerCase();
  };
  let existing = await Shortcut.fetchOne({ dir });
  if (existing) {
    if (!options.force) {
      console.log(`${cosmetic.red('Error:')} Shortcut already exists for ${cosmetic.cyan(abbreviateDirectory(dir))} named ${cosmetic.cyan(existing.name)}`);
      return;
    };
    await existing.remove();
  } else if (existing) {

  };
  let name;
  if (options.name) {
    name = options.name;
  } else {
    array = dir.split('/');
    name = array[array.length - 1];
  };
  name = name.toLowerCase();
  existing = await Shortcut.fetchOne({ name });
  if (existing) {
    if (!options.force) {
      console.log(`${cosmetic.red('Error:')} Shortcut ${cosmetic.cyan(name)} already added for ${cosmetic.cyan(abbreviateDirectory(existing.dir))}`);
      return;
    };
    await existing.remove();
  };
  let shortcut = new Shortcut({name, dir});
  await shortcut.save();
  console.log(`${cosmetic.green('Success:')} Added shortcut ${cosmetic.cyan(shortcut.name)} for ${cosmetic.cyan(abbreviateDirectory(shortcut.dir))}`);
};
