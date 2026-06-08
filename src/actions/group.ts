import { basename, resolve } from 'node:path'

import { Color } from 'termkit'

import { group as groupDb, groupShortcut, shortcut as shortcutDb } from '../db'
import { abbreviateDirectory, printError } from '../helpers'

interface GroupOptions {
  _parents: { deplace: { shortcuts: string[] } }
  name: string
  replace: boolean
  shortcuts: string[]
}

export default async (options: GroupOptions): Promise<void> => {
  const { name, replace } = options
  let shortcuts = options._parents.deplace.shortcuts

  if (shortcuts.length === 0) {
    const dir = resolve('.')
    let s = shortcutDb.findByDir(dir)
    if (!s) {
      s = shortcutDb.insert(basename(dir), dir)
      console.log(`${Color.green('Added:')} Shortcut ${Color.cyan(s.name)} for ${Color.cyan(abbreviateDirectory(s.dir))}`)
    }
    shortcuts = [s.name]
  }

  let g = groupDb.findByName(name)
  if (!g) g = groupDb.insert(name)

  if (replace) groupShortcut.deleteByGroupId(g.id)

  for (const shortcutName of shortcuts) {
    const s = shortcutDb.findByName(shortcutName)
    if (!s) {
      printError(new Error(`No shortcut found named ${Color.cyan(shortcutName)}`))
      continue
    }
    if (groupShortcut.exists(g.id, s.id)) {
      console.log(`${Color.yellow('Skipped:')} Shortcut ${Color.cyan(s.name)} already in group ${Color.cyan(g.name)}`)
      continue
    }
    groupShortcut.insert(g.id, s.id)
    console.log(`${Color.green('Added:')} Shortcut ${Color.cyan(s.name)} to group ${Color.cyan(g.name)}`)
  }
}
