let cosmetic = require('cosmetic'),
  { existsSync } = require('fs'),
  { Group_Shortcut, Shortcut } = require('../emporium'),
  { abbreviateDirectory } = require('../helpers');

module.exports = async (options) => {
  let shortcuts = await Shortcut.get();
  for (let shortcut of shortcuts) {
    if (!existsSync(shortcut.dir)) {
      let group_shortcuts = await Group_Shortcut.get({ filter: { shortcut: shortcut.uuid } });
      for (let group_shortcut of group_shortcuts) await group_shortcut.delete();
      await shortcut.delete();
      console.log(`${cosmetic.green('Removed:')} Shortcut ${cosmetic.cyan(shortcut.name)} for ${cosmetic.cyan(abbreviateDirectory(shortcut.dir))}`)
    };
  };
  console.log(`${cosmetic.cyan('Deplace')} is clean`);
};
