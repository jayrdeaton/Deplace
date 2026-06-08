import { lstatSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

export function getDirectories(dir: string): string[] {
  const isDirectory = (p: string) => lstatSync(p).isDirectory()
  const isVisible = (name: string) => !/(^|\/)\.[^/.]/g.test(name)
  return readdirSync(dir)
    .map((name) => join(dir, name))
    .filter(isVisible)
    .filter(isDirectory)
}
