let term = require('termkit'),
  actions = require('../actions');

module.exports = term.command('clean')
  .description('Clean all unlinked shortcuts')
  .action(actions.clean);
