let term = require('termkit'),
  actions = require('../actions');

module.exports = term.command('add', '[dir] [name]')
  .description('Add a new directory to your known shortcuts')
  .options([
    term.option('f', 'force', null, 'Overwrite any existing shortcuts')
  ])
  .action(actions.add);
