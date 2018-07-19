let cosmetic = require('cosmetic'),
  { existsSync } = require('fs'),
  { Group, Group_Shortcut, Script, Shortcut } = require('../emporium'),
  { abbreviateDirectory } = require('../helpers');

module.exports = async (options) => {
  let shortcuts = await Shortcut.get();
  for (let shortcut of shortcuts) {
    if (!existsSync(shortcut.dir)) {
      await shortcut.delete();
      console.log(`${cosmetic.green('Removed:')} Shortcut ${cosmetic.cyan(shortcut.name)} for ${cosmetic.cyan(abbreviateDirectory(shortcut.dir))}`);
    };
  };
  let group_shortcuts = await Group_Shortcut.get();
  for (let group_shortcut of group_shortcuts) {
    let group, shortcut;
    if (group_shortcut.group) group = await Group.find(group_shortcut.group);
    if (group_shortcut.shortcut) shortcut = await Shortcut.find(group_shortcut.shortcut);
    if (!group || !shortcut) {
      await group_shortcut.delete();
      console.log(`${cosmetic.green('Removed:')} Group Shortcut ${group_shortcut.uuid}`);
    };
  };
  let groups = await Group.get();
  for (let group of groups) {
    let group_shortcuts = await Group_Shortcut.get({ filter: { group: group.uuid } });
    if (group_shortcuts.length === 0) {
      await group.delete();
      console.log(`${cosmetic.green('Removed:')} Group ${cosmetic.cyan(group.name)}`);
    };
  };
  let scripts = await Script.get();
  for (let script of scripts) {
    let group, shortcut;
    if (script.group) group = await Group.find(script.group);
    if (script.shortcut) shortcut = await Shortcut.find(script.shortcut);
    if (!group && !shortcut) {
      await script.delete();
      console.log(`${cosmetic.green('Removed:')} Script ${script.uuid}`);
    };
  };
  console.log(`${cosmetic.cyan('Deplace')} is clean`);
};
