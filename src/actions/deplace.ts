import { existsSync } from 'node:fs'
import { homedir } from 'node:os'

import { Color } from 'termkit'

import { group as groupDb, groupShortcut, script as scriptDb, shortcut as shortcutDb } from '../db'
import { abbreviateDirectory, printError } from '../helpers'
import { openTerminal } from '../platform'

interface DeplaceOptions {
  'new-window': boolean
  shortcuts: string[]
}

export default async (options: DeplaceOptions): Promise<void> => {
  const { shortcuts } = options
  let newWindow = options['new-window']

  if (!shortcuts || shortcuts.length === 0) return

  for (const name of shortcuts) {
    const g = groupDb.findByName(name)
    if (g) {
      let lastDir = ''
      for (const row of groupShortcut.getByGroupId(g.id)) {
        const s = shortcutDb.findById(row.shortcut_id)
        if (!s) throw new Error(`Shortcut ${row.shortcut_id} not found`)
        if (!existsSync(s.dir)) {
          printError(new Error(`${Color.cyan(abbreviateDirectory(s.dir))} does not exist`))
          continue
        }
        const scripts = scriptDb.getByShortcutId(s.id).map((sc) => sc.string)
        openTerminal(s.dir, newWindow, scripts)
        lastDir = s.dir
        if (!newWindow) newWindow = true
      }
      const groupScripts = scriptDb.getByGroupId(g.id).map((sc) => sc.string)
      if (groupScripts.length > 0) openTerminal(lastDir || homedir(), false, groupScripts)
      continue
    }

    const s = shortcutDb.findByName(name)
    if (!s) throw new Error(`No shortcut found named ${Color.cyan(name)}`)
    if (!existsSync(s.dir)) {
      printError(new Error(`${Color.cyan(abbreviateDirectory(s.dir))} does not exist`))
      continue
    }
    const scripts = scriptDb.getByShortcutId(s.id).map((sc) => sc.string)
    openTerminal(s.dir, newWindow, scripts)
    if (!newWindow) newWindow = true
  }
}
