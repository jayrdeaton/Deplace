import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

import { createOps, initDb } from '../db'

function makeDb() {
  const db = initDb(':memory:')
  return { db, ops: createOps(db) }
}

describe('shortcuts', () => {
  it('inserts and finds a shortcut by name', () => {
    const { ops } = makeDb()
    ops.shortcut.insert('myproject', '/Users/jay/Developer/MyProject')
    const s = ops.shortcut.findByName('myproject')
    expect(s).toBeDefined()
    expect(s!.name).toBe('myproject')
    expect(s!.dir).toBe('/Users/jay/Developer/MyProject')
  })

  it('findByName is case-insensitive', () => {
    const { ops } = makeDb()
    ops.shortcut.insert('MyProject', '/Users/jay/Developer/MyProject')
    expect(ops.shortcut.findByName('myproject')).toBeDefined()
    expect(ops.shortcut.findByName('MYPROJECT')).toBeDefined()
  })

  it('throws on duplicate name', () => {
    const { ops } = makeDb()
    ops.shortcut.insert('dup', '/path/a')
    expect(() => ops.shortcut.insert('dup', '/path/b')).toThrow()
  })

  it('deletes a shortcut', () => {
    const { ops } = makeDb()
    const s = ops.shortcut.insert('tmp', '/tmp')
    ops.shortcut.delete(s.id)
    expect(ops.shortcut.findByName('tmp')).toBeUndefined()
  })

  it('getAll returns all shortcuts ordered by name', () => {
    const { ops } = makeDb()
    ops.shortcut.insert('zebra', '/z')
    ops.shortcut.insert('alpha', '/a')
    const all = ops.shortcut.getAll()
    expect(all[0].name).toBe('alpha')
    expect(all[1].name).toBe('zebra')
  })

  it('findByDir returns shortcut for exact dir', () => {
    const { ops } = makeDb()
    ops.shortcut.insert('proj', '/Users/jay/proj')
    expect(ops.shortcut.findByDir('/Users/jay/proj')).toBeDefined()
    expect(ops.shortcut.findByDir('/Users/jay')).toBeUndefined()
  })

  it('findByDirPrefix returns shortcuts under a directory', () => {
    const { ops } = makeDb()
    ops.shortcut.insert('a', '/Users/jay/Developer/A')
    ops.shortcut.insert('b', '/Users/jay/Developer/B')
    ops.shortcut.insert('other', '/tmp/other')
    const results = ops.shortcut.findByDirPrefix('/Users/jay/Developer')
    expect(results).toHaveLength(2)
  })

  it('defaults scan to false', () => {
    const { ops } = makeDb()
    const s = ops.shortcut.insert('proj', '/path')
    expect(s.scan).toBe(false)
    expect(ops.shortcut.findByName('proj')!.scan).toBe(false)
  })

  it('stores and retrieves scan as a boolean', () => {
    const { ops } = makeDb()
    const s = ops.shortcut.insert('Developer', '/Users/jay/Developer', true)
    expect(s.scan).toBe(true)
    expect(ops.shortcut.findByName('Developer')!.scan).toBe(true)
  })

  it('getScanRoots returns only scan-flagged shortcuts', () => {
    const { ops } = makeDb()
    ops.shortcut.insert('Developer', '/Users/jay/Developer', true)
    ops.shortcut.insert('proj', '/path', false)
    const roots = ops.shortcut.getScanRoots()
    expect(roots).toHaveLength(1)
    expect(roots[0].name).toBe('Developer')
  })
})

describe('groups', () => {
  it('inserts and finds a group by name', () => {
    const { ops } = makeDb()
    ops.group.insert('work')
    const g = ops.group.findByName('work')
    expect(g).toBeDefined()
    expect(g!.name).toBe('work')
  })

  it('deletes a group', () => {
    const { ops } = makeDb()
    const g = ops.group.insert('tmp')
    ops.group.delete(g.id)
    expect(ops.group.findByName('tmp')).toBeUndefined()
  })
})

describe('group_shortcuts', () => {
  it('inserts and checks existence', () => {
    const { ops } = makeDb()
    const g = ops.group.insert('work')
    const s = ops.shortcut.insert('proj', '/path')
    ops.groupShortcut.insert(g.id, s.id)
    expect(ops.groupShortcut.exists(g.id, s.id)).toBe(true)
  })

  it('cascades on shortcut delete', () => {
    const { ops } = makeDb()
    const g = ops.group.insert('work')
    const s = ops.shortcut.insert('proj', '/path')
    ops.groupShortcut.insert(g.id, s.id)
    ops.shortcut.delete(s.id)
    expect(ops.groupShortcut.getByGroupId(g.id)).toHaveLength(0)
  })

  it('cascades on group delete', () => {
    const { ops } = makeDb()
    const g = ops.group.insert('work')
    const s = ops.shortcut.insert('proj', '/path')
    ops.groupShortcut.insert(g.id, s.id)
    ops.group.delete(g.id)
    expect(ops.groupShortcut.getByShortcutId(s.id)).toHaveLength(0)
  })
})

describe('scripts', () => {
  it('inserts and retrieves by shortcut_id', () => {
    const { ops } = makeDb()
    const s = ops.shortcut.insert('proj', '/path')
    ops.script.insert('npm start', s.id)
    const scripts = ops.script.getByShortcutId(s.id)
    expect(scripts).toHaveLength(1)
    expect(scripts[0].string).toBe('npm start')
  })

  it('inserts and retrieves by group_id', () => {
    const { ops } = makeDb()
    const g = ops.group.insert('work')
    ops.script.insert('echo hello', undefined, g.id)
    const scripts = ops.script.getByGroupId(g.id)
    expect(scripts).toHaveLength(1)
    expect(scripts[0].string).toBe('echo hello')
  })

  it('cascades on shortcut delete', () => {
    const { ops } = makeDb()
    const s = ops.shortcut.insert('proj', '/path')
    ops.script.insert('npm start', s.id)
    ops.shortcut.delete(s.id)
    expect(ops.script.getAll()).toHaveLength(0)
  })

  it('deleteByShortcutId removes only that shortcut scripts', () => {
    const { ops } = makeDb()
    const s = ops.shortcut.insert('proj', '/path')
    ops.script.insert('npm start', s.id)
    ops.script.deleteByShortcutId(s.id)
    expect(ops.script.getByShortcutId(s.id)).toHaveLength(0)
  })
})

describe('initDb', () => {
  it('returns a valid DatabaseSync instance', () => {
    const db = initDb(':memory:')
    expect(db).toBeInstanceOf(DatabaseSync)
  })

  it('creates all tables', () => {
    const db = initDb(':memory:')
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as { name: string }[]
    const names = tables.map((t) => t.name)
    expect(names).toContain('shortcuts')
    expect(names).toContain('groups')
    expect(names).toContain('group_shortcuts')
    expect(names).toContain('scripts')
  })

  it('adds the scan column to a shortcuts table created before it existed', () => {
    const path = join(mkdtempSync(join(tmpdir(), 'deplace-')), 'data.db')
    const legacyDb = new DatabaseSync(path)
    legacyDb.exec(`
      CREATE TABLE shortcuts (
        id   INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE COLLATE NOCASE,
        dir  TEXT NOT NULL
      );
    `)
    legacyDb.close()

    const migrated = initDb(path)
    const ops = createOps(migrated)
    const s = ops.shortcut.insert('proj', '/path', true)
    expect(s.scan).toBe(true)
    expect(ops.shortcut.findByName('proj')!.scan).toBe(true)
  })
})
