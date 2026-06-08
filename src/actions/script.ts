import { basename, resolve } from 'node:path'

import { Color } from 'termkit'

import { Group, group as groupDb, script as scriptDb, Shortcut, shortcut as shortcutDb } from '../db'
import { abbreviateDirectory, printError } from '../helpers'

interface ScriptOptions {
  _parents: { deplace: { shortcuts: string[] } }
  replace: boolean
  scripts: string[]
}

export default async (options: ScriptOptions): Promise<void> => {
  const { scripts, replace } = options
  let shortcuts = options._parents.deplace.shortcuts

  if (!scripts || scripts.length === 0) {
    printError(new Error('No scripts provided'))
    return
  }

  if (shortcuts.length === 0) {
    const dir = resolve('.')
    let s = shortcutDb.findByDir(dir)
    if (!s) {
      s = shortcutDb.insert(basename(dir), dir)
      console.log(`${Color.green('Added:')} Shortcut ${Color.cyan(s.name)} for ${Color.cyan(abbreviateDirectory(s.dir))}`)
    }
    shortcuts = [s.name]
  }

  for (const name of shortcuts) {
    const groups: Group[] = [groupDb.findByName(name)].filter(Boolean) as Group[]
    if (replace) {
      for (const g of groups) scriptDb.deleteByGroupId(g.id)
    }
    for (const g of groups) {
      for (const string of scripts) {
        scriptDb.insert(string, undefined, g.id)
        console.log(`${Color.green('Added:')} Script ${Color.cyan(string)} to Group ${Color.cyan(g.name)}`)
      }
    }

    const shortcutsNamed: Shortcut[] = [shortcutDb.findByName(name)].filter(Boolean) as Shortcut[]
    if (replace) {
      for (const s of shortcutsNamed) scriptDb.deleteByShortcutId(s.id)
    }
    for (const s of shortcutsNamed) {
      for (const string of scripts) {
        scriptDb.insert(string, s.id, undefined)
        console.log(`${Color.green('Added:')} Script ${Color.cyan(string)} to Shortcut ${Color.cyan(s.name)}`)
      }
    }
  }
}
