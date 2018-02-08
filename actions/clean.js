let cosmetic = require('cosmetic'),
  fs = require('fs'),
  emporium = require('../emporium'),
  Shortcut = emporium.models.Shortcut,
  helpers = require('../helpers'),
  abbreviateDirectory = helpers.abbreviateDirectory;

module.exports = async (err, options) => {
  if (err) {
    console.log(`${cosmetic.red('Error:')} ${err}`);
    return;
  };
  let shortcuts = await Shortcut.fetch();
  let removed = 0;
  for (let shortcut of shortcuts) {
    if (!fs.existsSync(shortcut.dir)) {
      removed++;
      await shortcut.remove();
      console.log(`${cosmetic.green('Removed:')} Shortcut ${cosmetic.cyan(shortcut.name)} for ${cosmetic.cyan(abbreviateDirectory(shortcut.dir))}`)
    };
  };
  console.log(`${cosmetic.cyan('Deplace')} is clean`);
};
