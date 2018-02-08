let cosmetic = require('cosmetic'),
  fs = require('fs'),
  emporium = require('../emporium'),
  Shortcut = emporium.models.Shortcut,
  helpers = require('../helpers'),
  abbreviateDirectory = helpers.abbreviateDirectory,
  changeDirectory = helpers.changeDirectory;

module.exports = async (err, options) => {
  if (err) {
    console.log(`${cosmetic.red('Error:')} ${err}`);
    return;
  };
  if (!options.shortcut) return term.parse([...options._source, 'help']);
  let shortcut = await Shortcut.fetchOne({ name: options.shortcut.toLowerCase() });
  if (!shortcut) return console.log(`${cosmetic.red('Error:')} No shortcut found named ${cosmetic.cyan(options.shortcut)}`);
  if (!fs.existsSync(shortcut.dir)) return console.log(`${cosmetic.red('Error:')} ${cosmetic.cyan(abbreviateDirectory(shortcut.dir))} does not exist`);
  await changeDirectory(abbreviateDirectory(shortcut.dir), options.new);
};
