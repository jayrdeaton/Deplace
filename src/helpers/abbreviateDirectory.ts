import { homedir } from 'node:os'

export function abbreviateDirectory(dir: string): string {
  return dir.replace(homedir(), '~')
}
