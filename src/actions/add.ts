import { existsSync } from 'node:fs'
import { basename, resolve } from 'node:path'

import { Color } from 'termkit'

import { shortcut as shortcutDb } from '../db'
import { abbreviateDirectory, getDirectories, printError } from '../helpers'

interface AddOptions {
  all: boolean
  dirs: string[]
  name?: string
}

export default async (options: AddOptions): Promise<void> => {
  let name: string | undefined
  let dirs = options.dirs
  if (!dirs || dirs.length === 0) dirs = ['.']

  for (let dir of dirs) {
    dir = resolve(dir)
    if (!existsSync(dir)) {
      printError(new Error(`${Color.cyan(abbreviateDirectory(dir))} is not an existing directory`))
      continue
    }
    if (options.all) {
      for (const subDir of getDirectories(dir)) {
        try {
          addShortcut(subDir)
        } catch (err) {
          printError(err as Error)
        }
      }
    } else {
      if (options.name && dirs.length === 1) name = options.name
      try {
        addShortcut(dir, name)
      } catch (err) {
        printError(err as Error)
      }
    }
  }
}

function addShortcut(dir: string, name?: string): void {
  const shortcutName = name ?? basename(dir)
  if (shortcutName.includes('/') || shortcutName.startsWith('.')) {
    throw new Error(`Shortcut name cannot include ${Color.cyan('.')} or ${Color.cyan('/')}`)
  }
  if (['add', 'clean', 'list', 'remove'].includes(shortcutName)) {
    throw new Error(`Shortcut name cannot be ${Color.cyan('add')}, ${Color.cyan('clean')}, ${Color.cyan('list')}, or ${Color.cyan('remove')}`)
  }
  const s = shortcutDb.insert(shortcutName, dir)
  console.log(`${Color.green('Added:')} Shortcut ${Color.cyan(s.name)} for ${Color.cyan(abbreviateDirectory(s.dir))}`)
}
