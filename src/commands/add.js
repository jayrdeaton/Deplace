let term = require('termkit'),
  actions = require('../actions');

module.exports = term.command('add', '[dirs...]')
  .description('Add new directories to your known shortcuts')
  .options([
    term.option('a', 'all', null, 'Add all directories in current or specified directories'),
    term.option('f', 'force', null, 'Overwrite any existing shortcuts'),
    term.option('n', 'name', '<name>', 'Add shortcut with a specified name')
  ])
  .action(actions.add);
