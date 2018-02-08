let cosmetic = require('cosmetic'),
  emporium = require('../emporium'),
  Shortcut = emporium.models.Shortcut,
  helpers = require('../helpers'),
  abbreviateDirectory = helpers.abbreviateDirectory,
  getDirectory = helpers.getDirectory;

module.exports = async (err, options) => {
  if (err) {
    console.log(`${cosmetic.red('Error:')} ${err}`);
    return;
  };
  if (!options.vars) {
    let dir = process.cwd().toLowerCase();
    let shortcut = await Shortcut.fetchOne({ dir });
    if (!shortcut) {
      console.log(`${cosmetic.red('Error:')} No shortcut found for ${cosmetic.cyan(dir)}`);
      return;
    };
    await shortcut.remove();
    console.log(`${cosmetic.green('Removed:')} Shortcut ${cosmetic.cyan(shortcut.name)} for ${cosmetic.cyan(abbreviateDirectory(shortcut.dir))}`);
  } else {
    for (let variable of options.vars) {
      let shortcut;
      if (variable.includes('/') || variable.includes('.')) {
        if (!fs.existsSync(variable)) {
          console.log(`${cosmetic.red('Error:')} ${cosmetic.cyan(variable)} is not an existing directory`);
          return;
        };
        let dir = await getDirectory(variable);
        shortcut = await Shortcut.fetchOne({ dir });
        if (!shortcut) {
          console.log(`${cosmetic.red('Error:')} No shortcut found for ${cosmetic.cyan(dir)}`);
          return;
        };
      } else {
        name = variable.toLowerCase();
        shortcut = await Shortcut.fetchOne({ name });
        if (!shortcut) {
          console.log(`${cosmetic.red('Error:')} No shortcut found named ${cosmetic.cyan(name)}`);
          return;
        };
      };
      await shortcut.remove();
      console.log(`${cosmetic.green('Removed:')} Shortcut ${cosmetic.cyan(shortcut.name)} for ${cosmetic.cyan(abbreviateDirectory(shortcut.dir))}`);
    };
  };
};
