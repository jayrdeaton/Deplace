let cosmetic = require('cosmetic'),
  { existsSync } = require('fs'),
  { resolve } = require('path'),
  { Group_Shortcut, Group, Shortcut } = require('../emporium'),
  { abbreviateDirectory } = require('../helpers');

module.exports = async (options) => {
  let { dir, group } = options;
  let shortcuts = [];

  if (group) {
    let groups = await Group.get({ filter: { name: new RegExp(`^${group}$`, 'i') } });
    if (groups.length === 0) throw new Error(`Group named ${cosmetic.cyan(group)} not found`);
    group = groups[0];
    let group_shortcuts = await Group_Shortcut.get({ filter: { group: group.uuid } });
    for (let group_shortcut of group_shortcuts) {
      let shortcut = await Shortcut.find(group_shortcut.shortcut);
      if (!shortcut) throw new Error(`Unable to find shortcut ${cosmetic.cyan(group_shortcut.shortcut)}`)
      shortcuts.push(shortcut);
    };
  } else {
    if (dir) {
      dir = resolve(dir);
      shortcuts = await Shortcut.get({ filter: { dir: new RegExp(dir, 'i') }, sort: { dir: 1 } });
    } else {
      shortcuts = await Shortcut.get({ sort: { name: 1 } });
    };
  };

  if (shortcuts.length === 0) {
    if (dir) {
      console.log(`No shortcuts found within ${cosmetic.cyan(abbreviateDirectory(dir))}`);
    } else {
      console.log('No shortcuts found');
    };
    return;
  } else {
    let pluralization = 'shortcut';
    if (shortcuts.length > 1) pluralization += 's';
    if (dir) console.log(`${shortcuts.length} ${pluralization} found within ${cosmetic.cyan(abbreviateDirectory(dir))}`);
    if (group) console.log(`${shortcuts.length} ${pluralization} found in group ${cosmetic.cyan(group.name)}`);
  }
  let table = [];
  for (let shortcut of shortcuts) {
    let line = [shortcut.name, abbreviateDirectory(shortcut.dir)];
    if (!existsSync(shortcut.dir)) line.push(cosmetic.red('Broken'));
    table.push(line);
  };
  let padding = {};
  for (let array of table) {
    for (let [index, string] of array.entries()) {
      if (index !== array.length - 1 && (!padding[index] || string.length > padding[index])) {
        padding[index] = string.length;
      };
    };
  };
  let lines = [];
  for (let array of table) {
    let line;
    for (let [index, string] of array.entries()) {
      if (index !== array.length - 1 && padding[index] && padding[index] !== string.length) {
        while (string.length < padding[index]) string += ' ';
      };
      if (line) {
        line += `  ${string}`;
      } else {
        line = cosmetic.cyan(string);
      };
    };
    lines.push(line);
  };
  lines.push('');
  console.log(cosmetic.underline('\nShortcuts:'));
  for (let line of lines) {
    console.log(line);
  };

  if (!dir && !group) {
    let groups = await Group.get();
    if (groups.length > 0) {
      console.log(cosmetic.underline('Groups:'));
      for (group of groups) console.log(cosmetic.cyan(group.name));
      console.log();
    };
  };
};
