let term = require('termkit'),
  actions = require('../actions');
  add = require('./add'),
  clean = require('./clean'),
  list = require('./list'),
  remove = require('./remove');

module.exports = term.command('Deplace', '[shortcut]')
  .version('1.0.0')
  .description('A shortcut tool for your OSX terminal')
  .options([
    term.option('n', 'new', null, 'Open shortcut in a new window')
  ])
  .action(actions.deplace)
  .commands([
    add,
    list,
    remove,
    clean
  ]);
