import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { Color } from 'termkit'

import { group as groupDb, shortcut as shortcutDb } from '../db'
import { abbreviateDirectory, printError } from '../helpers'

interface RemoveOptions {
  all: boolean
  vars: string[]
}

export default async (options: RemoveOptions): Promise<void> => {
  if (!options.vars || options.vars.length === 0) {
    try {
      removeByPath(process.cwd(), false)
    } catch (err) {
      printError(err as Error)
    }
  } else {
    for (const variable of options.vars) {
      try {
        remove(variable, options.all)
      } catch (err) {
        printError(err as Error)
      }
    }
  }
}

function remove(variable: string, all: boolean): void {
  if (variable.includes('/') || variable.startsWith('.')) {
    removeByPath(resolve(variable), all)
  } else {
    removeByName(variable)
  }
}

function removeByPath(dir: string, all: boolean): void {
  if (!existsSync(dir)) throw new Error(`${Color.cyan(dir)} is not an existing directory`)
  if (all) {
    const shortcuts = shortcutDb.findByDirPrefix(dir)
    if (shortcuts.length === 0) throw new Error(`No shortcuts found within ${Color.cyan(abbreviateDirectory(dir))}`)
    for (const s of shortcuts) {
      shortcutDb.delete(s.id)
      console.log(`${Color.green('Removed:')} Shortcut ${Color.cyan(s.name)} for ${Color.cyan(abbreviateDirectory(s.dir))}`)
    }
  } else {
    const s = shortcutDb.findByDir(dir)
    if (!s) throw new Error(`No shortcut found for ${Color.cyan(abbreviateDirectory(dir))}`)
    shortcutDb.delete(s.id)
    console.log(`${Color.green('Removed:')} Shortcut ${Color.cyan(s.name)} for ${Color.cyan(abbreviateDirectory(s.dir))}`)
  }
}

function removeByName(variable: string): void {
  const g = groupDb.findByName(variable)
  if (g) {
    groupDb.delete(g.id)
    console.log(`${Color.green('Removed:')} Group ${Color.cyan(g.name)}`)
    return
  }
  const s = shortcutDb.findByName(variable)
  if (!s) throw new Error(`No shortcut found named ${Color.cyan(variable)}`)
  shortcutDb.delete(s.id)
  console.log(`${Color.green('Removed:')} Shortcut ${Color.cyan(s.name)} for ${Color.cyan(abbreviateDirectory(s.dir))}`)
}
