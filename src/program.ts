import type { ParsedOptions } from 'termkit'
import { Program } from 'termkit'

import { add, clean, deplace, group, list, remove, script } from './actions'

const cmd = Program.command
const opt = Program.option

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wire = (fn: (o: ParsedOptions) => Promise<void>) => (o: ParsedOptions) => fn(o as any)

const program = cmd('deplace', '[shortcuts...]')
  .version(process.env.npm_package_version ?? '0.0.0')
  .description('A shortcut tool for your terminal')
  .options([opt('n', 'new-window', null, 'Open shortcut in a new window')])
  .action(wire(deplace))
  .commands([
    cmd('add', '[dirs...]')
      .description('Add new directories to your known shortcuts')
      .options([opt('a', 'all', null, 'Add all directories in current or specified directories'), opt('n', 'name', '<name>', 'Add shortcut with a specified name')])
      .action(wire(add)),
    cmd('remove', '[vars...]')
      .description('Remove a shortcut with a directory or name')
      .options([opt('a', 'all', null, 'Remove all stored shortcuts within provided directories')])
      .action(wire(remove)),
    cmd('list', '[shortcut]')
      .description('List all shortcuts or those belonging to specified group')
      .options([opt('d', 'dir', '<dir>', 'Filter list to those within dir'), opt('v', 'verbose', null, 'Show group and shortcut relationships')])
      .action(wire(list)),
    cmd('clean')
      .description('Clean all unlinked shortcuts')
      .action(async () => await clean()),
    cmd('group', '<name> [shortcuts...]')
      .description('Group shortcuts')
      .options([opt('r', 'replace', null, 'Replace existing group shortcuts')])
      .action(wire(group)),
    cmd('script', '[scripts...]')
      .description('Run a command line script after opening a shortcut or group')
      .options([opt('r', 'replace', null, 'Replace existing scripts')])
      .action(wire(script))
  ])

export default program
