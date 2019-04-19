let cosmetic = require('cosmetic'),
  { existsSync } = require('fs'),
  { Group_Shortcut, Group, Script, Shortcut } = require('../emporium'),
  { abbreviateDirectory, changeDirectory, printError, runOsascript } = require('../helpers');

module.exports = async (options) => {
  let { shortcuts } = options;
  let newWindow = options['new-window'];
  if (shortcuts) for (let name of shortcuts) {
    let filter = { name: new RegExp(`^${name}$`, 'i') };
    let group = await Group.get({ filter });
    if (group.length > 0) {
      group = group[0];
      let group_shortcuts = await Group_Shortcut.get({ filter: { group: group.uuid } });
      for (let group_shortcut of group_shortcuts) {
        let shortcut = await Shortcut.find(group_shortcut.shortcut);
        if (!shortcut) throw new Error(`Shortcut ${cosmetic.cyan(group_shortcut.shortcut)} not found`);
        if (!existsSync(shortcut.dir)) {
          printError(new Error(`${cosmetic.cyan(abbreviateDirectory(shortcut.dir))} does not exist`));
          continue;
        };
        await changeDirectory(abbreviateDirectory(shortcut.dir), newWindow);

        let scripts = await Script.get({ filter: { shortcut: shortcut.uuid } });
        for (let script of scripts) {
          console.log(script.string, shortcut.name, scripts.length);
          await runOsascript(script.string);
        }

        if (!newWindow) newWindow = true;
      };
      let scripts = await Script.get({ filter: { group: group.uuid } });
      for (let script of scripts) await runOsascript(script.string);
      continue;
    };
    let shortcut = await Shortcut.get({ filter });
    if (shortcut.length > 0) { shortcut = shortcut[0] } else { throw new Error(`No shortcut found named ${cosmetic.cyan(name)}`) };
    if (!existsSync(shortcut.dir)) {
      printError(new Error(`${cosmetic.cyan(abbreviateDirectory(shortcut.dir))} does not exist`));
      continue;
    };
    await changeDirectory(abbreviateDirectory(shortcut.dir), newWindow);

    let scripts = await Script.get({ filter: { shortcut: shortcut.uuid } });
    for (let script of scripts) await runOsascript(script.string);

    if (!newWindow) newWindow = true;
  };
};
