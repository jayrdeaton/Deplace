let { command, option } = require('termkit'),
  { add, clean, deplace, group, list, remove, script } = require('../actions');

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
        option('n', 'name', '<name>', 'Add shortcut with a specified name')
      ])
      .action(async (options) => await add(options)),
    command('remove', '[vars...]')
      .description('Remove a shortcut with a directory or name')
      .options([
        option('a', 'all', null, 'Remove all stored shortcuts within provided directories')
      ])
      .action(async (options) => await remove(options)),
    command('list', '[shortcut]')
      .description('List all shortcuts or those belonging to specified group')
      .options([
        option('d', 'dir', '<dir>', 'Filter list to those within dir'),
        option('v', 'verbose', null, 'Show group and shortcut relationships')
      ])
      .action(async (options) => await list(options)),
    command('clean')
      .description('Clean all unlinked shortcuts')
      .action(async (options) => await clean(options)),
    command('group', '<name> [shortcuts...]')
      .description('Group shortcuts')
      .options([
        option('r', 'replace', null, 'Replace existing group shortcuts')
      ])
      .action(async (options) => await group(options)),
    command('script', '[scripts...]')
      .description('Run command line script after shortcut or group')
      .options([
        option('r', 'replace', null, 'Replace existing scripts')
      ])
      .action(async (options) => await script(options))
  ]);

module.exports = program;
