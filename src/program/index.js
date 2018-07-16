let { command, option } = require('termkit'),
  { add, clean, deplace, group, list, remove } = require('../actions');

let program = command('deplace', '[shortcuts...]')
  .version(process.env.npm_package_version)
  .description('A shortcut tool for your OSX terminal')
  .options([
    option('n', 'new-window', null, 'Open shortcut in a new window')
  ])
  .action(async (options) => await deplace(options))
  .commands([
    command('add', '[dirs...]')
      .description('Add new directories to your known shortcuts')
      .options([
        option('a', 'all', null, 'Add all directories in current or specified directories'),
        option('f', 'force', null, 'Overwrite any existing shortcuts'),
        option('n', 'name', '<name>', 'Add shortcut with a specified name')
      ])
      .action(async (options) => await add(options)),
    command('list', '[group]')
      .description('List all shortcuts or those belonging to specified group')
      .options([
        option('d', 'dir', '<dir>', 'Filter list to those within dir')
      ])
      .action(async (options) => await list(options)),
    command('remove', '[vars...]')
      .description('Remove a shortcut with a directory or name')
      .options([
        option('a', 'all', null, 'Remove all stored shortcuts within provided directories')
      ])
      .action(async (options) => await remove(options)),
    command('clean')
      .description('Clean all unlinked shortcuts')
      .action(async (options) => await clean(options)),
    command('group', '<name>')
      .description('Group shortcuts')
      .options([
        option('r', 'replace', null, 'Replace existing group shortcuts with those supplied')
      ])
      .action(async (options) => await group(options))
  ]);

module.exports = program;
