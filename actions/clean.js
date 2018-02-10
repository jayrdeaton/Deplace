let cosmetic = require('cosmetic'),
  { existsSync } = require('fs'),
  emporium = require('../emporium'),
  Shortcut = emporium.models.Shortcut,
  { abbreviateDirectory } = require('../helpers');

module.exports = async (err, options) => {
  if (err) return console.log(`${cosmetic.red(err.name)} ${err.message}`);
  let shortcuts = await Shortcut.fetch();
  let removed = 0;
  for (let shortcut of shortcuts) {
    if (!existsSync(shortcut.dir)) {
      removed++;
      await shortcut.remove();
      console.log(`${cosmetic.green('Removed:')} Shortcut ${cosmetic.cyan(shortcut.name)} for ${cosmetic.cyan(abbreviateDirectory(shortcut.dir))}`)
    };
  };
  console.log(`${cosmetic.cyan('Deplace')} is clean`);
};
