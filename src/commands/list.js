let term = require('termkit'),
  actions = require('../actions');

module.exports = term.command('list', '[dir]')
  .description('List all shortcuts or those within [dir]')
  .action(actions.list);
