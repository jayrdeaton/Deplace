import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { Color } from 'termkit'

import { Group, group as groupDb, groupShortcut, script as scriptDb, Shortcut, shortcut as shortcutDb } from '../db'
import { abbreviateDirectory, printTable } from '../helpers'

interface ListOptions {
  dir?: string
  shortcut?: string
  verbose: boolean
}

export default async (options: ListOptions): Promise<void> => {
  const { shortcut: filter, verbose, dir } = options
  const table: string[][] = []

  if (!dir) {
    const groups: Group[] = filter ? ([groupDb.findByName(filter)].filter(Boolean) as Group[]) : groupDb.getAll()

    if (groups.length > 0) table.push([Color.underline('Groups:')])
    for (const g of groups) {
      table.push([Color.cyan(g.name)])
      if (filter || verbose) {
        const gs = groupShortcut.getByGroupId(g.id)
        if (gs.length > 0) table.push(['', Color.underline('Shortcuts:')])
        for (const row of gs) {
          const s = shortcutDb.findById(row.shortcut_id)
          if (s) {
            const broken = !existsSync(s.dir) ? Color.red('Broken') : ''
            table.push(['', Color.cyan(s.name), abbreviateDirectory(s.dir), broken])
          }
        }
        const scripts = scriptDb.getByGroupId(g.id)
        if (scripts.length > 0) table.push(['', Color.underline('Scripts:')])
        for (const sc of scripts) table.push(['', Color.cyan(sc.string)])
      }
    }
    if (groups.length > 0) table.push([])
  }

  const shortcuts: Shortcut[] = dir ? shortcutDb.findByDirPrefix(resolve(dir)) : filter ? ([shortcutDb.findByName(filter)].filter(Boolean) as Shortcut[]) : shortcutDb.getAll()

  if (shortcuts.length > 0) table.push([Color.underline('Shortcuts:')])
  for (const s of shortcuts) {
    const broken = !existsSync(s.dir) ? Color.red('Broken') : ''
    table.push([Color.cyan(s.name), abbreviateDirectory(s.dir), broken])
    if (dir || filter || verbose) {
      const gs = groupShortcut.getByShortcutId(s.id)
      if (gs.length > 0) table.push(['', Color.underline('Groups:')])
      for (const row of gs) {
        const g = groupDb.findById(row.group_id)
        if (g) table.push(['', Color.cyan(g.name)])
      }
      const scripts = scriptDb.getByShortcutId(s.id)
      if (scripts.length > 0) table.push(['', Color.underline('Scripts:')])
      for (const sc of scripts) table.push(['', Color.cyan(sc.string)])
    }
  }
  if (shortcuts.length > 0) table.push([])

  printTable(table, [])
}
