import { existsSync } from 'node:fs'

import { Color } from 'termkit'

import { group as groupDb, groupShortcut, shortcut as shortcutDb } from '../db'
import { abbreviateDirectory } from '../helpers'

export default async (): Promise<void> => {
  for (const s of shortcutDb.getAll()) {
    if (!existsSync(s.dir)) {
      shortcutDb.delete(s.id)
      console.log(`${Color.green('Removed:')} Shortcut ${Color.cyan(s.name)} for ${Color.cyan(abbreviateDirectory(s.dir))}`)
    }
  }

  for (const g of groupDb.getAll()) {
    if (groupShortcut.getByGroupId(g.id).length === 0) {
      groupDb.delete(g.id)
      console.log(`${Color.green('Removed:')} Group ${Color.cyan(g.name)}`)
    }
  }

  console.log(`${Color.cyan('Deplace')} is clean`)
}
