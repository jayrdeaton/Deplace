import { mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import type { DatabaseSync as DatabaseSyncClass } from 'node:sqlite'

// Use a non-static module path to prevent esbuild from stripping the 'node:' prefix,
// which would produce require('sqlite') — an invalid specifier — in the CJS bundle.
const { DatabaseSync } = require(['node', 'sqlite'].join(':')) as { DatabaseSync: typeof DatabaseSyncClass }

export interface Shortcut {
  id: number
  name: string
  dir: string
}

export interface Group {
  id: number
  name: string
}

export interface GroupShortcut {
  group_id: number
  shortcut_id: number
}

export interface Script {
  id: number
  string: string
  shortcut_id: number | null
  group_id: number | null
}

const SCHEMA = `
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS shortcuts (
    id   INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE COLLATE NOCASE,
    dir  TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS groups (
    id   INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE COLLATE NOCASE
  );

  CREATE TABLE IF NOT EXISTS group_shortcuts (
    group_id    INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    shortcut_id INTEGER NOT NULL REFERENCES shortcuts(id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, shortcut_id)
  );

  CREATE TABLE IF NOT EXISTS scripts (
    id          INTEGER PRIMARY KEY,
    string      TEXT NOT NULL,
    shortcut_id INTEGER REFERENCES shortcuts(id) ON DELETE CASCADE,
    group_id    INTEGER REFERENCES groups(id) ON DELETE CASCADE
  );
`

export function initDb(dbPath: string): InstanceType<typeof DatabaseSyncClass> {
  const db = new DatabaseSync(dbPath)
  db.exec(SCHEMA)
  return db
}

export function createOps(db: InstanceType<typeof DatabaseSyncClass>) {
  const row = <T>(r: unknown): T => r as T
  const rows = <T>(r: unknown[]): T[] => r as T[]

  return {
    shortcut: {
      findByName: (name: string): Shortcut | undefined => row<Shortcut>(db.prepare('SELECT * FROM shortcuts WHERE name = ? COLLATE NOCASE').get(name)),
      findById: (id: number): Shortcut | undefined => row<Shortcut>(db.prepare('SELECT * FROM shortcuts WHERE id = ?').get(id)),
      findByDir: (dir: string): Shortcut | undefined => row<Shortcut>(db.prepare('SELECT * FROM shortcuts WHERE dir = ? COLLATE NOCASE').get(dir)),
      findByDirPrefix: (dir: string): Shortcut[] => rows<Shortcut>(db.prepare('SELECT * FROM shortcuts WHERE dir LIKE ? COLLATE NOCASE').all(`${dir}%`)),
      getAll: (): Shortcut[] => rows<Shortcut>(db.prepare('SELECT * FROM shortcuts ORDER BY name').all()),
      insert: (name: string, dir: string): Shortcut => {
        const result = db.prepare('INSERT INTO shortcuts (name, dir) VALUES (?, ?)').run(name, dir)
        return { id: Number(result.lastInsertRowid), name, dir }
      },
      delete: (id: number): void => {
        db.prepare('DELETE FROM shortcuts WHERE id = ?').run(id)
      }
    },

    group: {
      findByName: (name: string): Group | undefined => row<Group>(db.prepare('SELECT * FROM groups WHERE name = ? COLLATE NOCASE').get(name)),
      findById: (id: number): Group | undefined => row<Group>(db.prepare('SELECT * FROM groups WHERE id = ?').get(id)),
      getAll: (): Group[] => rows<Group>(db.prepare('SELECT * FROM groups ORDER BY name').all()),
      insert: (name: string): Group => {
        const result = db.prepare('INSERT INTO groups (name) VALUES (?)').run(name)
        return { id: Number(result.lastInsertRowid), name }
      },
      delete: (id: number): void => {
        db.prepare('DELETE FROM groups WHERE id = ?').run(id)
      }
    },

    groupShortcut: {
      getByGroupId: (groupId: number): GroupShortcut[] => rows<GroupShortcut>(db.prepare('SELECT * FROM group_shortcuts WHERE group_id = ?').all(groupId)),
      getByShortcutId: (shortcutId: number): GroupShortcut[] => rows<GroupShortcut>(db.prepare('SELECT * FROM group_shortcuts WHERE shortcut_id = ?').all(shortcutId)),
      exists: (groupId: number, shortcutId: number): boolean => !!db.prepare('SELECT 1 FROM group_shortcuts WHERE group_id = ? AND shortcut_id = ?').get(groupId, shortcutId),
      insert: (groupId: number, shortcutId: number): void => {
        db.prepare('INSERT OR IGNORE INTO group_shortcuts (group_id, shortcut_id) VALUES (?, ?)').run(groupId, shortcutId)
      },
      deleteByGroupId: (groupId: number): void => {
        db.prepare('DELETE FROM group_shortcuts WHERE group_id = ?').run(groupId)
      },
      deleteByShortcutId: (shortcutId: number): void => {
        db.prepare('DELETE FROM group_shortcuts WHERE shortcut_id = ?').run(shortcutId)
      }
    },

    script: {
      getByShortcutId: (shortcutId: number): Script[] => rows<Script>(db.prepare('SELECT * FROM scripts WHERE shortcut_id = ?').all(shortcutId)),
      getByGroupId: (groupId: number): Script[] => rows<Script>(db.prepare('SELECT * FROM scripts WHERE group_id = ?').all(groupId)),
      getAll: (): Script[] => rows<Script>(db.prepare('SELECT * FROM scripts').all()),
      insert: (string: string, shortcutId?: number, groupId?: number): void => {
        db.prepare('INSERT INTO scripts (string, shortcut_id, group_id) VALUES (?, ?, ?)').run(string, shortcutId ?? null, groupId ?? null)
      },
      deleteByShortcutId: (shortcutId: number): void => {
        db.prepare('DELETE FROM scripts WHERE shortcut_id = ?').run(shortcutId)
      },
      deleteByGroupId: (groupId: number): void => {
        db.prepare('DELETE FROM scripts WHERE group_id = ?').run(groupId)
      }
    }
  }
}

const configDir = join(homedir(), '.config', 'deplace')
mkdirSync(configDir, { recursive: true })
const _db = initDb(join(configDir, 'data.db'))
const ops = createOps(_db)

export const shortcut = ops.shortcut
export const group = ops.group
export const groupShortcut = ops.groupShortcut
export const script = ops.script
