let term = require('termkit'),
  actions = require('../actions');

module.exports = term.command('remove', '[vars...]')
  .description('Remove a shortcut with a directory or name')
  .options([
    term.option('a', 'all', null, 'Remove all stored shortcuts')
  ])
  .action(actions.remove);
