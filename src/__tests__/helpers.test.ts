import { mkdirSync, mkdtempSync, rmdirSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'

import { abbreviateDirectory } from '../helpers/abbreviateDirectory'
import { getDirectories } from '../helpers/getDirectories'

describe('abbreviateDirectory', () => {
  it('replaces homedir with ~', () => {
    expect(abbreviateDirectory(`${homedir()}/Developer`)).toBe('~/Developer')
  })

  it('leaves paths without homedir unchanged', () => {
    expect(abbreviateDirectory('/tmp/some/path')).toBe('/tmp/some/path')
  })

  it('handles homedir itself', () => {
    expect(abbreviateDirectory(homedir())).toBe('~')
  })
})

describe('getDirectories', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'deplace-test-'))
    mkdirSync(join(tmpDir, 'visible'))
    mkdirSync(join(tmpDir, 'another'))
    mkdirSync(join(tmpDir, '.hidden'))
  })

  afterEach(() => {
    rmdirSync(join(tmpDir, 'visible'))
    rmdirSync(join(tmpDir, 'another'))
    rmdirSync(join(tmpDir, '.hidden'))
    rmdirSync(tmpDir)
  })

  it('returns visible subdirectories', () => {
    const dirs = getDirectories(tmpDir)
    expect(dirs).toHaveLength(2)
    expect(dirs.some((d) => d.endsWith('visible'))).toBe(true)
    expect(dirs.some((d) => d.endsWith('another'))).toBe(true)
  })

  it('excludes hidden directories', () => {
    const dirs = getDirectories(tmpDir)
    expect(dirs.every((d) => !d.includes('.hidden'))).toBe(true)
  })
})
